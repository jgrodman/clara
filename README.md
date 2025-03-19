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
