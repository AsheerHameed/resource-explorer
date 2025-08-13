import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCharacterById } from "../services/charactersService";
import type { Character } from "../models/model";

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>(); // read :id from URL
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    if (!id) return;
    const loadCharacter = async () => {
      try {
        const data = await fetchCharacterById(id);
        setCharacter(data);
      } catch (error) {
        console.error("Error fetching character:", error);
      }
    };
    loadCharacter();
  }, [id]);

  return (
    <div className="p-4 rounded ">
      <h1 className="text-xl font-bold">Character Details</h1>
      {!character && <p>Loading...</p>}
      {character && (
        <div>
          <h2>{character.name}</h2>
          <img
            src={character.image}
            alt={character.name}
            width={200}
            className="mt-2 rounded"
          />
          <p>Status: {character.status}</p>
          <p>Species: {character.species}</p>
        </div>
      )}
    </div>
  );
}
