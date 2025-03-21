# Clara Express Application with TypeScript

A Node.js Express application with TypeScript that provides a RESTful API.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Google Cloud Platform account (for Text-to-Speech functionality)

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

3. Install sox
   ```
   brew install sox
   ```

4. copy gcloud_auth.json into the root of the project

5. add the airtable API key to .env

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

## Available Endpoints

curl localhost:3000/api/hello
