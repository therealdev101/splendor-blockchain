/**
 * Splendor x402 Native Payments Middleware
 * Ultra-fast micropayments for HTTP APIs
 */

const axios = require('axios');
const crypto = require('crypto');

class SplendorX402Middleware {
  constructor(options = {}) {
    this.rpcUrl = options.rpcUrl || 'http://localhost:80';
    this.facilitatorUrl = options.facilitatorUrl || this.rpcUrl;
    this.payTo = options.payTo;
    this.pricing = options.pricing || {};
    this.defaultPrice = Object.prototype.hasOwnProperty.call(options, 'defaultPrice')
      ? options.defaultPrice
      : null;
    this.network = options.network || 'splendor';
    this.chainId = options.chainId || 2691;
    
    if (!this.payTo) {
      throw new Error('payTo address is required');
    }
  }

  // Express.js middleware
  express(options = {}) {
    const localPricing = { ...this.pricing, ...options.pricing };
    
    return async (req, res, next) => {
      try {
        const price = this.getPrice(req.path, localPricing);

        if (price === null || price === undefined) {
          return res.status(500).json({
            error: 'x402 price not configured for this resource',
            details: 'Add a pricing rule for this path or supply defaultPrice when initializing the middleware.'
          });
        }

        if (Number(price) === 0) {
          return next(); // Free endpoint
        }

        const paymentHeader = req.headers['x-payment'];
        
        if (!paymentHeader) {
          return this.sendPaymentRequired(res, req.path, price);
        }

        const isValid = await this.verifyPayment(paymentHeader, price);
        
        if (!isValid.success) {
          return this.sendPaymentRequired(res, req.path, price, isValid.error);
        }

        // Payment verified, settle it
        const settlement = await this.settlePayment(paymentHeader, price);
        
        if (!settlement.success) {
          return res.status(402).json({
            error: 'Payment settlement failed',
            details: settlement.error
          });
        }

        // Add payment info to request
        req.x402 = {
          paid: true,
          amount: price,
          txHash: settlement.txHash,
          payer: isValid.payerAddress
        };

        // Add settlement info to response headers
        res.set('X-Payment-Response', Buffer.from(JSON.stringify({
          success: true,
          txHash: settlement.txHash,
          networkId: 'splendor'
        })).toString('base64'));

        next();
      } catch (error) {
        console.error('X402 Middleware Error:', error);
        res.status(500).json({ error: 'Payment processing error' });
      }
    };
  }

  // Fastify plugin
  fastify(fastify, options, done) {
    const localPricing = { ...this.pricing, ...options.pricing };
    
    fastify.addHook('preHandler', async (request, reply) => {
      const price = this.getPrice(request.url, localPricing);

      if (price === null || price === undefined) {
        reply.code(500).send({
          error: 'x402 price not configured for this resource',
          details: 'Add a pricing rule for this path or supply defaultPrice when registering the plugin.'
        });
        return;
      }

      if (Number(price) === 0) {
        return; // Free endpoint
      }

      const paymentHeader = request.headers['x-payment'];
      
      if (!paymentHeader) {
        return this.sendPaymentRequiredFastify(reply, request.url, price);
      }

      const isValid = await this.verifyPayment(paymentHeader, price);
      
      if (!isValid.success) {
        return this.sendPaymentRequiredFastify(reply, request.url, price, isValid.error);
      }

      const settlement = await this.settlePayment(paymentHeader, price);
      
      if (!settlement.success) {
        reply.code(402).send({
          error: 'Payment settlement failed',
          details: settlement.error
        });
        return;
      }

      request.x402 = {
        paid: true,
        amount: price,
        txHash: settlement.txHash,
        payer: isValid.payerAddress
      };

      reply.header('X-Payment-Response', Buffer.from(JSON.stringify({
        success: true,
        txHash: settlement.txHash,
        networkId: 'splendor'
      })).toString('base64'));
    });

    done();
  }

  // Get price for a specific path
  getPrice(path, pricing = this.pricing) {
    // Exact match first
    if (pricing[path]) {
      return pricing[path];
    }
    
    // Pattern matching
    for (const [pattern, price] of Object.entries(pricing)) {
      if (this.matchPath(path, pattern)) {
        return price;
      }
    }
    
    if (this.defaultPrice !== null && this.defaultPrice !== undefined) {
      return this.defaultPrice;
    }

    return null;
  }

  // Simple path matching (supports wildcards)
  matchPath(path, pattern) {
    if (pattern.includes('*')) {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      return regex.test(path);
    }
    return path === pattern;
  }

  // Verify payment with Splendor blockchain
  async verifyPayment(paymentHeader, expectedAmount) {
    try {
      const paymentData = JSON.parse(Buffer.from(paymentHeader, 'base64').toString());
      
      const requirements = {
        scheme: 'exact',
        network: this.network,
        maxAmountRequired: this.spldToWei(expectedAmount),
        resource: 'api-access',
        description: 'API access payment',
        mimeType: 'application/json',
        payTo: this.payTo,
        maxTimeoutSeconds: 300,
        asset: '0x0000000000000000000000000000000000000000'
      };

      const response = await axios.post(`${this.facilitatorUrl}`, {
        jsonrpc: '2.0',
        method: 'x402_verify',
        params: [requirements, paymentData],
        id: 1
      });

      if (response.data.error) {
        return { success: false, error: response.data.error.message };
      }

      const result = response.data.result;
      return {
        success: result.isValid,
        error: result.invalidReason,
        payerAddress: result.payerAddress
      };
    } catch (error) {
      console.error('Payment verification failed:', error);
      return { success: false, error: 'Verification failed' };
    }
  }

  // Settle payment on Splendor blockchain
  async settlePayment(paymentHeader, expectedAmount) {
    try {
      const paymentData = JSON.parse(Buffer.from(paymentHeader, 'base64').toString());
      
      const requirements = {
        scheme: 'exact',
        network: this.network,
        maxAmountRequired: this.spldToWei(expectedAmount),
        resource: 'api-access',
        description: 'API access payment',
        mimeType: 'application/json',
        payTo: this.payTo,
        maxTimeoutSeconds: 300,
        asset: '0x0000000000000000000000000000000000000000'
      };

      const response = await axios.post(`${this.facilitatorUrl}`, {
        jsonrpc: '2.0',
        method: 'x402_settle',
        params: [requirements, paymentData],
        id: 1
      });

      if (response.data.error) {
        return { success: false, error: response.data.error.message };
      }

      const result = response.data.result;
      return {
        success: result.success,
        error: result.error,
        txHash: result.txHash
      };
    } catch (error) {
      console.error('Payment settlement failed:', error);
      return { success: false, error: 'Settlement failed' };
    }
  }

  // Convert SPLD amount (string/number) to wei (18 decimals)
  spldToWei(amountInput) {
    if (amountInput === null || amountInput === undefined) {
      throw new Error('SPLD amount is required for conversion');
    }

    const amount = Number(amountInput);

    if (Number.isNaN(amount)) {
      throw new Error(`Invalid SPLD amount: ${amountInput}`);
    }

    const wei = Math.floor(amount * 1e18);
    return '0x' + wei.toString(16);
  }

  // Send 402 Payment Required response (Express)
  sendPaymentRequired(res, resource, price, error = null) {
    const paymentRequirements = {
      x402Version: 1,
      accepts: [{
        scheme: 'exact',
        network: this.network,
        maxAmountRequired: this.spldToWei(price),
        resource: resource,
        description: `Payment required for ${resource}`,
        mimeType: 'application/json',
        payTo: this.payTo,
        maxTimeoutSeconds: 300,
        asset: '0x0000000000000000000000000000000000000000'
      }],
      error: error
    };

    res.status(402).json(paymentRequirements);
  }

  // Send 402 Payment Required response (Fastify)
  sendPaymentRequiredFastify(reply, resource, price, error = null) {
    const paymentRequirements = {
      x402Version: 1,
      accepts: [{
        scheme: 'exact',
        network: this.network,
        maxAmountRequired: this.spldToWei(price),
        resource: resource,
        description: `Payment required for ${resource}`,
        mimeType: 'application/json',
        payTo: this.payTo,
        maxTimeoutSeconds: 300,
        asset: '0x0000000000000000000000000000000000000000'
      }],
      error: error
    };

    reply.code(402).send(paymentRequirements);
  }

  // Get supported payment methods
  async getSupported() {
    try {
      const response = await axios.post(`${this.facilitatorUrl}`, {
        jsonrpc: '2.0',
        method: 'x402_supported',
        params: [],
        id: 1
      });

      return response.data.result;
    } catch (error) {
      console.error('Failed to get supported methods:', error);
      return { kinds: [] };
    }
  }
}

// Factory function for easy usage
function createSplendorX402Middleware(options) {
  return new SplendorX402Middleware(options);
}

// Express middleware factory
function splendorX402Express(options) {
  const middleware = new SplendorX402Middleware(options);
  return middleware.express();
}

// Fastify plugin factory
function splendorX402Fastify(options) {
  return function(fastify, opts, done) {
    const middleware = new SplendorX402Middleware({ ...options, ...opts });
    middleware.fastify(fastify, opts, done);
  };
}

module.exports = {
  SplendorX402Middleware,
  createSplendorX402Middleware,
  splendorX402Express,
  splendorX402Fastify
};
