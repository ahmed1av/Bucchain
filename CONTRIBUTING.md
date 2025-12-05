# Contributing to BUCChain

Thank you for your interest in contributing to BUCChain! We welcome contributions from everyone.

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:

    ```bash
    git clone https://github.com/your-username/BUCChain.git
    cd BUCChain
    ```

3. **Install dependencies**:

    ```bash
    npm install
    cd backend && npm install
    cd ../frontend && npm install
    ```

## Development Workflow

1. **Create a branch** for your feature or fix:

    ```bash
    git checkout -b feature/amazing-feature
    ```

2. **Make your changes**. Please follow the existing code style.
3. **Run tests** to ensure no regressions:

    ```bash
    # Backend
    cd backend && npm test

    # Frontend
    cd frontend && npm test
    ```

4. **Commit your changes** with clear messages.
5. **Push to your fork** and submit a Pull Request.

## Code Style

- We use **ESLint** and **Prettier**. Please run `npm run lint` before committing.
- Follow the directory structure:
  - `backend/`: NestJS API
  - `frontend/`: Next.js App
  - `blockchain/`: Smart Contracts
  - `ai/`: Python AI Service

## Reporting Issues

Please use the GitHub Issues tab to report bugs or suggest features. Provide as much detail as possible.

Thank you for helping make BUCChain better!
