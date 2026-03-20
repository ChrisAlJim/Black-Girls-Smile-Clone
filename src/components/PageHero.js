export default function PageHero({
	title,
	titleId,
	bgImage,
	bgImagePosition = 'center',
	className = '',
}) {
	return (
		<section
			className={`w-full overflow-hidden flex items-center justify-center bg-cover bg-top bg-no-repeat ${className}`}
			style={{ backgroundImage: `url("${bgImage}")`, backgroundPosition: bgImagePosition }}
		>
			<h1 id={titleId} className="text-[2.5rem] font-bold text-white">{title}</h1>
		</section>
	);
}
