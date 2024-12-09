# Express API Client

This is a simple Express API client that provides a single endpoint to search using an external API.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/express-api-client.git
   cd express-api-client
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root of your project and add your API key:
   ```
   OPENHANDS_API_KEY=your_api_key_here
   ```

## Usage

Start the server:
```bash
node index.js
```

## API Endpoint

### GET /api/v1/search

- **Parameters**:
  - `query` (string, required): The search query.
  - `limit` (integer, optional): The number of results to return (default is 10).

- **Headers**:
  - `Authorization`: Bearer token using the API key.

- **Responses**:
  - **200 OK**: Returns a JSON array of search results.
  - **4xx/5xx**: Returns a JSON object with error details.

Ensure you replace `'https://api.example.com/search'` in `index.js` with the actual API endpoint you want to query.