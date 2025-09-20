# Splendor Native x402 Payments Guide

## 🚀 World's First Native Blockchain x402 Implementation

Splendor is the **first and only blockchain** with **native x402 payment support** built directly into the consensus layer. Add micropayments to any API in 1 line of code with zero gas fees for users.

---

## 🚀 Quick Start

### 1. Setup (Automatic)
```bash
# x402 automatically configures during node setup
./node-setup.sh --rpc

# Start node with x402 API enabled
./node-start.sh --rpc
```

### 2. Add Payments to Your API (1 Line!)
```javascript
const { splendorX402Express } = require('./x402-middleware');

// Add payments in 1 line!
app.use('/api', splendorX402Express({
  payTo: '0xYourWalletAddress',  // Payments settle directly to you
  pricing: {
    '/api/weather': '0.0001',    // Developer-set price (>=0.0001 SPLD when charging)
    '/api/premium': '0.01'       // Higher priced premium endpoint
  }
}));

// That's it! Your API now accepts x402 payments
app.get('/api/weather', (req, res) => {
  res.json({
    weather: 'Sunny, 75°F',
    payment: req.x402,
    settlement: '0.0001 SPLD'  // Entire payment hits your wallet (validator rewards opt-in)
  });
});
```

> ℹ️ Splendor only enforces the **minimum** payment of **0.0001 SPLD** for paid endpoints. You control the actual price for each
> resource—set whatever value makes sense for your application.

### 3. Test Your Integration
```bash
# Test x402 functionality
./test-x402.sh

# Test your API
curl http://localhost:3000/api/premium
# Returns 402 Payment Required with payment instructions
```

---

## 🆚 Why Splendor x402 is Revolutionary

### Splendor vs Others (Coinbase, Ethereum, etc.)

| Feature | **Splendor Native** | **Coinbase x402** | **Ethereum** | **Advantage** |
|---------|-------------------|------------------|--------------|---------------|
| **Settlement Speed** | **<100ms** | 2-15 seconds | 12-15 seconds | **150x faster** |
| **User Gas Fees** | **$0** | $0.01-$50 | $1-$50 | **100% savings** |
| **Developer Revenue** | **Configurable (100% to you by default)** | Variable | N/A | **Predictable** |
| **Integration** | **1 line of code** | 50+ lines | Complex | **50x simpler** |
| **Consensus Level** | **✅ Native** | ❌ External | ❌ External | **Revolutionary** |
| **TPS Capability** | **Millions** | ~50,000 | ~15 | **20x+ higher** |
| **Minimum Payment** | **0.0001 SPLD (~$0.000038)** | $0.01+ | $1+ | **100x+ smaller** |
| **Signature Type** | **Simple message** | EIP-3009 | Complex | **User-friendly** |

### Key Advantages

#### 1. **True Micropayments**
- **Splendor**: 0.0001 SPLD minimum, zero gas fees
- **Others**: $0.01+ minimum due to gas costs

#### 2. **Instant Settlement**
- **Splendor**: <100ms consensus-level settlement
- **Others**: 2-15 seconds for blockchain confirmation

- **Splendor**: Validator revenue sharing is opt-in (default 0%), instant settlement
- **Others**: Variable fees, complex integration

#### 4. **User Experience**
- **Splendor**: Simple message signing, zero gas
- **Others**: Complex EIP-3009, gas fees

#### 5. **Scalability**
- **Splendor**: Millions of TPS (bypasses tx pool)
- **Others**: Limited by blockchain TPS

---

## 🔧 Technical Architecture

### 1. Consensus Layer Integration

Unlike external solutions, Splendor's x402 is built into the consensus engine:

```go
// In consensus/congress/congress_govern.go
if tx.Type() == types.X402TxType {
    // Native x402 settlement in consensus
    var p x402Payload
    if err = rlp.DecodeBytes(tx.Data(), &p); err != nil {
        vmerr = fmt.Errorf("x402: invalid payload: %w", err)
        return
    }
    
    // Direct state manipulation - no gas fees
    state.SubBalance(p.From, p.Value)
    state.AddBalance(p.To, p.Value)

    // Validator rewards are tracked separately via the X402ValidatorRewards module
    processValidatorRevenue(p, tx.Hash())
}
```

### 2. Native RPC API

```bash
# Check supported payment methods
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"x402_supported","params":[],"id":1}' \
  http://localhost:80

# Verify payment without executing
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"x402_verify","params":[requirements, payload],"id":1}' \
  http://localhost:80

# Settle payment instantly
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"x402_settle","params":[requirements, payload],"id":1}' \
  http://localhost:80
```

#### Payment Requirements Object (`requirements`)

```json
{
  "scheme": "exact",
  "network": "splendor",
  "maxAmountRequired": "0x38d7ea4c68000", // 0.0001 SPLD
  "resource": "/api/premium",
  "description": "Premium API access",
  "mimeType": "application/json",
  "payTo": "0xYourWalletAddress",
  "maxTimeoutSeconds": 300,
  "asset": "0x0000000000000000000000000000000000000000"
}
```

- `maxAmountRequired` must be supplied as a hex-encoded Wei value (`hexutil.Big`).
- `payTo` must be a valid Splendor address; settlement goes directly to this wallet.
- `asset` should be the native token address (`0x0…0`) for SPLD payments.

#### Payment Payload Object (`payload`)

```json
{
  "x402Version": 1,
  "scheme": "exact",
  "network": "splendor",
  "payload": {
    "from": "0xClientAddress",
    "to": "0xYourWalletAddress",
    "value": "0x38d7ea4c68000",
    "validAfter": 1714761600,
    "validBefore": 1714762200,
    "nonce": "0x4c7d1ed414474e4033ac29ccb8653d9a00000000000000000000000000000001",
    "signature": "0x…65-byte-secp256k1-signature"
  }
}
```

- `value` uses the same units as `maxAmountRequired`.
- `validAfter` / `validBefore` are UNIX timestamps (seconds).
- `signature` is an EIP-191 compatible signature; the API accepts both strict and compatibility modes depending on `X402_STRICT_VERIFY`.

#### x402 RPC Methods Summary

| Method | Description |
|--------|-------------|
| `x402_supported()` | Returns supported payment schemes and networks. |
| `x402_verify(requirements, payload)` | Validates a payment envelope without settling funds. |
| `x402_settle(requirements, payload)` | Performs verification and submits the typed `0x50` x402 settlement transaction. |
| `x402_getValidatorX402Revenue(address)` | Returns the tracked validator reward share for `address`. |
| `x402_getX402RevenueStats()` | Aggregated statistics from `X402ValidatorRewards` (totals, top validators, daily volume). |
| `x402_getTopPerformingValidators(limit)` | Lists validators ranked by AI-assisted performance metrics. |
| `x402_setValidatorFeeShare(percentage)` | Adjusts the percentage of each payment earmarked for validators (default 0%). |
| `x402_setDistributionMode(mode)` | Switches validator reward distribution between `performance`, `equal`, or `proportional`. |

---

## 💰 Revenue Model

### Settlement & Validator Rewards

- **Settlement:** The full payment amount is transferred to your `payTo` address with no protocol deductions.
- **Validator rewards:** A configurable share (default **0%**) is tracked by `X402ValidatorRewards` only if you opt in.
- **Protocol fee:** Disabled by default. You can point `X402_TREASURY_ADDRESS` to enable protocol funding when needed.

```text
Example payment: 0.0001 SPLD
├── Settlement: 0.0001 SPLD credited to your API wallet immediately
├── Validator share (tracked): 0.0000 SPLD (0% default — configure to enable)
└── Protocol share (tracked): 0.0000 SPLD (disabled by default)

Blockchain Charges: $0.00 ← NO GAS, NO RPC FEES
```

### Revenue Examples

- **Weather API**: 1000 requests/day × 0.0001 SPLD = **0.1 SPLD/day (~3 SPLD/month)** for you
- **AI Images**: 100 images/day × $0.05 = **$135/month** for you  
- **Analytics**: 50 reports/day × $0.10 = **$135/month** for you

---

## 🔄 Upgrading Existing Chains

### Can I upgrade my existing Splendor chain?
**YES!** You can add x402 support to existing chains without starting fresh:

#### Hot Upgrade Process (No Downtime)
1. **Copy x402 files** to existing installation
2. **Update backend.go** to register x402 API
3. **Update transaction.go** to support X402TxType
4. **Rebuild node** with x402 support
5. **Restart with x402 API** enabled
6. **Install middleware** and configure

#### Zero Cost Upgrade
- ✅ **No blockchain fees** for x402 functionality
- ✅ **No upgrade costs** or licensing fees
- ✅ **No ongoing charges** for x402 payments
- ✅ **Backward compatible** - existing transactions continue working

---

## 🧪 Testing & Deployment

### Test x402 Functionality
```bash
# Verify x402 integration
./verify-x402-integration.sh

# Test x402 API
./test-x402.sh

# Test middleware
cd x402-middleware && npm test
```

### Production Deployment
```bash
# Start node with x402 API
./node-start.sh --rpc

# x402 API automatically included in:
# --http.api db,eth,net,web3,personal,txpool,miner,debug,x402
```

### Monitor Your Revenue
```bash
# Check your wallet balance (settled payments)
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0xYourWallet","latest"],"id":1}' \
  http://localhost:80

# Get x402 revenue statistics (tracked validator share if enabled)
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"x402_getX402RevenueStats","params":[],"id":1}' \
  http://localhost:80

# Check validator-specific rewards
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"x402_getValidatorX402Revenue","params":["0xValidator"],"id":1}' \
  http://localhost:80
```

---

## 🎯 Use Cases

### API Monetization
- **Weather APIs**: 0.0001 SPLD per request
- **Stock Data**: $0.01 per quote
- **News Articles**: $0.005 per article
- **Maps/Directions**: $0.002 per route

### AI Services
- **Image Generation**: $0.05 per image
- **Text Generation**: $0.01 per request
- **Voice Synthesis**: $0.02 per audio file
- **Translation**: 0.0001 SPLD per word

### Data Services
- **Analytics Reports**: $0.10 per report
- **Database Queries**: 0.0001 SPLD per query
- **File Storage**: 0.0001 SPLD per MB
- **CDN Access**: $0.0001 per file

---

## 🔧 Advanced Configuration

### Middleware Options
```javascript
const middleware = splendorX402Express({
  // Required
  payTo: '0xYourWalletAddress',        // Your wallet (receives the settlement)

  // Optional
  rpcUrl: 'http://localhost:80',       // Splendor RPC endpoint
  network: 'splendor',                 // Network name
  chainId: 2691,                       // Splendor chain ID
  defaultPrice: '0.005',               // Optional fallback you configure (example only)

  // Flexible pricing
  pricing: {
    '/api/free': '0',                  // Free endpoint
    '/api/premium': '0.0001',          // Fixed price at the network minimum
    '/api/data/*': '0.01',             // Wildcard pattern
    '/api/analytics': '0.05',          // Higher value content
    '/api/bulk/*': '0.0001'            // Bulk pricing
  }
});
```

> ⚠️ Leave no paid path unpriced: if a request reaches the middleware without a matching rule and you haven't supplied
> `defaultPrice`, the server responds with `500 x402 price not configured` so you can explicitly choose a price before launching.

### Environment Variables
```bash
# x402 Configuration (auto-added during setup; amounts in SPLD)
X402_ENABLED=true
X402_NETWORK=splendor
X402_CHAIN_ID=2691
X402_MIN_PAYMENT=0.0001
X402_MAX_PAYMENT=1000.0
```

---

## 🎉 Conclusion

Splendor's native x402 implementation represents a **paradigm shift** in blockchain payments:

- **🌍 World's first** native x402 blockchain
- **⚡ 150x faster** than external x402 solutions
- **💰 Zero gas fees** for users
- **🔧 1-line integration** for developers
- **📈 Configurable validator share** that defaults to 0% so you keep every payment unless you opt in
- **🔄 Hot upgrades** for existing chains

**Welcome to the future of internet payments!** 🚀

---

*Built with ❤️ by the Splendor team - The first blockchain to make micropayments practical for developers.*
