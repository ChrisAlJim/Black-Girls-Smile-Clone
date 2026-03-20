'use client';
import { useState } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import EventTilesGrid from '../../components/EventTilesGrid';
import LoadMoreButton from '../../components/LoadMoreButton';
import PageHero from '../../components/PageHero';
import eventsBanner from '../../../public/eventsBanner.png';
import { useEvents } from '../hooks/useEvents';

export default function Events() {
	const [search, setSearch] = useState('');
	const { events, loading, hasMore, fetchEvents } = useEvents({ search });

	return (
		<>
			{/* Header */}
			<PageHero
					bgImage={eventsBanner.src}
				bgImagePosition="center 10%"
				title="Upcoming Events"
				titleId="events-hero-header"
				className="aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] lg:aspect-[32/9]"
			/>

			{/* Main Body */}
			<main
				className=" text-black flex flex-col items-center justify-center"
				style={{ backgroundColor: '#FFF5EA' }}
			>
				{/* Tiles Header */}
				<h3
					id="events-tiles-header"
					className=" w-4/5 mx-auto border-b-1 border-black text-2xl font-bold text-black flex justify-center pt-8"
				>
					Upcoming Events & Webinar{' '}
				</h3>

				{/* Shared Wrapper - Both your search bar and your cards will start at the same left edge */}
				<section className="w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[130px]">
					{/* Search Box */}
					<div className="mt-4 mb-6">
						<div className="relative max-w-sm">
							<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
								<HiMagnifyingGlass className="h-4 w-4 text-black" />
							</span>

							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="block w-full pl-8 pr-2 py-1.5 text-sm bg-white border focus:outline-none focus:ring-1 focus:ring-pink-500"
								aria-label="Search for events"
							/>
						</div>
					</div>

					{/* Tiles */}
					<section
						id="events-display"
						className="py-10"
						aria-labelledby="events-tiles-header"
					>
						{events.length === 0 && !loading ? (
							<div className="text-center text-gray-500 py-8">
								No events found
							</div>
						) : (
							<EventTilesGrid eventList={events} />
						)}
					</section>
				</section>
				<LoadMoreButton
				id="more-events"
				hasMore={hasMore}
				loading={loading}
				onClick={() => fetchEvents({ search })}
				aria-label="Load more events"
			/>
			</main>
		</>
	);
}
