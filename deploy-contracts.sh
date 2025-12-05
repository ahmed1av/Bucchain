#!/bin/bash
echo "🚀 Deploying BUCChain Smart Contracts..."
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
