const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  try {
    console.log("🚀 Deploying ProductPassport contract...\n");

    // Validate environment
    const network = hre.network.name;
    console.log(`Network: ${network}`);

    // Get deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    // Check deployer balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    const balanceInEth = hre.ethers.formatEther(balance);
    console.log("Account balance:", balanceInEth, "ETH");

    // Validate sufficient balance
    const minBalance = network === "localhost" ? 0 : 0.01;
    if (parseFloat(balanceInEth) < minBalance) {
      throw new Error(
        `Insufficient balance. Required: ${minBalance} ETH, Current: ${balanceInEth} ETH`
      );
    }

    console.log("\n📋 Preparing deployment...");

    // Get contract factory
    const ProductPassport = await hre.ethers.getContractFactory("ProductPassport");

    // Estimate gas for deployment
    const deploymentData = ProductPassport.bytecode;
    const estimatedGas = await hre.ethers.provider.estimateGas({
      data: deploymentData,
    });
    console.log("Estimated gas for deployment:", estimatedGas.toString());

    // Get gas price
    const feeData = await hre.ethers.provider.getFeeData();
    const gasPrice = feeData.gasPrice;
    console.log("Current gas price:", hre.ethers.formatUnits(gasPrice, "gwei"), "gwei");

    // Calculate estimated cost
    const estimatedCost = estimatedGas * gasPrice;
    console.log(
      "Estimated deployment cost:",
      hre.ethers.formatEther(estimatedCost),
      "ETH"
    );

    console.log("\n🔨 Deploying contract...");

    // Deploy contract
    const productPassport = await ProductPassport.deploy();

    console.log("⏳ Waiting for deployment transaction...");
    await productPassport.waitForDeployment();

    const contractAddress = await productPassport.getAddress();
    console.log("✅ ProductPassport deployed to:", contractAddress);

    // Get deployment transaction details
    const deployTx = productPassport.deploymentTransaction();
    if (!deployTx) {
      throw new Error("Deployment transaction not found");
    }

    console.log("Transaction hash:", deployTx.hash);

    // Wait for confirmations based on network
    const confirmations = network === "localhost" ? 1 : 3;
    console.log(`\n⏳ Waiting for ${confirmations} confirmation(s)...`);

    const receipt = await deployTx.wait(confirmations);

    console.log("✅ Confirmed!");
    console.log("Gas used:", receipt.gasUsed.toString());
    console.log("Block number:", receipt.blockNumber);

    // Calculate actual cost
    const actualCost = receipt.gasUsed * receipt.gasPrice;
    console.log("Actual deployment cost:", hre.ethers.formatEther(actualCost), "ETH");

    // Prepare deployment info
    const deployment = {
      network: network,
      contractAddress: contractAddress,
      deployerAddress: deployer.address,
      deploymentDate: new Date().toISOString(),
      blockNumber: receipt.blockNumber,
      transactionHash: deployTx.hash,
      gasUsed: receipt.gasUsed.toString(),
      gasPrice: receipt.gasPrice.toString(),
      deploymentCost: hre.ethers.formatEther(actualCost),
    };

    // Save deployment info
    const deploymentPath = path.join(
      __dirname,
      "../backend/src/blockchain/deployment.json"
    );
    const deploymentDir = path.dirname(deploymentPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(deploymentDir)) {
      console.log("\n📁 Creating deployment directory...");
      fs.mkdirSync(deploymentDir, { recursive: true });
    }

    fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
    console.log("\n📝 Deployment info saved to:", deploymentPath);

    // Save ABI
    const abiPath = path.join(deploymentDir, "ProductPassport.abi.json");
    const artifact = await hre.artifacts.readArtifact("ProductPassport");
    fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
    console.log("📝 Contract ABI saved to:", abiPath);

    // Update .env with contract address
    const envPath = path.join(__dirname, "../.env");

    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, "utf8");

      // Update or add CONTRACT_ADDRESS
      if (envContent.includes("CONTRACT_ADDRESS=")) {
        envContent = envContent.replace(
          /CONTRACT_ADDRESS=.*/,
          `CONTRACT_ADDRESS=${contractAddress}`
        );
      } else {
        envContent += `\nCONTRACT_ADDRESS=${contractAddress}\n`;
      }

      fs.writeFileSync(envPath, envContent);
      console.log("✅ Updated .env with contract address");
    } else {
      console.log("⚠️  Warning: .env file not found. Contract address not saved to .env");
    }

    console.log("\n🎉 Deployment complete!\n");
    console.log("=".repeat(60));
    console.log("Next steps:");
    console.log("1. Restart backend server to use new contract address");
    console.log("2. Test blockchain integration via /blockchain/status endpoint");

    if (network !== "localhost" && network !== "hardhat") {
      console.log("3. Verify contract on block explorer:");
      console.log(`   npx hardhat verify --network ${network} ${contractAddress}`);
      console.log("\n   Or use the verify script:");
      console.log("   npm run verify");
    }

    console.log("=".repeat(60));

  } catch (error) {
    console.error("\n❌ Deployment failed!\n");

    // Provide helpful error messages
    if (error.message.includes("insufficient funds")) {
      console.error("Error: Insufficient funds for deployment");
      console.error("Solution: Add more ETH to the deployer account");
    } else if (error.message.includes("network")) {
      console.error("Error: Network connection issue");
      console.error("Solution: Check your RPC URL and network connectivity");
    } else if (error.message.includes("nonce")) {
      console.error("Error: Nonce mismatch");
      console.error("Solution: Wait a moment and try again, or reset your account nonce");
    } else {
      console.error("Error:", error.message);
    }

    console.error("\nFull error details:");
    console.error(error);

    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
