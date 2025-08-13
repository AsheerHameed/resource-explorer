import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { fetchCharactersByIds } from "../services/charactersService";
import type { Character } from "../models/model";
import { CharacterCard, Filter, Loader } from "../components";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });

  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Actual search term used for filtering
  const [searchTerm, setSearchTerm] = useState("");
  // Immediately updated input value
  const [tempSearch, setTempSearch] = useState("");

  const debounceTimeoutRef = useRef<number | null>(null);

  // Stable favorite toggle to avoid re-renders in child components
  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Debounced search handler
  const debouncedSearch = useCallback((val: string) => {
    setTempSearch(val);
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = window.setTimeout(() => {
      setSearchTerm(val);
    }, 500);
  }, []);

  // Load favorite characters whenever IDs change
  useEffect(() => {
    if (favorites.length === 0) {
      setCharacters([]);
      return;
    }

    let mounted = true;
    setLoading(true);

    fetchCharactersByIds(favorites)
      .then((data) => {
        const arr = Array.isArray(data) ? data : [data];
        if (mounted) setCharacters(arr);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, [favorites]);

  // Memoised filtered + sorted list
  const filteredCharacters = useMemo(() => {
    return characters
      .filter(
        (c) =>
          (!statusFilter || c.status.toLowerCase() === statusFilter) &&
          (!searchTerm ||
            c.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortKey === "name-asc") return a.name.localeCompare(b.name);
        if (sortKey === "name-desc") return b.name.localeCompare(a.name);
        if (sortKey === "species-asc")
          return a.species.localeCompare(b.species);
        if (sortKey === "species-desc")
          return b.species.localeCompare(a.species);
        return 0;
      });
  }, [characters, statusFilter, searchTerm, sortKey]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 flex flex-col min-h-[calc(100vh-300px)]">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 mb-6">
        <h3 className="text-3xl font-bold">Your Favorites</h3>
        <Filter
          searchTerm={tempSearch}
          sortKey={sortKey}
          statusFilter={statusFilter}
          onSearchChange={debouncedSearch}
          onSortChange={setSortKey}
          onStatusChange={setStatusFilter}
        />
      </div>

      {favorites.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center text-gray-500">
          No favorites yet.
        </div>
      ) : filteredCharacters.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center text-gray-500">
          No matching favorites.
          {(searchTerm || statusFilter) && (
            <p className="text-sm text-gray-400 mt-1">
              Try clearing search or filters.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredCharacters.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              onFavoriteToggle={toggleFavorite}
              isFavorite={favorites.includes(char.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
