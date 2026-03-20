"use client";
import ResourceTileGrid from "@/components/ResourceTileGrid";
import ResourceFilters from "@/components/ResourceFilters";
import ResourceHighlightedTiles from "@/components/ResourceHighlightedTiles";
import LoadMoreButton from "@/components/LoadMoreButton";
import PageHero from "@/components/PageHero";
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
  const { resources, hasMore, fetchResources, loading } = useResources(filters);
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
        <PageHero
          bgImage="/thought-catalog-23KdVfc395A-unsplash-(1).webp"
          title="Resources"
          className="aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] lg:aspect-[32/9]"
        />
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
        <LoadMoreButton
          hasMore={hasMore}
          loading={loading}
          onClick={() => fetchResources(filters)}
          aria-label="Load more resources"
        />
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
