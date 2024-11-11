import { useEffect, useState } from "react";

// Custom hook to fetch API key
 const useApiKey = () => {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);
  
    useEffect(() => {
      const fetchApiKey = async () => {
        try {
          const response = await fetch('api/key');
          const data = await response.json();
  
          if (!response.ok) {
            throw new Error(data.error || 'Failed to get API key');
          }
  
          setApiKey(data.key);
        } catch (err) {
          console.error(err);
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        }
      };
  
      fetchApiKey();
    }, []);
  
    return { apiKey, error };
  };

  export default useApiKey;
  