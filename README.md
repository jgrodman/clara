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

4. Set up Google Cloud Text-to-Speech:
   - Create a project in the [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Text-to-Speech API for your project
   - Create a service account and download the JSON key file
   - Configure the credentials in your .env file using one of these methods:
     ```
     # Option 1: Set the path to your service account key file
     GOOGLE_APPLICATION_CREDENTIALS=/path/to/your-project-credentials.json
     
     # Option 2: Or directly paste the JSON credentials (content of your key file)
     GOOGLE_CLOUD_CREDENTIALS={"type":"service_account","project_id":"your-project-id",...}
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

## Available Endpoints

- `GET /tts/hello?text=Your text here&voice=nova` - Generates speech from text using Google Cloud TTS
  - Parameters:
    - `text`: The text to convert to speech (optional, default is a greeting)
    - `voice`: Voice to use (optional, default is 'nova')
  - Available voice options:
    - `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`, `ash`, `coral`, `sage`
