'use client';
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ProvidersContainer from "@/components/ProvidersContainer";
import ProvidersFilters from "@/components/ProvidersFilters";
import PageHero from "@/components/PageHero";

export default function Providers() {
  return (
    <Suspense>
      <PageContents />
    </Suspense>
  );
}

function PageContents() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(() => {
    const stateParam = searchParams.get('state');
    const virtualOnlyParam = searchParams.get('virtualOnly');
    const nameParam = searchParams.get('name');

    return {
      name: nameParam || null,
      virtualOnly: virtualOnlyParam || null,
      state: stateParam || null,
    };
  });

  useEffect(() => {
    const params = new URLSearchParams();

    if (query.name) {
      params.append('name', query.name);
    }
    if (query.state) {
      params.append('state', query.state);
    }
    if (query.virtualOnly) {
      params.append('virtualOnly', query.virtualOnly);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });

  }, [query, pathname, router]);

  return (
    <>
      <PageHero
        bgImage="/resource-banner-2.webp"
        title="Providers"
        titleId="providers-hero-header"
        className="aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] lg:aspect-[32/9]"
      />

      <main
        className="text-black flex flex-col items-center justify-center pb-12"
        style={{ backgroundColor: '#FFF5EA' }}
      >
        <h3
          id="providers-tiles-header"
          className="w-4/5 text-black font-bold text-2xl border-b-1 border-black flex justify-center mx-auto pt-8"
        >
          Find a Provider
        </h3>

        <ProvidersFilters query={query} setQuery={setQuery} />
        <ProvidersContainer id="providers-display" query={query} />
      </main>
    </>
  );
}