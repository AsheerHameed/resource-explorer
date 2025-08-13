import { useEffect, useRef, useState } from "react";
import CharacterCard from "../components/CharacterCard";
import Loader from "../components/Loader";
import { fetchCharacters } from "../services/charactersService";
import type { Character, CharactersAPIResponse } from "../models/model";
import SortDropdown from "../components/SortDropdown";
import StatusFilter from "../components/StatusFilter";

export default function CharactersListPage() {
  const [items, setItems] = useState<Character[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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

  // Fetch data when page or filter changes
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      loadingRef.current = true;
      try {
        const data: CharactersAPIResponse = await fetchCharacters({
          page,
          status: statusFilter || undefined, // ✅ pass down status filter
        });
        setItems((prev) => {
          // When page = 1, replace results (filter reset scenario)
          if (page === 1) return data.results;

          const seen = new Set(prev.map((c) => c.id));
          const next = data.results.filter((c) => !seen.has(c.id));
          return [...prev, ...next];
        });
        setHasMore(Boolean(data.info.next));
      } catch (e) {
        console.error("Failed to load characters:", e);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    };
    load();
  }, [page, statusFilter]); // ✅ refetch when filter changes

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loadingRef.current && hasMore) {
          loadingRef.current = true;
          setPage((p) => p + 1);
        }
      },
      { root: null, rootMargin: "200px 0px", threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore]);

  // ✅ Apply sorting before rendering
  const sortedItems = [...items].sort((a, b) => {
    if (sortKey === "name-asc") return a.name.localeCompare(b.name);
    if (sortKey === "name-desc") return b.name.localeCompare(a.name);
    if (sortKey === "species-asc") return a.species.localeCompare(b.species);
    if (sortKey === "species-desc") return b.species.localeCompare(a.species);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-3xl font-bold">Characters</h3>

        {/* Filters row */}
        <div className="flex gap-3 py-8">
          <SortDropdown sortKey={sortKey} onChange={setSortKey} />
          <StatusFilter
            status={statusFilter}
            onChange={(val) => {
              setItems([]);
              setPage(1);
              setStatusFilter(val); // ✅ triggers fetch
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedItems.map((char) => ( // ✅ use sortedItems here
          <CharacterCard
            key={char.id}
            character={char}
            onFavoriteToggle={toggleFavorite}
            isFavorite={favorites.includes(char.id)}
          />
        ))}
      </div>

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
}
