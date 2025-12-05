const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    try {
        console.log("🔍 Contract Verification Tool\n");

        // Load deployment info
        const deploymentPath = path.join(
            __dirname,
            "../backend/src/blockchain/deployment.json"
        );

        if (!fs.existsSync(deploymentPath)) {
            throw new Error(
                "Deployment file not found. Please deploy the contract first using 'npm run deploy'."
            );
        }

        const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
        const { contractAddress, network } = deployment;

        console.log(`Network: ${network}`);
        console.log(`Contract Address: ${contractAddress}\n`);

        // Check if we can verify on this network
        if (network === "localhost" || network === "hardhat") {
            console.log("⚠️  Contract verification is not available for local networks.");
            console.log("Deploy to a public testnet or mainnet to verify.");
            return;
        }

        // Check for API key
        const apiKeyName =
            network.includes("polygon") || network.includes("amoy")
                ? "POLYGONSCAN_API_KEY"
                : "ETHERSCAN_API_KEY";

        if (!process.env[apiKeyName]) {
            console.log(`⚠️  ${apiKeyName} not found in environment variables.`);
            console.log(`\nTo verify your contract, you need to:`);
            console.log(`1. Get an API key from ${network.includes("polygon") ? "PolygonScan" : "Etherscan"}`);
            console.log(`2. Add it to your .env file: ${apiKeyName}=your_api_key_here`);
            console.log(`3. Run this script again\n`);
            return;
        }

        console.log("🚀 Starting verification process...\n");

        // Verify the contract
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: [], // ProductPassport has no constructor arguments
        });

        console.log("\n✅ Contract verified successfully!");
        console.log(`\nView your verified contract at:`);

        if (network.includes("amoy")) {
            console.log(`https://amoy.polygonscan.com/address/${contractAddress}#code`);
        } else if (network.includes("polygon")) {
            console.log(`https://polygonscan.com/address/${contractAddress}#code`);
        } else {
            console.log(`https://etherscan.io/address/${contractAddress}#code`);
        }

    } catch (error) {
        if (error.message.includes("Already Verified")) {
            console.log("✅ Contract is already verified!");
        } else if (error.message.includes("API key")) {
            console.error("\n❌ API key error:", error.message);
            console.error("Please check your API key in the .env file.");
        } else {
            console.error("\n❌ Verification failed:", error.message);
            console.error("\nTroubleshooting tips:");
            console.error("1. Make sure the contract is deployed");
            console.error("2. Wait a few minutes after deployment before verifying");
            console.error("3. Check that your API key is valid");
            console.error("4. Ensure you're using the correct network");
        }

        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        process.exit(1);
    });
