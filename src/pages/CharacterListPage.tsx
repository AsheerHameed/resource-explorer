import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchCharacters } from "../services/charactersService";
import type {
  Character,
  CharacterListParams,
  CharactersAPIResponse,
} from "../models/model";
import { isCancel } from "axios";
import { CharacterCard, Filter, Loader } from "../components";

const CharactersListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState<Character[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL params
  const searchTerm = searchParams.get("search") || "";
  const sortKey = searchParams.get("sort") || "";
  const statusFilter = searchParams.get("status") || "";

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimeoutRef = useRef<number | null>(null);

  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(next));
      return next;
    });
  };

  const updateURLParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (value) newParams.set(key, value);
          else newParams.delete(key);
        });
        return newParams;
      });
    },
    [setSearchParams]
  );

  // Debounced search
  const debouncedSearch = useCallback(
    (term: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        updateURLParams({ search: term || null });
        setPage(1); // triggers new fetch
      }, 500);
    },
    [updateURLParams]
  );

  const fetchData = useCallback(
    async (pageNum: number, isNewSearch = false) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const params: CharacterListParams = { page: pageNum };
        if (searchTerm) params.name = searchTerm;
        if (statusFilter)
          params.status = statusFilter as CharacterListParams["status"];

        const data: CharactersAPIResponse = await fetchCharacters(
          params,
          controller.signal
        );

        setItems((prev) => {
          if (isNewSearch || pageNum === 1) return data.results;
          const seen = new Set(prev.map((c) => c.id));
          return [...prev, ...data.results.filter((c) => !seen.has(c.id))];
        });

        setHasMore(Boolean(data.info.next));
      } catch (e: unknown) {
        if (isCancel(e)) return;
        if (e instanceof Error) {
          console.error("Failed to load characters:", e);
          setError("Failed to load characters. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [searchTerm, statusFilter]
  );

  useEffect(() => {
    fetchData(1, true);
  }, [fetchData]);

  // Infinite scroll fetch
  useEffect(() => {
    if (!hasMore || page === 1) return;
    fetchData(page);
  }, [page, fetchData, hasMore]);

  // IntersectionObserver
  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((p) => p + 1);
        }
      },
      { root: null, rootMargin: "200px 0px", threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  // Memoised sorted items
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (sortKey === "name-asc") return a.name.localeCompare(b.name);
      if (sortKey === "name-desc") return b.name.localeCompare(a.name);
      if (sortKey === "species-asc") return a.species.localeCompare(b.species);
      if (sortKey === "species-desc") return b.species.localeCompare(a.species);
      return 0;
    });
  }, [items, sortKey]);

  const retryFetch = () => {
    setError(null);
    fetchData(1, true);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="text-3xl font-bold">Rick & Morty Characters</h3>
        <Filter
          searchTerm={searchTerm}
          sortKey={sortKey}
          statusFilter={statusFilter}
          onSearchChange={debouncedSearch}
          onSortChange={(val) => updateURLParams({ sort: val || null })}
          onStatusChange={(val) => {
            updateURLParams({ status: val || null });
            setPage(1);
          }}
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 mb-3">{error}</p>
          <button
            onClick={retryFetch}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {sortedItems.map((char) => (
          <CharacterCard
            key={char.id}
            character={char}
            onFavoriteToggle={toggleFavorite}
            isFavorite={favorites.includes(char.id)}
          />
        ))}
      </div>

      {!loading && sortedItems.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No characters found</p>
          {(searchTerm || statusFilter) && (
            <p className="text-sm text-gray-400">
              Try adjusting your search or filters
            </p>
          )}
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      <div ref={sentinelRef} className="h-8" />

      {loading && (
        <div className="flex justify-center py-6">
          <Loader />
        </div>
      )}

      {!hasMore && !loading && items.length > 0 && (
        <p className="py-4 text-center text-sm text-gray-500">
          No more characters.
        </p>
      )}
    </div>
  );
};

export default CharactersListPage;
