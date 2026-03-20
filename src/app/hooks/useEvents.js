'use client';
import { useState, useEffect } from 'react';
import { APIClient } from '@/lib/apiClient';

import default1 from '../../../public/eventsDefault1.jpg';
import default2 from '../../../public/eventsDefault2.jpg';
import default3 from '../../../public/eventsDefault3.jpg';
import default4 from '../../../public/eventsDefault4.jpg';
import default5 from '../../../public/eventsDefault5.jpg';
import default6 from '../../../public/eventsDefault6.jpg';
import default7 from '../../../public/eventsDefault7.jpg';
import default8 from '../../../public/eventsDefault8.jpg';
import default9 from '../../../public/eventsDefault9.jpg';
import default10 from '../../../public/eventsDefault10.jpg';
import default11 from '../../../public/eventsDefault11.jpg';

const defaultImages = [
	default1, default2, default3, default4, default5, default6,
	default7, default8, default9, default10, default11,
];

const EventsAPI = new APIClient('events');

export function useEvents(query = {}) {
	const [events, setEvents] = useState([]);
	const [offset, setOffset] = useState(null);
	const [hasMore, setHasMore] = useState(true);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [imageIndex, setImageIndex] = useState(0);

	const buildQueryParams = (query, offset) => {
		const params = new URLSearchParams();
		params.append('pageSize', 8);
		if (query?.search) params.append('search', query.search);
		if (offset) params.append('offset', offset);
		return params.toString();
	};

	const fetchEvents = async (query, isNewSearch = false) => {
		if (!hasMore && !isNewSearch) return;
		setLoading(true);
		setError('');

		const queryOffset = isNewSearch ? null : offset;
		const queryParams = `?${buildQueryParams(query, queryOffset)}`;

		const [eventsObj, err] = await EventsAPI.get(queryParams);
		if (err) {
			setError(err);
			setLoading(false);
			return;
		}

		const records = eventsObj.records ?? [];
		const nextToken = eventsObj.offset ?? null;

		setImageIndex((prevIndex) => {
			let currentIndex = isNewSearch ? 0 : prevIndex;
			const eventsWithImages = records.map((event) => {
				const withImage = {
					...event,
					'Image URL': event['Image URL'] || defaultImages[currentIndex % defaultImages.length].src,
				};
				currentIndex++;
				return withImage;
			});

			setEvents((prev) => (isNewSearch ? eventsWithImages : [...prev, ...eventsWithImages]));
			return currentIndex;
		});

		setOffset(nextToken);
		setHasMore(Boolean(nextToken));
		setLoading(false);
	};

	useEffect(() => {
		setEvents([]);
		setOffset(null);
		setHasMore(true);
		setImageIndex(0);
		fetchEvents(query, true);
	}, [query.search]);

	return {
		events,
		error,
		loading,
		hasMore,
		fetchEvents,
	};
}
