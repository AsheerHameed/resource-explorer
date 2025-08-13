import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { fetchCharacterById } from "../services/charactersService";
import type { Character } from "../models/model";
import { Loader } from "../components";

import {
  locationIcon,
  speciesIcon,
  genderIcon,
  typeIcon,
  originIcon,
  episodeIcon,
  createdIcon,
  heartFilledIcon,
  heartIcon,
  lifelineIcon,
} from "../assets";

const CharacterDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });

  const isFavorite = useMemo(
    () => (character ? favorites.includes(character.id) : false),
    [favorites, character]
  );

  const toggleFavorite = useCallback((charId: number) => {
    setFavorites((prev) => {
      const updated = prev.includes(charId)
        ? prev.filter((x) => x !== charId)
        : [...prev, charId];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  }, []);

  useEffect(() => {
    if (!id) return;
    const loadCharacter = async () => {
      setLoading(true);
      try {
        const data = await fetchCharacterById(id);
        setCharacter(data);
      } catch (error) {
        console.error("Error fetching character:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCharacter();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Loader />
      </div>
    );
  }

  if (!character) {
    return (
      <div className="p-6 text-center text-gray-500">Character not found.</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-sm my-8">
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col lg:flex-row gap-6 items-center">
        <div className="relative flex-shrink-0">
          <img
            src={character.image}
            alt={character.name}
            className="w-72 h-auto object-cover rounded-md"
          />
          <button
            onClick={() => toggleFavorite(character.id)}
            className="absolute top-3 right-3 rounded-full bg-white/85 flex items-center justify-center w-9 h-9 hover:scale-110 transition cursor-pointer"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <img
              src={isFavorite ? heartFilledIcon : heartIcon}
              alt={isFavorite ? "Unfavorite" : "Favorite"}
              className="w-5 h-5"
              draggable={false}
            />
          </button>
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{character.name}</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <DetailItem
              icon={lifelineIcon}
              label="Status"
              value={character.status}
            />
            <DetailItem
              icon={speciesIcon}
              label="Species"
              value={character.species}
            />
            <DetailItem
              icon={genderIcon}
              label="Gender"
              value={character.gender}
            />
            <DetailItem
              icon={typeIcon}
              label="Type"
              value={character.type || "—"}
            />
            <DetailItem
              icon={locationIcon}
              label="Last known location"
              value={character.location?.name || "Unknown"}
            />
            <DetailItem
              icon={originIcon}
              label="Origin"
              value={character.origin?.name || "Unknown"}
            />
            <DetailItem
              icon={episodeIcon}
              label="Appeared in"
              value={`${character.episode.length} episode(s)`}
            />
            <DetailItem
              icon={createdIcon}
              label="Created on"
              value={new Date(character.created).toLocaleDateString()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }: { icon?: string; label: string; value: string }) => (
  <div className="grid grid-cols-[auto,1fr] items-center gap-2">
    {icon && <img src={icon} alt={label} className="w-5 h-5 flex-shrink" />}
    <div>
      <p className="text-gray-500">{label}:</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

export default CharacterDetailPage;
