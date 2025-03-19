# Clara Express Application with TypeScript

A Node.js Express application with TypeScript that provides a RESTful API.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd clara
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add environment variables:
   ```
   PORT=3000
   NODE_ENV=development
   ```

## Running the Application

### Development Mode

```
npm run dev
```

This will start the server with nodemon and ts-node, which automatically restarts when file changes are detected.

### Production Mode

First, build the TypeScript code:
```
npm run build
```

Then, start the application:
```
npm start
```

## API Endpoints

- `GET /`: Welcome message
- `GET /api`: API welcome message
- `GET /api/health`: Health check endpoint
- `GET /api/users`: Get all users
- `GET /api/users/:id`: Get a user by ID
- `POST /api/users`: Create a new user

### Example API Requests

#### Create a user
```
POST /api/users
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john@example.com"
}
```

#### Get all users
```
GET /api/users
```

## Project Structure

```
clara/
├── src/
│   ├── controllers/       # Request handlers
│   │   └── userController.ts
│   ├── models/            # Data models
│   │   └── user.ts
│   ├── routes/            # API routes
│   │   ├── index.ts       # Main routes file
│   │   └── userRoutes.ts  # User routes
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts       # Types for the application
│   └── index.ts           # Main application entry point
├── dist/                  # Compiled JavaScript files
├── .env                   # Environment variables
├── .eslintrc.js           # ESLint configuration
├── .gitignore             # Git ignore file
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## License

This project is licensed under the MIT License. 