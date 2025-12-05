import { DataSource } from 'typeorm';
import { User } from '../src/entities/user.entity';
import { Supplier } from '../src/entities/supplier.entity';
import { Product } from '../src/entities/product.entity';
import { Tracking } from '../src/entities/tracking.entity';
import { Order } from '../src/entities/order.entity';
import { Contract } from '../src/entities/contract.entity';
import { Review } from '../src/entities/review.entity';
import { UserBehavior } from '../src/entities/user-behavior.entity';
import * as bcrypt from 'bcrypt';
import dataSource from '../typeorm.config';
import { faker } from '@faker-js/faker';

async function seed() {
    try {
        console.log('Initializing DataSource...');
        if (!dataSource.isInitialized) {
            await dataSource.initialize();
        }
        console.log('DataSource initialized.');

        const userRepository = dataSource.getRepository(User);
        const supplierRepository = dataSource.getRepository(Supplier);
        const productRepository = dataSource.getRepository(Product);
        const orderRepository = dataSource.getRepository(Order);
        const contractRepository = dataSource.getRepository(Contract);
        const reviewRepository = dataSource.getRepository(Review);
        const trackingRepository = dataSource.getRepository(Tracking);
        const userBehaviorRepository = dataSource.getRepository(UserBehavior);

        console.log('Starting seeding process...');

        // 1. Seed Users
        console.log('Seeding Users...');
        const users: User[] = [];

        // Admin User
        const adminEmail = 'admin@example.com';
        let adminUser = await userRepository.findOne({ where: { email: adminEmail } });
        if (!adminUser) {
            const password = await bcrypt.hash('admin123', 10);
            adminUser = userRepository.create({
                email: adminEmail,
                password,
                name: 'Admin User',
                role: 'admin',
            });
            await userRepository.save(adminUser);
            console.log('Admin user created');
        }
        users.push(adminUser);

        // Regular Users
        for (let i = 0; i < 15; i++) {
            const email = faker.internet.email();
            const existingUser = await userRepository.findOne({ where: { email } });
            if (!existingUser) {
                const password = await bcrypt.hash('password123', 10);
                const user = userRepository.create({
                    email,
                    password,
                    name: faker.person.fullName(),
                    role: 'user',
                });
                await userRepository.save(user);
                users.push(user);
            }
        }
        console.log(`Seeded ${users.length} users.`);

        // 2. Seed Suppliers
        console.log('Seeding Suppliers...');
        const suppliers: Supplier[] = [];
        const supplierNames = ['TechSupplies Inc.', 'Global Traders', 'EcoFriendly Goods', 'Fashion Forward', 'Home Essentials', 'Beauty Plus', 'Sports Gear Co.'];

        for (const name of supplierNames) {
            let supplier = await supplierRepository.findOne({ where: { name } });
            if (!supplier) {
                supplier = supplierRepository.create({
                    name,
                    country: faker.location.country(),
                    rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
                    productTypes: faker.commerce.department(),
                    status: 'Active',
                    contactEmail: faker.internet.email(),
                    phone: faker.phone.number(),
                });
                await supplierRepository.save(supplier);
            }
            suppliers.push(supplier);
        }
        console.log(`Seeded ${suppliers.length} suppliers.`);

        // 3. Seed Products
        console.log('Seeding Products...');
        const products: Product[] = [];
        const categories = ['Electronics', 'Clothing', 'Home', 'Beauty', 'Sports', 'Toys', 'Books'];

        for (let i = 0; i < 50; i++) {
            const supplier = faker.helpers.arrayElement(suppliers);
            const category = faker.helpers.arrayElement(categories);
            const name = faker.commerce.productName();

            const existingProduct = await productRepository.findOne({ where: { name } });
            if (!existingProduct) {
                const product = productRepository.create({
                    name,
                    description: faker.commerce.productDescription(),
                    price: parseFloat(faker.commerce.price()),
                    quantity: faker.number.int({ min: 0, max: 200 }),
                    status: faker.helpers.arrayElement(['In Stock', 'Low Stock', 'Out of Stock']),
                    location: faker.location.city(),
                    trackingId: 'TRK-' + faker.string.alphanumeric(8).toUpperCase(),
                    supplier: supplier,
                    supplierId: supplier.id,
                    category: category,
                });
                await productRepository.save(product);
                products.push(product);
            }
        }
        console.log(`Seeded ${products.length} products.`);

        // 4. Seed Tracking for Products
        console.log('Seeding Tracking...');
        for (const product of products) {
            if (faker.datatype.boolean()) { // 50% chance of having tracking info
                const tracking = trackingRepository.create({
                    product: product,
                    productId: product.id,
                    location: faker.location.city(),
                    status: faker.helpers.arrayElement(['In Transit', 'Delivered', 'Processing']),
                    description: 'Package arrived at facility',
                    timestamp: faker.date.recent(),
                });
                await trackingRepository.save(tracking);
            }
        }

        // 5. Seed Orders (Supply Orders)
        console.log('Seeding Orders...');
        const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        for (let i = 0; i < 20; i++) {
            const supplier = faker.helpers.arrayElement(suppliers);
            const status = faker.helpers.arrayElement(orderStatuses);

            const order = orderRepository.create({
                supplier: supplier,
                supplierId: supplier.id,
                orderNumber: 'ORD-' + faker.string.alphanumeric(8).toUpperCase(),
                totalAmount: parseFloat(faker.commerce.price({ min: 100, max: 5000 })),
                status: status,
                expectedDeliveryDate: faker.date.future(),
                items: [
                    { name: faker.commerce.productName(), quantity: faker.number.int({ min: 10, max: 100 }), price: parseFloat(faker.commerce.price()) },
                    { name: faker.commerce.productName(), quantity: faker.number.int({ min: 10, max: 100 }), price: parseFloat(faker.commerce.price()) }
                ],
            });
            await orderRepository.save(order);
        }

        // 6. Seed Contracts
        console.log('Seeding Contracts...');
        const contractStatuses = ['active', 'expired', 'terminated', 'draft'];

        for (let i = 0; i < 10; i++) {
            const supplier = faker.helpers.arrayElement(suppliers);
            const status = faker.helpers.arrayElement(contractStatuses);

            const contract = contractRepository.create({
                supplier: supplier,
                supplierId: supplier.id,
                title: `Supply Contract with ${supplier.name}`,
                description: faker.lorem.paragraph(),
                startDate: faker.date.past(),
                endDate: faker.date.future(),
                status: status,
                documentUrl: faker.internet.url(),
            });
            await contractRepository.save(contract);
        }

        // 7. Seed Reviews
        console.log('Seeding Reviews...');
        for (let i = 0; i < 100; i++) {
            const user = faker.helpers.arrayElement(users);
            const product = faker.helpers.arrayElement(products);

            const review = reviewRepository.create({
                user: user,
                userId: user.id,
                product: product,
                productId: product.id,
                rating: faker.number.int({ min: 1, max: 5 }),
                comment: faker.lorem.sentence(),
            });
            await reviewRepository.save(review);
        }

        // 8. Seed User Behavior
        console.log('Seeding User Behavior...');
        const actions = ['view_product', 'add_to_cart', 'search', 'filter_category'];

        for (let i = 0; i < 100; i++) {
            const user = faker.helpers.arrayElement(users);
            const action = faker.helpers.arrayElement(actions);

            const behavior = userBehaviorRepository.create({
                user: user,
                userId: user.id,
                action: action,
                metadata: { productId: faker.helpers.arrayElement(products).id },
                timestamp: faker.date.recent(),
            });
            await userBehaviorRepository.save(behavior);
        }

        console.log('Seeding completed successfully!');

    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    } finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
    }
}

seed();
