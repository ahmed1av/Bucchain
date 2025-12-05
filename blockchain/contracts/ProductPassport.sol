// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProductPassport {
    struct Product {
        uint256 id;
        string name;
        string status;
        uint256 quantity;
        string location;
        address manufacturer;
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    struct TrackingEvent {
        uint256 productId;
        string location;
        string status;
        uint256 timestamp;
        string description;
    }
    
    // State variables
    mapping(uint256 => Product) public products;
    mapping(uint256 => TrackingEvent[]) public productTracking;
    mapping(address => bool) public authorizedManufacturers;
    
    address public owner;
    uint256 public productCount;
    bool public paused;
    
    // Constants for validation
    uint256 public constant MAX_STRING_LENGTH = 256;
    uint256 public constant MAX_DESCRIPTION_LENGTH = 1024;
    
    // Events
    event ProductCreated(uint256 indexed productId, string name, address manufacturer);
    event ProductUpdated(uint256 indexed productId, string status, string location);
    event TrackingEventAdded(uint256 indexed productId, string location, string status);
    event ManufacturerAdded(address indexed manufacturer, address indexed addedBy);
    event ManufacturerRemoved(address indexed manufacturer, address indexed removedBy);
    event ContractPaused(address indexed by);
    event ContractUnpaused(address indexed by);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier onlyAuthorized() {
        require(authorizedManufacturers[msg.sender], "Not authorized manufacturer");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    modifier whenPaused() {
        require(paused, "Contract is not paused");
        _;
    }
    
    // Validation functions
    modifier validString(string memory _str, uint256 _maxLength) {
        require(bytes(_str).length > 0, "String cannot be empty");
        require(bytes(_str).length <= _maxLength, "String exceeds maximum length");
        _;
    }
    
    modifier validQuantity(uint256 _quantity) {
        require(_quantity > 0, "Quantity must be greater than zero");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        authorizedManufacturers[msg.sender] = true;
        paused = false;
    }
    
    // Emergency stop functions
    function pause() external onlyOwner whenNotPaused {
        paused = true;
        emit ContractPaused(msg.sender);
    }
    
    function unpause() external onlyOwner whenPaused {
        paused = false;
        emit ContractUnpaused(msg.sender);
    }
    
    // Manufacturer management
    function addManufacturer(address _manufacturer) external onlyOwner {
        require(_manufacturer != address(0), "Invalid manufacturer address");
        require(!authorizedManufacturers[_manufacturer], "Manufacturer already authorized");
        
        authorizedManufacturers[_manufacturer] = true;
        emit ManufacturerAdded(_manufacturer, msg.sender);
    }
    
    function removeManufacturer(address _manufacturer) external onlyOwner {
        require(_manufacturer != address(0), "Invalid manufacturer address");
        require(_manufacturer != owner, "Cannot remove owner");
        require(authorizedManufacturers[_manufacturer], "Manufacturer not authorized");
        
        authorizedManufacturers[_manufacturer] = false;
        emit ManufacturerRemoved(_manufacturer, msg.sender);
    }
    
    // Product functions
    function createProduct(
        string memory _name,
        string memory _status,
        uint256 _quantity,
        string memory _location
    ) 
        external 
        onlyAuthorized 
        whenNotPaused
        validString(_name, MAX_STRING_LENGTH)
        validString(_status, MAX_STRING_LENGTH)
        validString(_location, MAX_STRING_LENGTH)
        validQuantity(_quantity)
        returns (uint256) 
    {
        productCount++;
        
        products[productCount] = Product({
            id: productCount,
            name: _name,
            status: _status,
            quantity: _quantity,
            location: _location,
            manufacturer: msg.sender,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        emit ProductCreated(productCount, _name, msg.sender);
        return productCount;
    }
    
    function updateProductStatus(
        uint256 _productId,
        string memory _status,
        string memory _location
    ) 
        external 
        onlyAuthorized 
        whenNotPaused
        validString(_status, MAX_STRING_LENGTH)
        validString(_location, MAX_STRING_LENGTH)
    {
        require(products[_productId].id != 0, "Product does not exist");
        
        products[_productId].status = _status;
        products[_productId].location = _location;
        products[_productId].updatedAt = block.timestamp;
        
        emit ProductUpdated(_productId, _status, _location);
    }
    
    function addTrackingEvent(
        uint256 _productId,
        string memory _location,
        string memory _status,
        string memory _description
    ) 
        external 
        onlyAuthorized 
        whenNotPaused
        validString(_location, MAX_STRING_LENGTH)
        validString(_status, MAX_STRING_LENGTH)
        validString(_description, MAX_DESCRIPTION_LENGTH)
    {
        require(products[_productId].id != 0, "Product does not exist");
        
        productTracking[_productId].push(TrackingEvent({
            productId: _productId,
            location: _location,
            status: _status,
            timestamp: block.timestamp,
            description: _description
        }));
        
        emit TrackingEventAdded(_productId, _location, _status);
    }
    
    // View functions
    function getProduct(uint256 _productId) external view returns (
        uint256 id,
        string memory name,
        string memory status,
        uint256 quantity,
        string memory location,
        address manufacturer,
        uint256 createdAt,
        uint256 updatedAt
    ) {
        Product memory product = products[_productId];
        require(product.id != 0, "Product does not exist");
        
        return (
            product.id,
            product.name,
            product.status,
            product.quantity,
            product.location,
            product.manufacturer,
            product.createdAt,
            product.updatedAt
        );
    }
    
    function getProductTracking(uint256 _productId) external view returns (TrackingEvent[] memory) {
        return productTracking[_productId];
    }
    
    function getProductsCount() external view returns (uint256) {
        return productCount;
    }
    
    function isManufacturerAuthorized(address _manufacturer) external view returns (bool) {
        return authorizedManufacturers[_manufacturer];
    }
}
