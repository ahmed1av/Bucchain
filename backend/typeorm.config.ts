import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'verichain',
    password: process.env.DB_PASSWORD || 'verichain_secure',
    database: process.env.DB_NAME || 'verichain_db',
    entities: ['src/entities/**/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
    synchronize: false, // Always false for production/migrations
    logging: process.env.NODE_ENV === 'development',
});
