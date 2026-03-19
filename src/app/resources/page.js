"use client";
import ResourceTileGrid from "@/components/ResourceTileGrid";
import ResourceFilters from "@/components/ResourceFilters";
import ResourceHighlightedTiles from "@/components/ResourceHighlightedTiles";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useResources } from "@/app/hooks/useResources";
import { useHighlightedResources } from "@/app/hooks/useHighlightedResources";

export default function Resources() {
  return (
    <Suspense>
      <PageContents />
    </Suspense>
  );
}

function PageContents() {
  const urlParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState(new Filters(urlParams));
  const { resources, hasMore, fetchResources } = useResources(filters);
  const { highlightedResources } = useHighlightedResources();

  useEffect(() => {
    // ///////////////////////////
    // Updating Params on filter change
    // ///////////////////////////
    const { Status, Category, Resources_Type, Subjects } = filters;
    const params = new URLSearchParams();

    if (Status && Status.length > 0) params.append("status", Status);
    if (Category && Category.length > 0) params.append("category", Category);
    if (Resources_Type && Resources_Type.length > 0) params.append("resourcesType", Resources_Type);
    Subjects.forEach(subject => params.append("subject", subject));

    router.replace(`?${params.toString()}`);
  }, [filters]);

  return (
    <div className="bg-[#FFF5EA] overscroll-y-none">
      {/* Header, conditional render. If there is a highlighted resource, then the highlighted resource shows as a banner. 
      If not, it defaults to a pink banner header. */}
      {/* resource page recommendation block component */}

      {(highlightedResources.length > 0 ? (
        <ResourceHighlightedTiles
          resource={
            highlightedResources[
              Math.floor(Math.random() * highlightedResources.length)
            ] // highlighted resource will show up when theres a resource 
          }
        />
      ):(
        <div className="grid grid-flow-col justify-center relative w-screen sm:h-[207px] md:h-[307px] lg:h-[407px] overflow-hidden mb-[20px]">
          {/* image  */}
        <div id="image-div" className="relative w-screen h-[207px] sm:h-[307px] md:h-[407px] after:absolute after:inset-0 after:bg-[#C96C86] after:opacity-30">
          <img
            className='w-full h-full object-cover object-center z-0 bg-local'
            src={"/resource-banner-2.webp"}
            alt='Three young beautiful black girls leaning against a pink wall, posing together and smiling.'
          />
        </div>
      
      {/* header title */}
      <h1 className="w-full flex items-center justify-center self-center justify-self-center text-center text-white text-4xl absolute z-1"> Resources </h1>
      
        </div>
      ))}

      <div className='flex-col content-center'>
        <h2 className="custom-header-font text-[25px] text-center text-black">All Resources</h2>
        <hr />
        {/* search bar & filter drop downs*/}
        <ResourceFilters
          filters={filters}
          setFilters={setFilters}
        />
        {/* resource tiles */}
        <ResourceTileGrid resources={resources} />
        {/* pagination button (if there is an offset) */}
        {hasMore && (
          <button
            onClick={() => fetchResources(filters)}
            className='flex justify-self-center justify-center mt-[10px] mx-[3px] rounded-[47.5px] bg-[#C96C86] hover:bg-[#B55772] color-[#FFF5EA] text-2xl rounded-2xl max-w-[350px] px-[30px] py-[15px] hover:cursor-pointer'>
            Load More
          </button>
        )}
      </div>
    </div>
  );
}


class Filters {
  Status = "Active";
  Name = "";
  Category = "";
  Resources_Type = "";
  Subjects = new Set();

  constructor(urlParams) {
    if (!urlParams) return;

    const categoryFilter = urlParams.get("category");
    const resourcesTypeFilter = urlParams.get("resourcesType");
    const subjectFilters = urlParams.getAll("subject");

    if (categoryFilter) this.Category = categoryFilter;
    if (resourcesTypeFilter) this.Resources_Type = resourcesTypeFilter;
    this.Subjects = new Set(subjectFilters);
  }
}
