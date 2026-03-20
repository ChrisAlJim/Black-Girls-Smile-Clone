'use client';
import { useState, useEffect } from 'react';
import { APIClient } from '@/lib/apiClient';

const ResourcesAPI = new APIClient('resources');

export function useResources(filters) {
  const [resources, setResources] = useState([]);
  const [offset, setOffset] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const buildQueryParams = (filters, offset) => {
    const { Status, Name, Category, Resources_Type, Subjects } = filters;
    const params = new URLSearchParams();
    params.append('pageSize', 8);
    if (offset) params.append('offset', offset);
    if (Status && Status.length > 0) params.append('status', Status);
    if (Name && Name.length > 0) params.append('name', Name);
    if (Category && Category.length > 0) params.append('category', Category);
    if (Resources_Type && Resources_Type.length > 0) params.append('resourcesType', Resources_Type);
    Subjects.forEach(subject => params.append('subject', subject));
    return params.toString();
  };

  const fetchResources = async (filters, isNewSearch = false) => {
    if (!hasMore && !isNewSearch) return;
    setLoading(true);
    setError('');

    const queryOffset = isNewSearch ? null : offset;
    const queryParams = `?${buildQueryParams(filters, queryOffset)}`;

    const [data, err] = await ResourcesAPI.get(queryParams);
    if (err) {
      setError(err);
      setLoading(false);
      return;
    }

    const records = data.records ?? [];
    const nextToken = data.offset ?? null;

    setResources(prev => (isNewSearch ? records : [...prev, ...records]));
    setOffset(nextToken);
    setHasMore(Boolean(nextToken));
    setLoading(false);
  };

  useEffect(() => {
    setResources([]);
    setOffset(null);
    setHasMore(true);
    fetchResources(filters, true);
  }, [filters]);

  return { resources, loading, error, hasMore, fetchResources };
}
