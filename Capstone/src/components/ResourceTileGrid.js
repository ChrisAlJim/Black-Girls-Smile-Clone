import ResourceTiles from "./ResourceTiles";

export default function ResourceTileGrid({ resources }) {
  return (
      <div>
        {resources.length > 0 ? (
          <div className='grid mx-auto justify-items-center sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 max-w-[1200px]'>
            {resources.map((data, idx) => (
              <ResourceTiles
                key={data.id}
                resource={data}
                tileIdx={idx}
              />
            ))}
          </div>
        ) : (
          <div className="flex-none sm:flex-1 md:flex-2 justify-self-center mx-[20px] my-[20px]">No Resources Available</div>
        )}
      </div>
  );
}
