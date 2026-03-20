import ProvidersDisplayCard from '@/components/ProvidersDisplayCard';
import LoadMoreButton from '@/components/LoadMoreButton';
import { useProviders } from '@/app/hooks/useProviders';

export default function ProvidersContainer({ query }) {
  const { providers, error, loading, hasMore, fetchProviders } = useProviders(query);

  return (
    <div className="w-full">
      <div className="providers-container">
        {error && <p className="error-text">{error}</p>}
        {loading && <p className="flex justify-center">Loading providers...</p>}

        <div 
        className="
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 
        justify-items-center ml-20 mr-20">
          {providers.length > 0 ? (
            providers.map((provider, idx) => (
              <div key={provider.id ?? idx}>
                <ProvidersDisplayCard provider={provider} />
              </div>
            ))
          ) : (
            !loading && <div className="flex justify-center"><p>No providers found.</p></div>
          )}
        </div>

        <LoadMoreButton
          id="more-providers"
          hasMore={hasMore}
          loading={loading}
          onClick={fetchProviders}
          aria-label="Load more providers"
        />
      </div>
    </div>
  );
}
