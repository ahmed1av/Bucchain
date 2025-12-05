# BUCChain - Blockchain-Based Supply Chain Verification

BUCChain is a comprehensive platform for verifying the authenticity of products in a supply chain using blockchain technology. It leverages a microservices architecture to ensure scalability, security, and reliability.

## 🏗 Architecture

The project consists of five main services:

1. **Backend (`/backend`)**: A NestJS application that handles business logic, user authentication, and database interactions.
2. **Frontend (`/frontend`)**: A Next.js application providing a modern and responsive user interface for suppliers.
3. **Mobile (`/mobile`)**: A React Native + Expo application for consumers to scan and verify product authenticity.
4. **Blockchain (`/blockchain`)**: Contains Smart Contracts (Solidity), deployment scripts (Hardhat), and local blockchain configuration.
5. **AI Service (`/ai`)**: A Python/FastAPI service for counterfeit detection using computer vision (YOLOv10).

## 🚀 Prerequisites

Ensure you have the following installed:

* **Node.js** (v18 or later)
* **npm** or **yarn**
* **Python** (3.9 or later)
* **Docker** & **Docker Compose** (optional, for containerized deployment)
* **Git**

## 🛠 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/bucchain/bucchain.git
cd bucchain
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your database and other configuration
npm install
npm run start:dev
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your API URL
npm install
npm run dev
```

### 4. Blockchain Setup

```bash
cd blockchain
cp .env.example .env
# Edit .env with your private key and RPC URL
npm install
# Start local node (if needed)
npx hardhat node
# Deploy contracts (in a separate terminal)
npx hardhat run scripts/deploy.js --network localhost
```

### 5. AI Service Setup

```bash
cd ai
cp .env.example .env
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### 6. Mobile App Setup

```bash
cd mobile
cp .env.example .env
# Edit .env with your API URLs
npm install
npx expo start
```

**For physical device testing:** Update `.env` with your computer's IP address instead of localhost.

## 📖 Usage

1. Start the **Blockchain** node and deploy contracts.
2. Start the **Backend** service (ensure database is running).
3. Start the **AI Service**.
4. Start the **Frontend** application.
5. Navigate to `http://localhost:3000` to access the platform.

## 📚 API Documentation

* **Backend API**: Available at `http://localhost:8001/api/docs` (Swagger UI) when the backend is running.
* **AI Service API**: Available at `http://localhost:8002/docs` (Swagger UI) when the AI service is running.

## 🤝 Contributing

We welcome contributions! Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
