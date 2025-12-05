# ProductPassport Smart Contract - Usage Examples

This document provides practical examples for interacting with the ProductPassport smart contract using both Hardhat scripts and direct web3/ethers.js integration.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Product Lifecycle Workflow](#product-lifecycle-workflow)
3. [Manufacturer Management](#manufacturer-management)
4. [Emergency Controls](#emergency-controls)
5. [Event Listening](#event-listening)
6. [Backend Integration](#backend-integration)
7. [Error Handling](#error-handling)

---

## Basic Setup

### Using Hardhat

```javascript
const { ethers } = require("hardhat");

async function getContractInstance() {
  const contractAddress = "0x..."; // Your deployed contract address
  const ProductPassport = await ethers.getContractFactory("ProductPassport");
  const contract = ProductPassport.attach(contractAddress);
  return contract;
}
```

### Using Ethers.js (Frontend/Backend)

```javascript
const { ethers } = require("ethers");
const contractABI = require("./ProductPassport.abi.json");

// Connect to provider
const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");

// Create wallet instance
const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);

// Get contract instance
const contractAddress = "0x...";
const contract = new ethers.Contract(contractAddress, contractABI, wallet);
```

---

## Product Lifecycle Workflow

### Complete Example: From Manufacturing to Delivery

```javascript
const { ethers } = require("hardhat");

async function completeProductLifecycle() {
  const [owner, manufacturer, distributor] = await ethers.getSigners();
  const contract = await getContractInstance();

  console.log("=== Product Lifecycle Demo ===\n");

  // Step 1: Owner authorizes manufacturer
  console.log("Step 1: Authorizing manufacturer...");
  let tx = await contract.connect(owner).addManufacturer(manufacturer.address);
  await tx.wait();
  console.log("✅ Manufacturer authorized\n");

  // Step 2: Manufacturer creates product
  console.log("Step 2: Creating product...");
  tx = await contract.connect(manufacturer).createProduct(
    "Electric Bicycle Model X",
    "Manufactured",
    50,
    "Factory - Shanghai, China"
  );
  const receipt = await tx.wait();
  
  // Extract product ID from event
  const event = receipt.logs.find(log => {
    try {
      return contract.interface.parseLog(log).name === "ProductCreated";
    } catch {
      return false;
    }
  });
  const productId = contract.interface.parseLog(event).args.productId;
  console.log(`✅ Product created with ID: ${productId}\n`);

  // Step 3: Add quality inspection tracking event
  console.log("Step 3: Adding quality inspection...");
  tx = await contract.connect(manufacturer).addTrackingEvent(
    productId,
    "QA Department - Shanghai",
    "Quality Inspected",
    "Passed all quality checks. Serial numbers: EB-X-2024-001 to EB-X-2024-050"
  );
  await tx.wait();
  console.log("✅ Quality inspection recorded\n");

  // Step 4: Update status to shipped
  console.log("Step 4: Shipping to warehouse...");
  tx = await contract.connect(manufacturer).updateProductStatus(
    productId,
    "Shipped",
    "Port of Shanghai"
  );
  await tx.wait();
  console.log("✅ Status updated to Shipped\n");

  // Step 5: Add shipping tracking event
  console.log("Step 5: Recording shipping event...");
  tx = await contract.connect(manufacturer).addTrackingEvent(
    productId,
    "Cargo Ship MV Pacific",
    "In Transit",
    "Loaded on vessel. ETA: 15 days. Container: CONT123456"
  );
  await tx.wait();
  console.log("✅ Shipping event recorded\n");

  // Step 6: Arrival at destination
  console.log("Step 6: Recording arrival...");
  tx = await contract.connect(manufacturer).addTrackingEvent(
    productId,
    "Port of Los Angeles",
    "Arrived",
    "Container unloaded. Customs clearance in progress."
  );
  await tx.wait();
  console.log("✅ Arrival recorded\n");

  // Step 7: Final delivery
  console.log("Step 7: Final delivery...");
  tx = await contract.connect(manufacturer).updateProductStatus(
    productId,
    "Delivered",
    "Warehouse - Los Angeles, USA"
  );
  await tx.wait();
  console.log("✅ Delivery completed\n");

  // Retrieve and display full product information
  console.log("=== Final Product Information ===\n");
  const product = await contract.getProduct(productId);
  console.log(`Product ID: ${product.id}`);
  console.log(`Name: ${product.name}`);
  console.log(`Current Status: ${product.status}`);
  console.log(`Quantity: ${product.quantity}`);
  console.log(`Current Location: ${product.location}`);
  console.log(`Manufacturer: ${product.manufacturer}`);
  console.log(`Created: ${new Date(Number(product.createdAt) * 1000).toLocaleString()}`);
  console.log(`Last Updated: ${new Date(Number(product.updatedAt) * 1000).toLocaleString()}\n`);

  // Display tracking history
  console.log("=== Tracking History ===\n");
  const tracking = await contract.getProductTracking(productId);
  tracking.forEach((event, index) => {
    console.log(`${index + 1}. ${event.status}`);
    console.log(`   Location: ${event.location}`);
    console.log(`   Description: ${event.description}`);
    console.log(`   Time: ${new Date(Number(event.timestamp) * 1000).toLocaleString()}\n`);
  });
}
```

---

## Manufacturer Management

### Adding Multiple Manufacturers

```javascript
async function setupManufacturerNetwork() {
  const contract = await getContractInstance();
  const [owner] = await ethers.getSigners();

  const manufacturerAddresses = [
    "0x1234...",  // Factory A
    "0x5678...",  // Factory B
    "0x9abc...",  // Factory C
  ];

  console.log("Adding manufacturers...\n");

  for (const address of manufacturerAddresses) {
    try {
      const tx = await contract.connect(owner).addManufacturer(address);
      await tx.wait();
      console.log(`✅ Added manufacturer: ${address}`);
    } catch (error) {
      console.error(`❌ Failed to add ${address}:`, error.message);
    }
  }

  // Verify all manufacturers
  console.log("\nVerifying manufacturers...\n");
  for (const address of manufacturerAddresses) {
    const isAuthorized = await contract.isManufacturerAuthorized(address);
    console.log(`${address}: ${isAuthorized ? "✅ Authorized" : "❌ Not Authorized"}`);
  }
}
```

### Removing a Manufacturer

```javascript
async function removeManufacturerExample() {
  const contract = await getContractInstance();
  const [owner] = await ethers.getSigners();

  const manufacturerToRemove = "0x1234...";

  // Check current status
  let isAuthorized = await contract.isManufacturerAuthorized(manufacturerToRemove);
  console.log(`Before: ${isAuthorized ? "Authorized" : "Not Authorized"}`);

  // Remove manufacturer
  const tx = await contract.connect(owner).removeManufacturer(manufacturerToRemove);
  await tx.wait();
  console.log("✅ Manufacturer removed");

  // Verify removal
  isAuthorized = await contract.isManufacturerAuthorized(manufacturerToRemove);
  console.log(`After: ${isAuthorized ? "Authorized" : "Not Authorized"}`);
}
```

---

## Emergency Controls

### Pausing the Contract

```javascript
async function emergencyPause() {
  const contract = await getContractInstance();
  const [owner, manufacturer] = await ethers.getSigners();

  console.log("=== Emergency Pause Demo ===\n");

  // Check initial state
  let isPaused = await contract.paused();
  console.log(`Contract paused: ${isPaused}\n`);

  // Create a product (should work)
  console.log("Creating product before pause...");
  try {
    const tx = await contract.connect(manufacturer).createProduct(
      "Test Product",
      "Manufactured",
      10,
      "Factory A"
    );
    await tx.wait();
    console.log("✅ Product created successfully\n");
  } catch (error) {
    console.error("❌ Failed:", error.message);
  }

  // Pause the contract
  console.log("Pausing contract...");
  let tx = await contract.connect(owner).pause();
  await tx.wait();
  console.log("✅ Contract paused\n");

  // Try to create product (should fail)
  console.log("Attempting to create product while paused...");
  try {
    tx = await contract.connect(manufacturer).createProduct(
      "Another Product",
      "Manufactured",
      10,
      "Factory A"
    );
    await tx.wait();
    console.log("✅ Product created");
  } catch (error) {
    console.error("❌ Failed (expected):", error.message.split('\n')[0]);
  }

  console.log("\nUnpausing contract...");
  tx = await contract.connect(owner).unpause();
  await tx.wait();
  console.log("✅ Contract unpaused\n");

  // Create product again (should work)
  console.log("Creating product after unpause...");
  try {
    tx = await contract.connect(manufacturer).createProduct(
      "Post-Pause Product",
      "Manufactured",
      10,
      "Factory A"
    );
    await tx.wait();
    console.log("✅ Product created successfully");
  } catch (error) {
    console.error("❌ Failed:", error.message);
  }
}
```

---

## Event Listening

### Listening for Product Creation Events

```javascript
async function listenForProductCreation() {
  const contract = await getContractInstance();

  console.log("Listening for ProductCreated events...\n");

  // Listen for new events
  contract.on("ProductCreated", (productId, name, manufacturer, event) => {
    console.log("🎉 New Product Created!");
    console.log(`   Product ID: ${productId}`);
    console.log(`   Name: ${name}`);
    console.log(`   Manufacturer: ${manufacturer}`);
    console.log(`   Block: ${event.log.blockNumber}`);
    console.log(`   Transaction: ${event.log.transactionHash}\n`);
  });

  // Keep the script running
  await new Promise(() => {});
}
```

### Listening for All Events

```javascript
async function listenForAllEvents() {
  const contract = await getContractInstance();

  console.log("Listening for all contract events...\n");

  // Product Created
  contract.on("ProductCreated", (productId, name, manufacturer) => {
    console.log(`📦 Product Created: ${name} (ID: ${productId})`);
  });

  // Product Updated
  contract.on("ProductUpdated", (productId, status, location) => {
    console.log(`🔄 Product ${productId} Updated: ${status} at ${location}`);
  });

  // Tracking Event Added
  contract.on("TrackingEventAdded", (productId, location, status) => {
    console.log(`📍 Tracking: Product ${productId} - ${status} at ${location}`);
  });

  // Manufacturer Added
  contract.on("ManufacturerAdded", (manufacturer, addedBy) => {
    console.log(`👤 Manufacturer Added: ${manufacturer} by ${addedBy}`);
  });

  // Manufacturer Removed
  contract.on("ManufacturerRemoved", (manufacturer, removedBy) => {
    console.log(`👤 Manufacturer Removed: ${manufacturer} by ${removedBy}`);
  });

  // Contract Paused
  contract.on("ContractPaused", (by) => {
    console.log(`⏸️  Contract Paused by ${by}`);
  });

  // Contract Unpaused
  contract.on("ContractUnpaused", (by) => {
    console.log(`▶️  Contract Unpaused by ${by}`);
  });
}
```

### Querying Past Events

```javascript
async function queryPastEvents() {
  const contract = await getContractInstance();

  // Get all ProductCreated events from the last 1000 blocks
  const currentBlock = await ethers.provider.getBlockNumber();
  const fromBlock = currentBlock - 1000;

  const filter = contract.filters.ProductCreated();
  const events = await contract.queryFilter(filter, fromBlock, currentBlock);

  console.log(`Found ${events.length} product creation events:\n`);

  events.forEach((event, index) => {
    const { productId, name, manufacturer } = event.args;
    console.log(`${index + 1}. Product ID: ${productId}`);
    console.log(`   Name: ${name}`);
    console.log(`   Manufacturer: ${manufacturer}`);
    console.log(`   Block: ${event.blockNumber}\n`);
  });
}
```

---

## Backend Integration

### Express.js API Example

```javascript
const express = require("express");
const { ethers } = require("ethers");
const contractABI = require("./ProductPassport.abi.json");

const app = express();
app.use(express.json());

// Setup provider and contract
const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  wallet
);

// Create product endpoint
app.post("/api/products", async (req, res) => {
  try {
    const { name, status, quantity, location } = req.body;

    // Validate input
    if (!name || !status || !quantity || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create product on blockchain
    const tx = await contract.createProduct(name, status, quantity, location);
    const receipt = await tx.wait();

    // Extract product ID from event
    const event = receipt.logs.find(log => {
      try {
        return contract.interface.parseLog(log).name === "ProductCreated";
      } catch {
        return false;
      }
    });

    const productId = contract.interface.parseLog(event).args.productId;

    res.json({
      success: true,
      productId: productId.toString(),
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber
    });

  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get product endpoint
app.get("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await contract.getProduct(productId);

    res.json({
      id: product.id.toString(),
      name: product.name,
      status: product.status,
      quantity: product.quantity.toString(),
      location: product.location,
      manufacturer: product.manufacturer,
      createdAt: new Date(Number(product.createdAt) * 1000).toISOString(),
      updatedAt: new Date(Number(product.updatedAt) * 1000).toISOString()
    });

  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get product tracking endpoint
app.get("/api/products/:id/tracking", async (req, res) => {
  try {
    const productId = req.params.id;
    const tracking = await contract.getProductTracking(productId);

    const formattedTracking = tracking.map(event => ({
      productId: event.productId.toString(),
      location: event.location,
      status: event.status,
      description: event.description,
      timestamp: new Date(Number(event.timestamp) * 1000).toISOString()
    }));

    res.json(formattedTracking);

  } catch (error) {
    console.error("Error fetching tracking:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("API server running on port 3000");
});
```

---

## Error Handling

### Handling Common Errors

```javascript
async function createProductWithErrorHandling() {
  const contract = await getContractInstance();
  const [signer] = await ethers.getSigners();

  try {
    const tx = await contract.createProduct(
      "Product Name",
      "Status",
      100,
      "Location"
    );
    await tx.wait();
    console.log("✅ Product created successfully");

  } catch (error) {
    // Handle specific errors
    if (error.message.includes("Not authorized manufacturer")) {
      console.error("❌ Error: You are not an authorized manufacturer");
      console.log("💡 Solution: Contact the contract owner to be added as a manufacturer");
      
    } else if (error.message.includes("Contract is paused")) {
      console.error("❌ Error: Contract is currently paused");
      console.log("💡 Solution: Wait for the contract to be unpaused or contact the owner");
      
    } else if (error.message.includes("String cannot be empty")) {
      console.error("❌ Error: One or more required fields are empty");
      console.log("💡 Solution: Provide valid non-empty values for all fields");
      
    } else if (error.message.includes("String exceeds maximum length")) {
      console.error("❌ Error: Input string is too long");
      console.log("💡 Solution: Keep strings under 256 characters (1024 for descriptions)");
      
    } else if (error.message.includes("Quantity must be greater than zero")) {
      console.error("❌ Error: Quantity must be positive");
      console.log("💡 Solution: Provide a quantity greater than 0");
      
    } else if (error.message.includes("insufficient funds")) {
      console.error("❌ Error: Insufficient funds for transaction");
      console.log("💡 Solution: Add more ETH/MATIC to your account");
      
    } else {
      console.error("❌ Unexpected error:", error.message);
    }
  }
}
```

### Input Validation Before Sending Transaction

```javascript
function validateProductInput(name, status, quantity, location) {
  const errors = [];

  // Check for empty strings
  if (!name || name.trim().length === 0) {
    errors.push("Product name is required");
  }
  if (!status || status.trim().length === 0) {
    errors.push("Status is required");
  }
  if (!location || location.trim().length === 0) {
    errors.push("Location is required");
  }

  // Check string lengths
  if (name && name.length > 256) {
    errors.push("Product name must be 256 characters or less");
  }
  if (status && status.length > 256) {
    errors.push("Status must be 256 characters or less");
  }
  if (location && location.length > 256) {
    errors.push("Location must be 256 characters or less");
  }

  // Check quantity
  if (!quantity || quantity <= 0) {
    errors.push("Quantity must be greater than 0");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

async function createProductSafely(name, status, quantity, location) {
  // Validate input before sending transaction
  const validation = validateProductInput(name, status, quantity, location);
  
  if (!validation.isValid) {
    console.error("❌ Validation failed:");
    validation.errors.forEach(error => console.error(`   - ${error}`));
    return;
  }

  // If validation passes, create the product
  const contract = await getContractInstance();
  try {
    const tx = await contract.createProduct(name, status, quantity, location);
    const receipt = await tx.wait();
    console.log("✅ Product created successfully");
    return receipt;
  } catch (error) {
    console.error("❌ Transaction failed:", error.message);
    throw error;
  }
}
```

---

## Running the Examples

Save any example to a file (e.g., `examples/lifecycle.js`) and run:

```bash
npx hardhat run examples/lifecycle.js --network localhost
```

Or for testnet:

```bash
npx hardhat run examples/lifecycle.js --network polygonAmoy
```

---

**For more information, see the [README.md](./README.md) file.**
