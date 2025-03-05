

// Generic type for request body with a constraint
export type RequestBody = Record<string, string | number | boolean | object>;

// Generic API response structure
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Client-side API call function
export async function apiCall<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST', 
  body?: RequestBody
): Promise<ApiResponse<T>> {
  try {
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Only add body for methods that support it
    if (body && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(endpoint, config);

    // Handle non-OK responses
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorBody.message || `HTTP error! status: ${response.status}`
      };
    }

    // Parse successful response
    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('API call error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

