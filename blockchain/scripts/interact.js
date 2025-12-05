const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Promisify question function
function question(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
    try {
        console.log("🔧 ProductPassport Contract Interaction Tool\n");
        console.log("=".repeat(60));

        // Load deployment info
        const deploymentPath = path.join(
            __dirname,
            "../backend/src/blockchain/deployment.json"
        );

        if (!fs.existsSync(deploymentPath)) {
            throw new Error(
                "Deployment file not found. Please deploy the contract first."
            );
        }

        const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
        const contractAddress = deployment.contractAddress;

        console.log(`Network: ${hre.network.name}`);
        console.log(`Contract Address: ${contractAddress}\n`);

        // Get signer
        const [signer] = await hre.ethers.getSigners();
        console.log(`Your Address: ${signer.address}`);

        const balance = await hre.ethers.provider.getBalance(signer.address);
        console.log(`Your Balance: ${hre.ethers.formatEther(balance)} ETH\n`);

        // Get contract instance
        const ProductPassport = await hre.ethers.getContractFactory("ProductPassport");
        const contract = ProductPassport.attach(contractAddress);

        // Check if paused
        const isPaused = await contract.paused();
        console.log(`Contract Status: ${isPaused ? "⏸️  PAUSED" : "✅ Active"}\n`);

        console.log("=".repeat(60));

        // Main menu loop
        let running = true;
        while (running) {
            console.log("\nSelect an operation:");
            console.log("1. Add Manufacturer");
            console.log("2. Remove Manufacturer");
            console.log("3. Check Manufacturer Status");
            console.log("4. Create Product");
            console.log("5. Update Product Status");
            console.log("6. Add Tracking Event");
            console.log("7. Get Product Information");
            console.log("8. Get Product Tracking History");
            console.log("9. Get Products Count");
            console.log("10. Pause Contract (Owner only)");
            console.log("11. Unpause Contract (Owner only)");
            console.log("0. Exit\n");

            const choice = await question("Enter your choice: ");

            switch (choice.trim()) {
                case "1":
                    await addManufacturer(contract);
                    break;
                case "2":
                    await removeManufacturer(contract);
                    break;
                case "3":
                    await checkManufacturer(contract);
                    break;
                case "4":
                    await createProduct(contract);
                    break;
                case "5":
                    await updateProductStatus(contract);
                    break;
                case "6":
                    await addTrackingEvent(contract);
                    break;
                case "7":
                    await getProduct(contract);
                    break;
                case "8":
                    await getProductTracking(contract);
                    break;
                case "9":
                    await getProductsCount(contract);
                    break;
                case "10":
                    await pauseContract(contract);
                    break;
                case "11":
                    await unpauseContract(contract);
                    break;
                case "0":
                    running = false;
                    console.log("\n👋 Goodbye!");
                    break;
                default:
                    console.log("❌ Invalid choice. Please try again.");
            }
        }

        rl.close();
    } catch (error) {
        console.error("\n❌ Error:", error.message);
        rl.close();
        process.exit(1);
    }
}

async function addManufacturer(contract) {
    try {
        const address = await question("Enter manufacturer address: ");

        console.log("\n⏳ Adding manufacturer...");
        const tx = await contract.addManufacturer(address);
        console.log(`Transaction hash: ${tx.hash}`);

        const receipt = await tx.wait();
        console.log(`✅ Manufacturer added successfully! (Block: ${receipt.blockNumber})`);
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

async function removeManufacturer(contract) {
    try {
        const address = await question("Enter manufacturer address: ");

        console.log("\n⏳ Removing manufacturer...");
        const tx = await contract.removeManufacturer(address);
        console.log(`Transaction hash: ${tx.hash}`);

        const receipt = await tx.wait();
        console.log(`✅ Manufacturer removed successfully! (Block: ${receipt.blockNumber})`);
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

async function checkManufacturer(contract) {
    try {
        const address = await question("Enter manufacturer address: ");

        const isAuthorized = await contract.isManufacturerAuthorized(address);
        console.log(`\nManufacturer ${address}:`);
        console.log(`Status: ${isAuthorized ? "✅ Authorized" : "❌ Not Authorized"}`);
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

async function createProduct(contract) {
    try {
        console.log("\n📦 Create New Product");
        const name = await question("Product name: ");
        const status = await question("Status (e.g., Manufactured): ");
        const quantity = await question("Quantity: ");
        const location = await question("Location: ");

        console.log("\n⏳ Creating product...");
        const tx = await contract.createProduct(name, status, parseInt(quantity), location);
        console.log(`Transaction hash: ${tx.hash}`);

        const receipt = await tx.wait();

        // Find ProductCreated event
        const event = receipt.logs.find((log) => {
            try {
                return contract.interface.parseLog(log).name === "ProductCreated";
            } catch {
                return false;
            }
        });

        if (event) {
            const parsedEvent = contract.interface.parseLog(event);
            console.log(`✅ Product created successfully!`);
            console.log(`Product ID: ${parsedEvent.args.productId}`);
            console.log(`Block: ${receipt.blockNumber}`);
        }
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

async function updateProductStatus(contract) {
    try {
        const productId = await question("Product ID: ");
        const status = await question("New status: ");
        const location = await question("New location: ");

        console.log("\n⏳ Updating product...");
        const tx = await contract.updateProductStatus(productId, status, location);
        console.log(`Transaction hash: ${tx.hash}`);

        const receipt = await tx.wait();
        console.log(`✅ Product updated successfully! (Block: ${receipt.blockNumber})`);
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

async function addTrackingEvent(contract) {
    try {
        const productId = await question("Product ID: ");
        const location = await question("Location: ");
        const status = await question("Status: ");
        const description = await question("Description: ");

        console.log("\n⏳ Adding tracking event...");
        const tx = await contract.addTrackingEvent(productId, location, status, description);
        console.log(`Transaction hash: ${tx.hash}`);

        const receipt = await tx.wait();
        console.log(`✅ Tracking event added successfully! (Block: ${receipt.blockNumber})`);
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

async function getProduct(contract) {
    try {
        const productId = await question("Product ID: ");

        const product = await contract.getProduct(productId);

        console.log("\n📦 Product Information:");
        console.log("=".repeat(60));
        console.log(`ID: ${product.id}`);
        console.log(`Name: ${product.name}`);
        console.log(`Status: ${product.status}`);
        console.log(`Quantity: ${product.quantity}`);
        console.log(`Location: ${product.location}`);
        console.log(`Manufacturer: ${product.manufacturer}`);
        console.log(`Created: ${new Date(Number(product.createdAt) * 1000).toLocaleString()}`);
        console.log(`Updated: ${new Date(Number(product.updatedAt) * 1000).toLocaleString()}`);
        console.log("=".repeat(60));
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

async function getProductTracking(contract) {
    try {
        const productId = await question("Product ID: ");

        const tracking = await contract.getProductTracking(productId);

        console.log(`\n📍 Tracking History for Product ${productId}:`);
        console.log("=".repeat(60));

        if (tracking.length === 0) {
            console.log("No tracking events found.");
        } else {
            tracking.forEach((event, index) => {
                console.log(`\n${index + 1}. ${event.status}`);
                console.log(`   Location: ${event.location}`);
                console.log(`   Description: ${event.description}`);
                console.log(`   Time: ${new Date(Number(event.timestamp) * 1000).toLocaleString()}`);
            });
        }
        console.log("\n" + "=".repeat(60));
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

async function getProductsCount(contract) {
    try {
        const count = await contract.getProductsCount();
        console.log(`\n📊 Total Products: ${count}`);
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

async function pauseContract(contract) {
    try {
        const confirm = await question("Are you sure you want to pause the contract? (yes/no): ");

        if (confirm.toLowerCase() === "yes") {
            console.log("\n⏳ Pausing contract...");
            const tx = await contract.pause();
            console.log(`Transaction hash: ${tx.hash}`);

            const receipt = await tx.wait();
            console.log(`✅ Contract paused successfully! (Block: ${receipt.blockNumber})`);
        } else {
            console.log("Operation cancelled.");
        }
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

async function unpauseContract(contract) {
    try {
        const confirm = await question("Are you sure you want to unpause the contract? (yes/no): ");

        if (confirm.toLowerCase() === "yes") {
            console.log("\n⏳ Unpausing contract...");
            const tx = await contract.unpause();
            console.log(`Transaction hash: ${tx.hash}`);

            const receipt = await tx.wait();
            console.log(`✅ Contract unpaused successfully! (Block: ${receipt.blockNumber})`);
        } else {
            console.log("Operation cancelled.");
        }
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
