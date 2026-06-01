import { useState, useEffect } from 'react';

/**
 * Custom hook for data fetching with loading and error states
 * @param {Function} serviceCall - The service function to call
 * @param {Array} dependencies - Dependencies to re-trigger the call
 */
export const useFetch = (serviceCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await serviceCall();
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};
