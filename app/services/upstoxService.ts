// IMPORTANT: Placeholder for actual Upstox API details
const UPSTOX_API_URL = 'https://api-v2.upstox.com/login/authorization/token';
// const UPSTOX_API_URL = 'https://api.upstox.com/v2/login/authorization/token'; // Corrected URL based on common patterns

// It's crucial to use the correct redirect_uri registered with your Upstox app
const REDIRECT_URI = 'http://localhost:5173/auth/callback'; // Or whatever your redirect URI is

interface UpstoxTokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
  // Add other fields if present in the actual response
}

export const getAccessToken = async (clientId: string, clientSecret: string): Promise<string> => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded', // Upstox token API typically uses this
    'Accept': 'application/json',
  };

  const body = new URLSearchParams();
  body.append('client_id', clientId);
  body.append('client_secret', clientSecret);
  body.append('grant_type', 'client_credentials');
  body.append('redirect_uri', REDIRECT_URI); // May or may not be strictly needed for client_credentials but often included

  console.log("Requesting access token with params:", {
    url: UPSTOX_API_URL,
    clientId,
    // clientSecret: 'REDACTED', // Don't log actual secret in real scenarios
    grant_type: 'client_credentials',
    redirect_uri: REDIRECT_URI
  });


  try {
    const response = await fetch(UPSTOX_API_URL, {
      method: 'POST',
      headers: headers,
      body: body.toString(), // URLSearchParams needs to be stringified
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => response.text()); // Try to parse error as JSON, fallback to text
      console.error('Upstox API Error Response:', errorData);
      throw new Error(`Failed to get access token: ${response.status} ${response.statusText}. Details: ${JSON.stringify(errorData)}`);
    }

    const data: UpstoxTokenResponse = await response.json();

    if (!data.access_token) {
        console.error('Access token not found in response:', data);
        throw new Error('Access token not found in Upstox API response');
    }
    console.log('Access token received:', data.access_token);
    return data.access_token;

  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error; // Re-throw the error to be caught by the caller (e.g., AuthContext)
  }
};
