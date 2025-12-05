import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;
  private contractAddress: string;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      const rpcUrl =
        this.configService.get<string>('BLOCKCHAIN_RPC_URL') ||
        'http://localhost:8545';
      const privateKey = this.configService.get<string>(
        'BLOCKCHAIN_PRIVATE_KEY',
      );
      this.contractAddress =
        this.configService.get<string>('BLOCKCHAIN_CONTRACT_ADDRESS') || '';

      this.provider = new ethers.JsonRpcProvider(rpcUrl);

      if (privateKey) {
        this.wallet = new ethers.Wallet(privateKey, this.provider);
      }

      if (this.contractAddress) {
        // Load ABI
        const abiPath = path.join(
          process.cwd(),
          '..',
          'blockchain',
          'artifacts',
          'contracts',
          'ProductPassport.sol',
          'ProductPassport.json',
        );
        if (fs.existsSync(abiPath)) {
          const contractJson = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
          this.contract = new ethers.Contract(
            this.contractAddress,
            contractJson.abi,
            this.wallet || this.provider,
          );
          this.logger.log('Blockchain service initialized (Real Mode)');
        } else {
          this.logger.warn(`Contract ABI not found at ${abiPath}`);
        }
      } else {
        this.logger.warn('Contract address not configured');
      }
    } catch (error) {
      this.logger.error('Failed to initialize blockchain service', error);
    }
  }

  async getConnectionStatus(): Promise<{
    connected: boolean;
    network: string;
  }> {
    try {
      const network = await this.provider.getNetwork();
      return {
        connected: true,
        network: network.name,
      };
    } catch (error) {
      return {
        connected: false,
        network: 'unknown',
      };
    }
  }

  async registerProduct(productData: {
    trackingId: string;
    name: string;
    description?: string;
    manufacturer: string;
  }): Promise<{ success: boolean; txHash?: string; productId?: number }> {
    try {
      if (!this.contract || !this.wallet) {
        throw new Error('Blockchain not initialized or wallet missing');
      }

      this.logger.log(`Registering product on blockchain: ${productData.name}`);

      // Call createProduct function on smart contract
      // function createProduct(string memory _name, string memory _status, uint256 _quantity, string memory _location)
      const tx = await this.contract.createProduct(
        productData.name,
        'CREATED',
        1, // Default quantity
        'Factory', // Default location
      );

      this.logger.log(`Transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();

      // Parse event to get productId
      // event ProductCreated(uint256 indexed productId, string name, address manufacturer);
      let productId = 0;
      for (const log of receipt.logs) {
        try {
          const parsedLog = this.contract.interface.parseLog(log);
          if (parsedLog && parsedLog.name === 'ProductCreated') {
            productId = Number(parsedLog.args[0]);
            break;
          }
        } catch (e) {
          // Ignore parse errors for other events
        }
      }

      this.logger.log(`Product registered successfully on-chain: ${productId}`);

      return {
        success: true,
        txHash: receipt.hash,
        productId: productId,
      };
    } catch (error) {
      this.logger.error('Failed to register product on blockchain:', error);
      return { success: false };
    }
  }

  async verifyProduct(
    trackingId: string,
  ): Promise<{ verified: boolean; data?: any }> {
    try {
      // In a real scenario, trackingId might map to productId or be stored in a mapping
      // For now, assuming trackingId is the productId for simplicity or we need a lookup
      const productId = parseInt(trackingId);
      if (isNaN(productId)) {
        return { verified: false };
      }

      const product = await this.contract.getProduct(productId);

      // Product struct: id, name, status, quantity, location, manufacturer, createdAt, updatedAt
      if (product && product[0] !== 0n) {
        return {
          verified: true,
          data: {
            id: Number(product[0]),
            name: product[1],
            status: product[2],
            manufacturer: product[5],
            timestamp: Number(product[6]),
          },
        };
      }
      return { verified: false };
    } catch (error) {
      this.logger.error('Failed to verify product:', error);
      return { verified: false };
    }
  }

  // ... other methods (updateProduct, etc.) would follow similar pattern
  async updateProduct(
    productData: any,
  ): Promise<{ success: boolean; txHash?: string }> {
    // Placeholder for update implementation
    return { success: true };
  }

  async getProduct(productId: number): Promise<any> {
    // Placeholder
    return null;
  }

  async getProductHistory(productId: number): Promise<any[]> {
    // Placeholder
    return [];
  }

  async trackProduct(productId: number): Promise<any[]> {
    // Placeholder
    return [];
  }
}
