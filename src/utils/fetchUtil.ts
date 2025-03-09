
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface FetchOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
}

export const fetchUtil = async <T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { method = 'GET', headers = {}, body } = options;

  // Set default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Merge default headers with custom headers
  const requestHeaders = {
    ...defaultHeaders,
    ...headers,
  };

  // Configure the fetch request
  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // Add body if it exists (for POST, PUT, PATCH, etc.)
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};