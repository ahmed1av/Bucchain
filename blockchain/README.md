# BUCChain Blockchain - Smart Contracts

Enterprise-grade blockchain smart contracts for product lifecycle management and supply chain tracking on the BUCChain platform.

## 🌟 Features

- **Product Passport Management**: Create and manage digital product passports
- **Supply Chain Tracking**: Real-time tracking of products through the supply chain
- **Manufacturer Authorization**: Role-based access control for authorized manufacturers
- **Emergency Controls**: Pausable contract for emergency situations
- **Input Validation**: Comprehensive validation to prevent invalid data
- **Event Logging**: Complete audit trail through blockchain events
- **Gas Optimized**: Optimized for minimal gas consumption

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v16.x or higher
- **npm**: v8.x or higher
- **Git**: Latest version

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd BUCChain/blockchain

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy the environment template
cp .env.example ../.env

# Edit the .env file with your configuration
# IMPORTANT: Add your private key and RPC URL
```

**Required Environment Variables:**

- `DEPLOYER_PRIVATE_KEY`: Your wallet's private key (without 0x prefix)
- `BLOCKCHAIN_RPC_URL`: RPC endpoint for your blockchain network
- `POLYGONSCAN_API_KEY`: API key for contract verification (optional)

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests with gas reporting
npm run test:gas
```

### 5. Deploy Contract

#### Local Network (for development)

```bash
# Terminal 1: Start local Hardhat node
npm run node

# Terminal 2: Deploy to local network
npm run deploy:local
```

#### Polygon Amoy Testnet

```bash
npm run deploy:amoy
```

#### Custom Network

```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

## 🔧 Contract Interaction

### Interactive CLI Tool

Use the interactive script to interact with your deployed contract:

```bash
npm run interact
```

This provides a menu-driven interface for:

- Adding/removing manufacturers
- Creating products
- Updating product status
- Adding tracking events
- Viewing product information
- Pausing/unpausing the contract

### Programmatic Access

```javascript
const { ethers } = require("hardhat");

// Get contract instance
const ProductPassport = await ethers.getContractFactory("ProductPassport");
const contract = ProductPassport.attach(contractAddress);

// Create a product
const tx = await contract.createProduct(
  "Laptop",
  "Manufactured",
  100,
  "Factory A"
);
await tx.wait();
```

## 📝 Contract Verification

Verify your contract on block explorers:

```bash
npm run verify
```

Or manually:

```bash
npx hardhat verify --network polygonAmoy <CONTRACT_ADDRESS>
```

## 🏗️ Project Structure

```
blockchain/
├── contracts/
│   └── ProductPassport.sol      # Main smart contract
├── scripts/
│   ├── deploy.js                # Deployment script
│   ├── interact.js              # Interactive CLI tool
│   └── verify.js                # Verification script
├── test/
│   └── ProductPassport.test.js  # Test suite
├── hardhat.config.js            # Hardhat configuration
├── package.json                 # Dependencies and scripts
├── .env.example                 # Environment template
└── README.md                    # This file
```

## 🔐 Smart Contract API

### Core Functions

#### `createProduct(name, status, quantity, location)`

Creates a new product with the specified details.

**Parameters:**

- `name` (string): Product name (max 256 chars)
- `status` (string): Initial status (max 256 chars)
- `quantity` (uint256): Product quantity (must be > 0)
- `location` (string): Current location (max 256 chars)

**Returns:** Product ID

**Emits:** `ProductCreated(productId, name, manufacturer)`

#### `updateProductStatus(productId, status, location)`

Updates the status and location of an existing product.

**Parameters:**

- `productId` (uint256): ID of the product
- `status` (string): New status (max 256 chars)
- `location` (string): New location (max 256 chars)

**Emits:** `ProductUpdated(productId, status, location)`

#### `addTrackingEvent(productId, location, status, description)`

Adds a tracking event to a product's history.

**Parameters:**

- `productId` (uint256): ID of the product
- `location` (string): Event location (max 256 chars)
- `status` (string): Event status (max 256 chars)
- `description` (string): Event description (max 1024 chars)

**Emits:** `TrackingEventAdded(productId, location, status)`

### Manufacturer Management (Owner Only)

#### `addManufacturer(address)`

Authorizes a new manufacturer.

**Emits:** `ManufacturerAdded(manufacturer, addedBy)`

#### `removeManufacturer(address)`

Removes authorization from a manufacturer.

**Emits:** `ManufacturerRemoved(manufacturer, removedBy)`

### Emergency Controls (Owner Only)

#### `pause()`

Pauses all state-changing operations.

**Emits:** `ContractPaused(by)`

#### `unpause()`

Resumes normal contract operations.

**Emits:** `ContractUnpaused(by)`

### View Functions

#### `getProduct(productId)`

Returns complete product information.

#### `getProductTracking(productId)`

Returns all tracking events for a product.

#### `getProductsCount()`

Returns total number of products created.

#### `isManufacturerAuthorized(address)`

Checks if an address is an authorized manufacturer.

## 🧪 Testing

The project includes comprehensive tests covering:

- Deployment and initialization
- Manufacturer management
- Product creation and updates
- Tracking events
- Access control
- Input validation
- Pausable functionality
- Edge cases and error handling

**Coverage Goal:** >90%

Run tests with coverage:

```bash
npm run test:coverage
```

## ⛽ Gas Optimization

The contract is optimized for gas efficiency:

- Efficient struct packing
- Optimized storage access patterns
- Minimal external calls
- Event-based logging for off-chain data

Check gas usage:

```bash
npm run test:gas
```

Check contract size:

```bash
npm run size
```

## 🔒 Security Considerations

### Input Validation

- All string inputs are validated for non-empty values
- Maximum length limits prevent large-string attacks
- Quantity must be greater than zero

### Access Control

- Owner-only functions for critical operations
- Manufacturer authorization required for product operations
- Cannot remove contract owner from manufacturers

### Emergency Controls

- Pausable pattern for emergency situations
- Owner can pause/unpause contract
- All state-changing functions respect pause status

### Best Practices

- ✅ Uses latest Solidity version (0.8.20)
- ✅ Includes comprehensive events for transparency
- ✅ Implements proper access control
- ✅ Validates all inputs
- ✅ Follows checks-effects-interactions pattern

## 🐛 Troubleshooting

### Common Issues

**Error: "Insufficient funds"**

- Ensure your deployer account has enough ETH/MATIC
- Check balance: The deployment script shows your balance

**Error: "Network connection failed"**

- Verify your RPC URL in `.env`
- Check network connectivity
- Try a different RPC endpoint

**Error: "Nonce too high"**

- Reset your account nonce in MetaMask
- Wait a few moments and try again

**Verification fails**

- Ensure contract is deployed
- Wait 1-2 minutes after deployment
- Check your API key is correct
- Verify you're on the correct network

## 📊 Available Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:gas` | Run tests with gas reporting |
| `npm run compile` | Compile smart contracts |
| `npm run deploy` | Deploy to configured network |
| `npm run deploy:local` | Deploy to local Hardhat network |
| `npm run deploy:amoy` | Deploy to Polygon Amoy testnet |
| `npm run node` | Start local Hardhat node |
| `npm run interact` | Interactive contract CLI |
| `npm run verify` | Verify contract on block explorer |
| `npm run size` | Check contract size |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Polygon Documentation](https://docs.polygon.technology/)
- [Ethers.js Documentation](https://docs.ethers.org/)

## 📞 Support

For questions or issues:

1. Check this README
2. Review the [EXAMPLES.md](./EXAMPLES.md) file
3. Search existing issues
4. Create a new issue with details

---

**Built with ❤️ for the BUCChain platform**
