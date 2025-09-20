# Splendor Blockchain V4 - Mainnet

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Go Version](https://img.shields.io/badge/Go-1.15+-blue.svg)](https://golang.org)
[![Node Version](https://img.shields.io/badge/Node-16+-green.svg)](https://nodejs.org)
[![Network Status](https://img.shields.io/badge/Mainnet-Live-brightgreen.svg)](https://mainnet-rpc.splendor.org/)

A high-performance, enterprise-grade blockchain with Congress consensus mechanism, designed for scalability, security, and exceptional developer experience.

## 🌟 Overview

Splendor Blockchain V4 is a production-ready mainnet that combines the best of Ethereum compatibility with innovative consensus mechanisms. Built for real-world applications, it offers sub-second block times, low transaction fees, and enterprise-grade security.

### Key Features

- **🌍 WORLD FIRST: Native x402 Payments**: Built-in micropayments protocol - add payments to any API in 1 line of code
- **⚡ Ultra High Performance**: 1 second block times with 10,000+ TPS capacity
- **🔧 Advanced Parallel Processing**: 49x speedup with multi-core optimization
- **🔒 Enterprise Security**: Congress consensus with Byzantine fault tolerance
- **💰 Zero Gas Fees**: Users pay $0 gas for x402 micropayments
- **🔗 Ethereum Compatible**: Full EVM compatibility with existing tools
- **🏛️ Decentralized Governance**: Community-driven validator system
- **🛡️ Battle-Tested**: Comprehensive security audits and stress testing

## 🚀 Quick Start

### Network Information

| Parameter | Value |
|-----------|-------|
| **Network Name** | Splendor Mainnet RPC |
| **RPC URL** | https://mainnet-rpc.splendor.org/ |
| **Chain ID** | 2691 |
| **Currency Symbol** | SPLD |
| **Block Explorer** | https://explorer.splendor.org/ |
| **Block Time** | 1 second |

### Connect to Mainnet

#### MetaMask Setup
1. Open MetaMask and click the network dropdown
2. Select "Add Network" → "Add a network manually"
3. Enter the network details above
4. Save and switch to Splendor RPC

#### Programmatic Access
```javascript
const { ethers } = require('ethers');

// Connect to Splendor mainnet
const provider = new ethers.JsonRpcProvider('https://mainnet-rpc.splendor.org/');

// Verify connection
const network = await provider.getNetwork();
console.log('Connected to:', network.name, 'Chain ID:', network.chainId);
```

### Verify Connection

```bash
# Clone and test
git clone https://github.com/Splendor-Protocol/splendor-blockchain-v4.git
cd splendor-blockchain-v4
npm install
npm run verify
```

## 💰 Native x402 Micropayments

### 🌍 World's First Native x402 Blockchain

Splendor is the **only blockchain** with x402 payments built into the consensus layer. Add micropayments to any API instantly:

```javascript
// Add payments to your API in 1 line
app.use('/api', splendorX402Express({
  payTo: '0xYourWallet',  // Micropayments settle straight to you
  pricing: { '/api/service': '0.0001' }  // You set the price (>=0.0001 SPLD when charging; validator share opt-in)
}));
```

> ℹ️ Splendor does **not** set a default price. You decide what each endpoint costs—as long as you charge at least 0.0001 SPLD
> when monetizing an API call.

### ⚡ Revolutionary Benefits

| Feature | **Splendor** | **Others** | **Advantage** |
|---------|-------------|------------|---------------|
| **Settlement** | **<100ms** | 2-15 seconds | **150x faster** |
| **User Fees** | **$0 gas** | $0.01-$50 gas | **100% savings** |
| **Integration** | **1 line** | 50+ lines | **50x simpler** |
| **Revenue** | **Configurable (100% to you by default)** | Variable | **Guaranteed** |

By default Splendor takes **0% validator fees** and supports a **0.0001 SPLD minimum payment**, so every request settles entirely to your wallet unless you opt in to revenue sharing.

### 🚀 Quick x402 Setup

```bash
# Setup automatically includes x402
./node-setup.sh --rpc

# Start with x402 API enabled  
./node-start.sh --rpc

# Test x402 functionality
./test-x402.sh
```

**📖 [Complete x402 Guide](docs/guides/X402_NATIVE_PAYMENTS_GUIDE.md)** - Everything you need to know about native x402

## 📚 Documentation

**📖 [Complete Documentation Hub](docs/README.md)** - Your one-stop resource for all Splendor documentation

### 📖 User Guides
- **[Getting Started Guide](docs/guides/GETTING_STARTED.md)** - Complete setup and installation
- **[x402 Native Payments](docs/guides/X402_NATIVE_PAYMENTS_GUIDE.md)** - Revolutionary micropayments system
- **[MetaMask Setup](docs/guides/METAMASK_SETUP.md)** - Wallet configuration for mainnet
- **[Validator Guide](docs/guides/VALIDATOR_GUIDE.md)** - Run validators and earn rewards
- **[RPC Setup Guide](docs/guides/RPC_SETUP_GUIDE.md)** - Set up RPC endpoints
- **[Hardhat Setup Guide](docs/guides/HARDHAT_SETUP_GUIDE.md)** - Development environment setup
- **[Troubleshooting](docs/guides/TROUBLESHOOTING.md)** - Common issues and solutions

### 🔧 Technical Documentation
- **[API Reference](docs/technical/API_REFERENCE.md)** - Complete API documentation
- **[Smart Contract Development](docs/technical/SMART_CONTRACTS.md)** - Build and deploy contracts
- **[Parallel Processing Guide](docs/technical/PARALLEL_PROCESSING_GUIDE.md)** - Advanced performance optimization

### 🏛️ Governance & Community
- **[Roadmap](docs/governance/ROADMAP.md)** - Development roadmap and future plans
- **[Contributing Guide](docs/governance/CONTRIBUTING.md)** - How to contribute to the project
- **[Security Policy](docs/governance/SECURITY.md)** - Security practices and vulnerability reporting
- **[Code of Conduct](docs/governance/CODE_OF_CONDUCT.md)** - Community guidelines

### 🚀 Deployment & Operations
- **[Deployment Guide](docs/deployment/DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[Project Structure](docs/deployment/PROJECT_STRUCTURE.md)** - Codebase organization and architecture
- **[Parallel Processing Summary](docs/deployment/PARALLEL_PROCESSING_SUMMARY.md)** - Performance optimization summary

## 🏗️ Architecture

### Congress Consensus (Delegated Proof of Stake Authority)
Splendor uses **Congress consensus** - a **Delegated Proof of Stake Authority (DPoSA)** system that provides:
- **Fast Finality**: Transactions confirmed in 1 second with deterministic block production
- **High Security**: Byzantine fault tolerance with rotating validator authorities
- **Energy Efficient**: No GPU mining or computational puzzles - pure CPU validation
- **Authority-Based**: Pre-selected validators take turns producing blocks (not competitive mining)
- **Ultra-Scalable**: Supports 10,000+ transactions per second with realistic hardware
- **Deterministic**: Block production follows a predictable schedule with 1-second intervals

### Validator Tiers
| Tier | Stake Required | Benefits |
|------|----------------|----------|
| **Bronze** | 3,947 SPLD | Entry-level validation |
| **Silver** | 39,474 SPLD | Enhanced rewards |
| **Gold** | 394,737 SPLD | Premium rewards & governance |
| **Platinum** | 3,947,368 SPLD | Elite tier with maximum rewards |

### System Contracts
Pre-deployed contracts for network governance:
- **Validators** (`0x...F000`): Validator management and staking
- **Punish** (`0x...F001`): Slashing and penalty mechanisms
- **Proposal** (`0x...F002`): Governance proposals and voting
- **Slashing** (`0x...F007`): Misbehavior detection and penalties
<!-- - **Params** (`0x...F004`): Network parameter management -->

## 💼 Use Cases

### DeFi Applications
- **DEXs**: Build decentralized exchanges with minimal fees
- **Lending**: Create lending protocols with fast settlements
- **Yield Farming**: Deploy staking and farming contracts
- **Derivatives**: Complex financial instruments with low latency

### Enterprise Solutions
- **Supply Chain**: Track goods with immutable records
- **Identity**: Decentralized identity management
- **Payments**: Fast, low-cost payment systems
- **Tokenization**: Asset tokenization and management

### Gaming & NFTs
- **GameFi**: Blockchain games with fast transactions
- **NFT Marketplaces**: Low-fee NFT trading platforms
- **Metaverse**: Virtual world economies
- **Digital Collectibles**: Unique digital asset creation

## 🛠️ Development Tools

### Supported Frameworks
- **Hardhat**: Full compatibility with existing Hardhat projects
- **Truffle**: Deploy and test with Truffle suite
- **Remix**: Browser-based development environment
- **Foundry**: Fast, portable, and modular toolkit

### Libraries & SDKs
- **JavaScript/TypeScript**: ethers.js, web3.js
- **Python**: web3.py
- **Go**: go-ethereum client
- **Java**: web3j
- **Rust**: ethers-rs

### Example: Deploy a Smart Contract

```javascript
// hardhat.config.js
module.exports = {
  networks: {
    splendor: {
      url: "https://mainnet-rpc.splendor.org/",
      chainId: 2691,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};

// Deploy
npx hardhat run scripts/deploy.js --network splendor
```

## 🔐 Security

### Audits & Testing
- **Smart Contract Audits**: All system contracts professionally audited
- **Penetration Testing**: Regular security assessments
- **Bug Bounty Program**: Community-driven security testing
- **Formal Verification**: Mathematical proofs of critical components

### Best Practices
- **Multi-signature**: Critical operations require multiple signatures
- **Time Locks**: Delayed execution for sensitive changes
- **Upgrade Patterns**: Secure contract upgrade mechanisms
- **Access Controls**: Role-based permission systems

## 🌐 Ecosystem

### Infrastructure
- **RPC Providers**: Multiple redundant RPC endpoints
- **Block Explorers**: Real-time blockchain exploration
- **Indexing Services**: Fast data querying and analytics
- **Monitoring Tools**: Network health and performance metrics

### DApps & Protocols
- **DEXs**: Decentralized exchanges for token trading
- **Lending Protocols**: Borrow and lend digital assets
- **NFT Marketplaces**: Create, buy, and sell NFTs
- **Gaming Platforms**: Blockchain-based games and metaverses

### Developer Resources
- **Documentation**: Comprehensive guides and tutorials
- **SDKs**: Development kits for multiple languages
- **Templates**: Starter projects and boilerplates
- **Community**: Active developer community and support

## 📊 Network Statistics

### Performance Metrics
- **Block Time**: 1 second average
- **Current TPS**: ~5,000-10,000 TPS (typical validators)
- **Realistic Maximum**: ~15,000 TPS (high-end hardware)
- **CPU Optimization Target**: 20,000-30,000 TPS with advanced multi-core processing
- **Long-term Goal**: 50,000+ TPS with datacenter-class CPU infrastructure
- **Parallel Processing**: Multi-core optimization for transaction processing
- **Finality**: Instant (single block confirmation)
- **Uptime**: 99.9%+ network availability

#### TPS Calculation - Theoretical vs Reality

**Network Configuration:**
- **Genesis Gas Limit**: 20,000,000,000 (20B gas per block)
- **Validator Gas Limit**: 20,000,000,000 (20B gas per block)
- **Transaction Pool Capacity**: 300,000+ transactions (200k pending + 100k queued)
- **Per-Account Limits**: 20,000 transactions per account (10k pending + 10k queued)

**Theoretical Maximum (Math Only):**
```javascript
Gas per Block: 20,000,000,000 (20B)
Transaction Cost: 21,000 gas (simple transfer)
Block Time: 1 second

Theoretical Ceiling: 20,000,000,000 ÷ 21,000 ≈ 952,380 TPS
```

**Real-World Performance:**
The theoretical 952,380 TPS assumes infinite CPU, disk, and networking resources. Actual throughput is limited by hardware bottlenecks:

- **4-core validator**: ~2,000-5,000 TPS
- **8-core validator**: ~5,000-10,000 TPS
- **16-core validator**: ~10,000-15,000 TPS  
- **32-core validator**: ~15,000-25,000 TPS
- **64-core validator cluster**: ~25,000-50,000 TPS (with optimized infrastructure)

**Hardware Requirements for Realistic TPS:**
- **CPU**: 8-32 cores (modern multi-core processors)
- **RAM**: 16-64 GB
- **Storage**: Fast NVMe SSDs (1+ GB/s write speed)
- **Network**: 1-10 Gbps networking
- **Infrastructure**: Standard server-class hardware with multi-core optimization

#### Transaction Costs (SPLD = $0.38)
```javascript
Simple Transfer: 21,000 gas × 1 gwei = 0.000021 SPLD = $0.000008
Token Transfer: 65,000 gas × 1 gwei = 0.000065 SPLD = $0.0000247  
Contract Creation: 1,886,885 gas × 1 gwei = 0.001887 SPLD = $0.000717
```

### Economic Model
- **Gas Fees**: Starting at 1 gwei (0.000000001 SPLD)
- **Validator Rewards**: 60% of gas fees
- **Staker Rewards**: 30% of gas fees
- **Development Fund**: 10% of gas fees

## 🤝 Community

### Get Involved
- **Telegram**: [Splendor Labs](https://t.me/SplendorLabs) - Join our developer community
- **Twitter**: [@SplendorLabs](https://x.com/splendorlabs) - Follow for updates and announcements
- **GitHub**: Contribute to the codebase
- **Medium**: Read technical articles and updates

### Governance
- **Proposals**: Submit improvement proposals
- **Voting**: Participate in network governance
- **Validator Program**: Become a network validator
- **Ambassador Program**: Represent Splendor globally

## 🚀 Getting Started

### For Users
1. **Set up MetaMask**: Follow our [MetaMask guide](docs/guides/METAMASK_SETUP.md)
2. **Get SPLD tokens**: Purchase from supported exchanges
3. **Explore DApps**: Try decentralized applications
4. **Join Community**: Connect with other users

### For Developers
1. **Read Documentation**: Start with [Getting Started](docs/guides/GETTING_STARTED.md)
2. **Set up Environment**: Install required tools
3. **Deploy Contracts**: Follow [Smart Contract guide](docs/technical/SMART_CONTRACTS.md)
4. **Build DApps**: Create decentralized applications

### For Validators
1. **Review Requirements**: Check [Validator Guide](docs/guides/VALIDATOR_GUIDE.md)
2. **Acquire Stake**: Get minimum 3,947 SPLD
3. **Set up Infrastructure**: Deploy validator node
4. **Start Validating**: Earn rewards and secure the network

## 📈 Roadmap

### Q1 2025
- ✅ Mainnet Launch
- ✅ Core Infrastructure Deployment
- ✅ Initial Validator Set
- ✅ Basic DApp Ecosystem

### Q2 2025
- ✅ Enhanced Developer Tools
- ✅ Mobile Wallet Integration
- ✅ Cross-chain Bridges
- ✅ Institutional Partnerships

### Q3 2025
- ✅ Layer 2 Solutions
- ✅ Advanced Governance Features
- ✅ Enterprise Integrations
- ✅ Global Expansion

### Q4 2025 (Current)
- 🔄 **CPU-Only Optimization** - Enhanced CPU-based validation with no GPU mining requirements
- 🔄 Interoperability Protocols
- 🔄 Advanced Privacy Features
- 🔄 Quantum-Resistant Security
- 🔄 Ecosystem Maturation

### 2026 Preview
- 📋 50,000+ TPS Achievement with Advanced Hardware
- 📋 Advanced Sharding Implementation
- 📋 AI-Powered Development Suite
- 📋 Enterprise-Grade Features

## 🆘 Support

### Documentation
- [Getting Started](docs/guides/GETTING_STARTED.md)
- [API Reference](docs/technical/API_REFERENCE.md)
- [Troubleshooting](docs/guides/TROUBLESHOOTING.md)

### Community Support
- **Telegram**: [Splendor Labs](https://t.me/SplendorLabs) - Real-time community help
- **Twitter**: [@SplendorLabs](https://x.com/splendorlabs) - Updates and announcements
- **GitHub Issues**: Report bugs and request features
- **Stack Overflow**: Tag questions with `splendor-blockchain`

### Professional Support
- **Enterprise Support**: Dedicated support for businesses
- **Consulting Services**: Custom development and integration
- **Training Programs**: Developer education and certification

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

Splendor Blockchain V4 is production software, but blockchain technology involves inherent risks. Users should:
- Understand the technology before using
- Never invest more than they can afford to lose
- Keep private keys secure and backed up
- Verify all transactions before confirming
- Stay informed about network updates and changes

---

**Built with ❤️ by the Splendor Team**

*Empowering the decentralized future, one block at a time.*

---
*Last updated: January 11, 2025*
