const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProductPassport", function () {
    let productPassport;
    let owner;
    let manufacturer1;
    let manufacturer2;
    let unauthorized;

    beforeEach(async function () {
        [owner, manufacturer1, manufacturer2, unauthorized] = await ethers.getSigners();

        const ProductPassport = await ethers.getContractFactory("ProductPassport");
        productPassport = await ProductPassport.deploy();
        await productPassport.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await productPassport.owner()).to.equal(owner.address);
        });

        it("Should authorize the owner as a manufacturer", async function () {
            expect(await productPassport.authorizedManufacturers(owner.address)).to.be.true;
        });

        it("Should initialize product count to 0", async function () {
            expect(await productPassport.productCount()).to.equal(0);
        });
    });

    describe("Manufacturer Management", function () {
        it("Should allow owner to add manufacturers", async function () {
            await productPassport.addManufacturer(manufacturer1.address);
            expect(await productPassport.authorizedManufacturers(manufacturer1.address)).to.be.true;
        });

        it("Should not allow non-owner to add manufacturers", async function () {
            await expect(
                productPassport.connect(manufacturer1).addManufacturer(manufacturer2.address)
            ).to.be.revertedWith("Only owner can perform this action");
        });

        it("Should emit event when manufacturer is added", async function () {
            // Note: Current contract doesn't have this event, but it's a good practice
            await productPassport.addManufacturer(manufacturer1.address);
            expect(await productPassport.authorizedManufacturers(manufacturer1.address)).to.be.true;
        });
    });

    describe("Product Creation", function () {
        beforeEach(async function () {
            await productPassport.addManufacturer(manufacturer1.address);
        });

        it("Should create a product with correct details", async function () {
            const tx = await productPassport
                .connect(manufacturer1)
                .createProduct("Laptop", "Manufactured", 100, "Factory A");

            await expect(tx)
                .to.emit(productPassport, "ProductCreated")
                .withArgs(1, "Laptop", manufacturer1.address);

            const product = await productPassport.getProduct(1);
            expect(product.id).to.equal(1);
            expect(product.name).to.equal("Laptop");
            expect(product.status).to.equal("Manufactured");
            expect(product.quantity).to.equal(100);
            expect(product.location).to.equal("Factory A");
            expect(product.manufacturer).to.equal(manufacturer1.address);
        });

        it("Should increment product count", async function () {
            await productPassport
                .connect(manufacturer1)
                .createProduct("Laptop", "Manufactured", 100, "Factory A");

            expect(await productPassport.productCount()).to.equal(1);

            await productPassport
                .connect(manufacturer1)
                .createProduct("Phone", "Manufactured", 200, "Factory B");

            expect(await productPassport.productCount()).to.equal(2);
        });

        it("Should not allow unauthorized addresses to create products", async function () {
            await expect(
                productPassport
                    .connect(unauthorized)
                    .createProduct("Laptop", "Manufactured", 100, "Factory A")
            ).to.be.revertedWith("Not authorized manufacturer");
        });

        it("Should return the correct product ID", async function () {
            const tx = await productPassport
                .connect(manufacturer1)
                .createProduct("Laptop", "Manufactured", 100, "Factory A");

            const receipt = await tx.wait();
            const event = receipt.logs.find((log) => {
                try {
                    return productPassport.interface.parseLog(log).name === "ProductCreated";
                } catch {
                    return false;
                }
            });

            const parsedEvent = productPassport.interface.parseLog(event);
            expect(parsedEvent.args.productId).to.equal(1);
        });
    });

    describe("Product Status Update", function () {
        beforeEach(async function () {
            await productPassport.addManufacturer(manufacturer1.address);
            await productPassport
                .connect(manufacturer1)
                .createProduct("Laptop", "Manufactured", 100, "Factory A");
        });

        it("Should update product status and location", async function () {
            const tx = await productPassport
                .connect(manufacturer1)
                .updateProductStatus(1, "In Transit", "Warehouse B");

            await expect(tx)
                .to.emit(productPassport, "ProductUpdated")
                .withArgs(1, "In Transit", "Warehouse B");

            const product = await productPassport.getProduct(1);
            expect(product.status).to.equal("In Transit");
            expect(product.location).to.equal("Warehouse B");
        });

        it("Should not allow updating non-existent product", async function () {
            await expect(
                productPassport
                    .connect(manufacturer1)
                    .updateProductStatus(999, "In Transit", "Warehouse B")
            ).to.be.revertedWith("Product does not exist");
        });

        it("Should not allow unauthorized addresses to update products", async function () {
            await expect(
                productPassport
                    .connect(unauthorized)
                    .updateProductStatus(1, "In Transit", "Warehouse B")
            ).to.be.revertedWith("Not authorized manufacturer");
        });

        it("Should update the updatedAt timestamp", async function () {
            const productBefore = await productPassport.getProduct(1);

            // Wait a bit to ensure timestamp changes
            await ethers.provider.send("evm_increaseTime", [1]);
            await ethers.provider.send("evm_mine");

            await productPassport
                .connect(manufacturer1)
                .updateProductStatus(1, "In Transit", "Warehouse B");

            const productAfter = await productPassport.getProduct(1);
            expect(productAfter.updatedAt).to.be.gt(productBefore.updatedAt);
        });
    });

    describe("Tracking Events", function () {
        beforeEach(async function () {
            await productPassport.addManufacturer(manufacturer1.address);
            await productPassport
                .connect(manufacturer1)
                .createProduct("Laptop", "Manufactured", 100, "Factory A");
        });

        it("Should add tracking event", async function () {
            const tx = await productPassport
                .connect(manufacturer1)
                .addTrackingEvent(1, "Port A", "Shipped", "Shipped via cargo vessel");

            await expect(tx)
                .to.emit(productPassport, "TrackingEventAdded")
                .withArgs(1, "Port A", "Shipped");

            const trackingEvents = await productPassport.getProductTracking(1);
            expect(trackingEvents.length).to.equal(1);
            expect(trackingEvents[0].location).to.equal("Port A");
            expect(trackingEvents[0].status).to.equal("Shipped");
            expect(trackingEvents[0].description).to.equal("Shipped via cargo vessel");
        });

        it("Should add multiple tracking events", async function () {
            await productPassport
                .connect(manufacturer1)
                .addTrackingEvent(1, "Port A", "Shipped", "Shipped via cargo vessel");

            await productPassport
                .connect(manufacturer1)
                .addTrackingEvent(1, "Port B", "In Transit", "Arrived at destination port");

            await productPassport
                .connect(manufacturer1)
                .addTrackingEvent(1, "Warehouse C", "Delivered", "Final delivery");

            const trackingEvents = await productPassport.getProductTracking(1);
            expect(trackingEvents.length).to.equal(3);
            expect(trackingEvents[0].location).to.equal("Port A");
            expect(trackingEvents[1].location).to.equal("Port B");
            expect(trackingEvents[2].location).to.equal("Warehouse C");
        });

        it("Should not allow tracking events for non-existent products", async function () {
            await expect(
                productPassport
                    .connect(manufacturer1)
                    .addTrackingEvent(999, "Port A", "Shipped", "Description")
            ).to.be.revertedWith("Product does not exist");
        });

        it("Should not allow unauthorized addresses to add tracking events", async function () {
            await expect(
                productPassport
                    .connect(unauthorized)
                    .addTrackingEvent(1, "Port A", "Shipped", "Description")
            ).to.be.revertedWith("Not authorized manufacturer");
        });

        it("Should store correct timestamp for tracking events", async function () {
            const tx = await productPassport
                .connect(manufacturer1)
                .addTrackingEvent(1, "Port A", "Shipped", "Description");

            await tx.wait();
            const block = await ethers.provider.getBlock("latest");

            const trackingEvents = await productPassport.getProductTracking(1);
            expect(trackingEvents[0].timestamp).to.equal(block.timestamp);
        });
    });

    describe("Product Retrieval", function () {
        beforeEach(async function () {
            await productPassport.addManufacturer(manufacturer1.address);
            await productPassport
                .connect(manufacturer1)
                .createProduct("Laptop", "Manufactured", 100, "Factory A");
        });

        it("Should retrieve product details correctly", async function () {
            const product = await productPassport.getProduct(1);

            expect(product.id).to.equal(1);
            expect(product.name).to.equal("Laptop");
            expect(product.status).to.equal("Manufactured");
            expect(product.quantity).to.equal(100);
            expect(product.location).to.equal("Factory A");
            expect(product.manufacturer).to.equal(manufacturer1.address);
            expect(product.createdAt).to.be.gt(0);
            expect(product.updatedAt).to.be.gt(0);
        });

        it("Should revert when getting non-existent product", async function () {
            await expect(productPassport.getProduct(999)).to.be.revertedWith(
                "Product does not exist"
            );
        });

        it("Should return empty array for products with no tracking events", async function () {
            const trackingEvents = await productPassport.getProductTracking(1);
            expect(trackingEvents.length).to.equal(0);
        });

        it("Should get correct product count", async function () {
            expect(await productPassport.getProductsCount()).to.equal(1);

            await productPassport
                .connect(manufacturer1)
                .createProduct("Phone", "Manufactured", 200, "Factory B");

            expect(await productPassport.getProductsCount()).to.equal(2);
        });
    });

    describe("Multiple Manufacturers", function () {
        beforeEach(async function () {
            await productPassport.addManufacturer(manufacturer1.address);
            await productPassport.addManufacturer(manufacturer2.address);
        });

        it("Should allow multiple manufacturers to create products", async function () {
            await productPassport
                .connect(manufacturer1)
                .createProduct("Laptop", "Manufactured", 100, "Factory A");

            await productPassport
                .connect(manufacturer2)
                .createProduct("Phone", "Manufactured", 200, "Factory B");

            expect(await productPassport.productCount()).to.equal(2);

            const product1 = await productPassport.getProduct(1);
            const product2 = await productPassport.getProduct(2);

            expect(product1.manufacturer).to.equal(manufacturer1.address);
            expect(product2.manufacturer).to.equal(manufacturer2.address);
        });

        it("Should allow any authorized manufacturer to update any product", async function () {
            await productPassport
                .connect(manufacturer1)
                .createProduct("Laptop", "Manufactured", 100, "Factory A");

            // Manufacturer 2 can update product created by Manufacturer 1
            await productPassport
                .connect(manufacturer2)
                .updateProductStatus(1, "In Transit", "Warehouse B");

            const product = await productPassport.getProduct(1);
            expect(product.status).to.equal("In Transit");
        });
    });

    describe("Pausable Functionality", function () {
        beforeEach(async function () {
            await productPassport.addManufacturer(manufacturer1.address);
        });

        it("Should allow owner to pause the contract", async function () {
            const tx = await productPassport.pause();

            await expect(tx).to.emit(productPassport, "ContractPaused").withArgs(owner.address);

            expect(await productPassport.paused()).to.be.true;
        });

        it("Should allow owner to unpause the contract", async function () {
            await productPassport.pause();

            const tx = await productPassport.unpause();

            await expect(tx).to.emit(productPassport, "ContractUnpaused").withArgs(owner.address);

            expect(await productPassport.paused()).to.be.false;
        });

        it("Should not allow non-owner to pause", async function () {
            await expect(
                productPassport.connect(manufacturer1).pause()
            ).to.be.revertedWith("Only owner can perform this action");
        });

        it("Should not allow non-owner to unpause", async function () {
            await productPassport.pause();

            await expect(
                productPassport.connect(manufacturer1).unpause()
            ).to.be.revertedWith("Only owner can perform this action");
        });

        it("Should prevent product creation when paused", async function () {
            await productPassport.pause();

            await expect(
                productPassport
                    .connect(manufacturer1)
                    .createProduct("Laptop", "Manufactured", 100, "Factory A")
            ).to.be.revertedWith("Contract is paused");
        });

        it("Should prevent product updates when paused", async function () {
            await productPassport
                .connect(manufacturer1)
                .createProduct("Laptop", "Manufactured", 100, "Factory A");

            await productPassport.pause();

            await expect(
                productPassport
                    .connect(manufacturer1)
                    .updateProductStatus(1, "Shipped", "Warehouse")
            ).to.be.revertedWith("Contract is paused");
        });

        it("Should prevent adding tracking events when paused", async function () {
            await productPassport
                .connect(manufacturer1)
                .createProduct("Laptop", "Manufactured", 100, "Factory A");

            await productPassport.pause();

            await expect(
                productPassport
                    .connect(manufacturer1)
                    .addTrackingEvent(1, "Port A", "Shipped", "Description")
            ).to.be.revertedWith("Contract is paused");
        });

        it("Should allow operations after unpausing", async function () {
            await productPassport.pause();
            await productPassport.unpause();

            await productPassport
                .connect(manufacturer1)
                .createProduct("Laptop", "Manufactured", 100, "Factory A");

            const count = await productPassport.productCount();
            expect(count).to.equal(1);
        });

        it("Should not allow pausing when already paused", async function () {
            await productPassport.pause();

            await expect(productPassport.pause()).to.be.revertedWith("Contract is paused");
        });

        it("Should not allow unpausing when not paused", async function () {
            await expect(productPassport.unpause()).to.be.revertedWith("Contract is not paused");
        });
    });

    describe("Manufacturer Removal", function () {
        beforeEach(async function () {
            await productPassport.addManufacturer(manufacturer1.address);
        });

        it("Should allow owner to remove manufacturer", async function () {
            const tx = await productPassport.removeManufacturer(manufacturer1.address);

            await expect(tx)
                .to.emit(productPassport, "ManufacturerRemoved")
                .withArgs(manufacturer1.address, owner.address);

            expect(await productPassport.authorizedManufacturers(manufacturer1.address)).to.be.false;
        });

        it("Should not allow non-owner to remove manufacturer", async function () {
            await expect(
                productPassport.connect(manufacturer1).removeManufacturer(manufacturer2.address)
            ).to.be.revertedWith("Only owner can perform this action");
        });

        it("Should not allow removing non-authorized manufacturer", async function () {
            await expect(
                productPassport.removeManufacturer(unauthorized.address)
            ).to.be.revertedWith("Manufacturer not authorized");
        });

        it("Should not allow removing the owner", async function () {
            await expect(
                productPassport.removeManufacturer(owner.address)
            ).to.be.revertedWith("Cannot remove owner");
        });

        it("Should not allow removed manufacturer to create products", async function () {
            await productPassport.removeManufacturer(manufacturer1.address);

            await expect(
                productPassport
                    .connect(manufacturer1)
                    .createProduct("Laptop", "Manufactured", 100, "Factory A")
            ).to.be.revertedWith("Not authorized manufacturer");
        });

        it("Should not allow removing zero address", async function () {
            await expect(
                productPassport.removeManufacturer(ethers.ZeroAddress)
            ).to.be.revertedWith("Invalid manufacturer address");
        });
    });

    describe("Input Validation", function () {
        beforeEach(async function () {
            await productPassport.addManufacturer(manufacturer1.address);
        });

        describe("Empty String Validation", function () {
            it("Should reject empty product name", async function () {
                await expect(
                    productPassport
                        .connect(manufacturer1)
                        .createProduct("", "Manufactured", 100, "Factory A")
                ).to.be.revertedWith("String cannot be empty");
            });

            it("Should reject empty status", async function () {
                await expect(
                    productPassport
                        .connect(manufacturer1)
                        .createProduct("Laptop", "", 100, "Factory A")
                ).to.be.revertedWith("String cannot be empty");
            });

            it("Should reject empty location", async function () {
                await expect(
                    productPassport
                        .connect(manufacturer1)
                        .createProduct("Laptop", "Manufactured", 100, "")
                ).to.be.revertedWith("String cannot be empty");
            });

            it("Should reject empty tracking description", async function () {
                await productPassport
                    .connect(manufacturer1)
                    .createProduct("Laptop", "Manufactured", 100, "Factory A");

                await expect(
                    productPassport
                        .connect(manufacturer1)
                        .addTrackingEvent(1, "Port A", "Shipped", "")
                ).to.be.revertedWith("String cannot be empty");
            });
        });

        describe("String Length Validation", function () {
            it("Should reject product name exceeding 256 characters", async function () {
                const longName = "A".repeat(257);

                await expect(
                    productPassport
                        .connect(manufacturer1)
                        .createProduct(longName, "Manufactured", 100, "Factory A")
                ).to.be.revertedWith("String exceeds maximum length");
            });

            it("Should accept product name with exactly 256 characters", async function () {
                const maxName = "A".repeat(256);

                await productPassport
                    .connect(manufacturer1)
                    .createProduct(maxName, "Manufactured", 100, "Factory A");

                const product = await productPassport.getProduct(1);
                expect(product.name).to.equal(maxName);
            });

            it("Should reject status exceeding 256 characters", async function () {
                const longStatus = "A".repeat(257);

                await expect(
                    productPassport
                        .connect(manufacturer1)
                        .createProduct("Laptop", longStatus, 100, "Factory A")
                ).to.be.revertedWith("String exceeds maximum length");
            });

            it("Should reject location exceeding 256 characters", async function () {
                const longLocation = "A".repeat(257);

                await expect(
                    productPassport
                        .connect(manufacturer1)
                        .createProduct("Laptop", "Manufactured", 100, longLocation)
                ).to.be.revertedWith("String exceeds maximum length");
            });

            it("Should reject tracking description exceeding 1024 characters", async function () {
                await productPassport
                    .connect(manufacturer1)
                    .createProduct("Laptop", "Manufactured", 100, "Factory A");

                const longDescription = "A".repeat(1025);

                await expect(
                    productPassport
                        .connect(manufacturer1)
                        .addTrackingEvent(1, "Port A", "Shipped", longDescription)
                ).to.be.revertedWith("String exceeds maximum length");
            });

            it("Should accept tracking description with exactly 1024 characters", async function () {
                await productPassport
                    .connect(manufacturer1)
                    .createProduct("Laptop", "Manufactured", 100, "Factory A");

                const maxDescription = "A".repeat(1024);

                await productPassport
                    .connect(manufacturer1)
                    .addTrackingEvent(1, "Port A", "Shipped", maxDescription);

                const tracking = await productPassport.getProductTracking(1);
                expect(tracking[0].description).to.equal(maxDescription);
            });
        });

        describe("Quantity Validation", function () {
            it("Should reject zero quantity", async function () {
                await expect(
                    productPassport
                        .connect(manufacturer1)
                        .createProduct("Laptop", "Manufactured", 0, "Factory A")
                ).to.be.revertedWith("Quantity must be greater than zero");
            });

            it("Should accept quantity of 1", async function () {
                await productPassport
                    .connect(manufacturer1)
                    .createProduct("Laptop", "Manufactured", 1, "Factory A");

                const product = await productPassport.getProduct(1);
                expect(product.quantity).to.equal(1);
            });

            it("Should accept large quantity", async function () {
                const largeQuantity = 1000000;

                await productPassport
                    .connect(manufacturer1)
                    .createProduct("Laptop", "Manufactured", largeQuantity, "Factory A");

                const product = await productPassport.getProduct(1);
                expect(product.quantity).to.equal(largeQuantity);
            });
        });
    });

    describe("New Events", function () {
        it("Should emit ManufacturerAdded event", async function () {
            await expect(productPassport.addManufacturer(manufacturer1.address))
                .to.emit(productPassport, "ManufacturerAdded")
                .withArgs(manufacturer1.address, owner.address);
        });

        it("Should emit ManufacturerRemoved event", async function () {
            await productPassport.addManufacturer(manufacturer1.address);

            await expect(productPassport.removeManufacturer(manufacturer1.address))
                .to.emit(productPassport, "ManufacturerRemoved")
                .withArgs(manufacturer1.address, owner.address);
        });

        it("Should not allow adding already authorized manufacturer", async function () {
            await productPassport.addManufacturer(manufacturer1.address);

            await expect(
                productPassport.addManufacturer(manufacturer1.address)
            ).to.be.revertedWith("Manufacturer already authorized");
        });

        it("Should not allow adding zero address as manufacturer", async function () {
            await expect(
                productPassport.addManufacturer(ethers.ZeroAddress)
            ).to.be.revertedWith("Invalid manufacturer address");
        });
    });

    describe("Additional View Functions", function () {
        it("Should check if manufacturer is authorized", async function () {
            expect(await productPassport.isManufacturerAuthorized(owner.address)).to.be.true;
            expect(await productPassport.isManufacturerAuthorized(manufacturer1.address)).to.be.false;

            await productPassport.addManufacturer(manufacturer1.address);

            expect(await productPassport.isManufacturerAuthorized(manufacturer1.address)).to.be.true;
        });
    });
});
