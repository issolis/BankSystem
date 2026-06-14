# BankSystem

A Proof of Concept (PoC) of a secure banking system built with Domain-Driven Design (DDD), implementing the Biba and Bell-LaPadula security models across three independent microservices.

## Architecture

The system consists of four services:

- **IAM** (port 3000) — Identity and Access Management. Handles user registration, authentication, and JWT token generation with security labels.
- **BankingCore** (port 3001) — Core banking domain. Manages bank accounts and transactions, enforcing the Biba integrity model.
- **Assets** (port 3002) — VIP Investment Assets domain. Manages high-value financial assets, enforcing the Bell-LaPadula confidentiality model.
- **APIGateway** (port 3003) — Single entry point. Routes requests to the appropriate service.

## Security Models

- **Biba (Integrity):** A process with a lower integrity level cannot write to a resource with a higher integrity level (No Write Up). Enforced in the transaction processor.
- **Bell-LaPadula (Confidentiality):** A user with a lower clearance level cannot read resources classified at a higher level (No Read Up). Enforced in the VIP Assets endpoints.

## Security Levels

| Level | Clearance | Integrity |
|-------|-----------|-----------|
| Bronze | BRONZE | 1 |
| Silver | SILVER | 2 |
| Gold | PLATINUM | 3 |

## Prerequisites

- Node.js 20+
- Docker
- Minikube
- kubectl
- make

## Running locally

Install dependencies for each service:

```bash
cd IAM && npm install
cd ../BankingCore && npm install
cd ../Assets && npm install
cd ../APIGateway && npm install
```

Start each service in a separate terminal:

```bash
cd IAM && npm run dev
cd BankingCore && npm run dev
cd Assets && npm run dev
cd APIGateway && npm run dev
```

## Running on Minikube

First time (builds and deploys everything):

```bash
make deploy
```

Start without rebuilding:

```bash
make up
```

Stop everything:

```bash
make down
```

The `deploy` and `up` commands automatically start a port-forward on `http://localhost:3003` for the API Gateway. Keep that terminal open while using the API.

## API Routes

All requests go through the API Gateway at `http://localhost:3003`.

### IAM
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /iam/users | Create user | None |
| GET | /iam/users | List all users | Admin |
| GET | /iam/users/:id | Get user by ID | Admin |
| POST | /iam/auth/login | Login | None |

### BankingCore
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /banking/bank-accounts | Create account | Admin |
| GET | /banking/bank-accounts | List all accounts | Admin |
| GET | /banking/bank-accounts/:id | Get account by ID | Admin |
| GET | /banking/bank-accounts/owner/:ownerId | Get account by owner | Admin |
| POST | /banking/transactions | Create transaction | Any authenticated user |
| GET | /banking/transactions | List all transactions | Admin |
| GET | /banking/transactions/:id | Get transaction by ID | Admin |

### Assets
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /vip/vip-assets | Create VIP asset | Admin + Platinum |
| GET | /vip/vip-assets | List all VIP assets | Platinum |
| GET | /vip/vip-assets/:id | Get VIP asset by ID | Platinum |

## PoC Scenarios

### Scenario A - Biba Violation (Integrity)
A user with integrity level 1 attempts to transfer funds to an account owned by a user with integrity level 3. The system returns a transaction with `status: REJECTED` and the Biba violation reason.

### Scenario B - Bell-LaPadula Violation (Confidentiality)
A user with clearance level BRONZE or SILVER attempts to list VIP assets. The system returns `403 Forbidden`.

### Successful Scenario
A user with PLATINUM clearance and integrity level 3 can perform any operation without restrictions.