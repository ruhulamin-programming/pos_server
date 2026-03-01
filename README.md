# POS Server

A robust Point of Sale (POS) backend system built with [NestJS](https://nestjs.com/), [Prisma](https://www.prisma.io/), and [MongoDB](https://www.mongodb.com/).

## Live URL

The project is deployed and accessible at:
[https://pos-server-7ga3.onrender.com](https://pos-server-7ga3.onrender.com)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or Atlas URI)

## Local Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/ruhulamin-programming/pos_server.git
   cd pos_server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory and add the following variables:

   ```env
   # Database Connection
   DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/pos_db"

   # Server Configuration
   PORT=3000

   # JWT Configuration
   JWT_SECRET="your_jwt_secret"
   JWT_EXPIRES_IN="7d"
   ```

4. **Generate Prisma Client**

   ```bash
   npx prisma generate
   ```

5. **Run the application**

   ```bash
   # Development mode (with hot-reload)
   npm run dev

   # Production mode
   npm run build
   npm run start
   ```

## Login Credentials

For testing purposes, you can use the following credentials:

### Admin Access

- **Email**: admin@gmail.com
- **Password**: 123456

### Cashier Access

- **Email**: ruhulamin.cse56@gmail.com
- **Password**: 123456

## Available Scripts

- `npm run build`: Build the project using Nest CLI.
- `npm run dev`: Start the application in development mode with watch mode enabled.
- `npm run start`: Start the compiled application (requires `npm run build`).
- `npm run lint`: Run ESLint to check for code quality issues.
- `npm run test`: Run unit tests.

## Tech Stack

- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: MongoDB
- **Language**: TypeScript

## License

UNLICENSED
