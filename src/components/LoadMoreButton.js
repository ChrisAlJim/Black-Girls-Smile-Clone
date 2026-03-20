'use client';

export default function LoadMoreButton({
	onClick,
	loading = false,
	hasMore,
	id,
	'aria-label': ariaLabel = 'Load more',
	loadingText = 'Loading...',
	label = 'Load More',
}) {
	if (!hasMore) return null;

	return (
		<div className="w-full flex justify-center my-6">
			<button
				id={id}
				className="bg-[#B36078] hover:bg-[#C96C86] text-white font-bold py-2 px-6 rounded-full transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
				onClick={onClick}
				disabled={loading}
				aria-label={ariaLabel}
			>
				{loading ? loadingText : label}
			</button>
		</div>
	);
}
