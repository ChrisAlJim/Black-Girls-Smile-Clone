'use client';
import { useState, useEffect } from 'react';
import { APIClient } from '@/lib/apiClient';

const ResourcesAPI = new APIClient('resources');

export function useHighlightedResources() {
  const [highlightedResources, setHighlightedResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchHighlighted() {
      setLoading(true);
      const [data, err] = await ResourcesAPI.get('/highlighted?pageSize=10');
      if (err) {
        setError(err);
      } else {
        setHighlightedResources(data.records ?? []);
      }
      setLoading(false);
    }

    fetchHighlighted();
  }, []);

  return { highlightedResources, loading, error };
}
