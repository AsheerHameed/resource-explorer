import type { Character, CharacterListParams, CharactersAPIResponse } from "../models/model";
import apiClient from "./apiClient";

/*
 Fetch paginated characters with optional filters.
 API supports: page, name, status, species, gender
*/
export async function fetchCharacters(
  params: CharacterListParams = {}
): Promise<CharactersAPIResponse> {
  const response = await apiClient.get<CharactersAPIResponse>("/character", {
    params: {
      page: params.page ?? 1,
      name: params.name || undefined,
      status: params.status || undefined,
      species: params.species || undefined,
      gender: params.gender || undefined,
    },
  });
  return response.data;
}

/**
 Fetch a single characyer by ID.
*/
export async function fetchCharacterById(id: number | string): Promise<Character> {
  const response = await apiClient.get<Character>(`/character/${id}`);
  return response.data;
}

/*
 Fetch multiple characters by IDs in one reqiest.
 Example: /character/1,2,3 returns Character | Character[]
*/
export async function fetchCharactersByIds(ids: Array<number | string>): Promise<Character[]> {
  if (!ids.length) return [];
  const path = `/character/${ids.join(",")}`;
  const response = await apiClient.get<Character | Character[]>(path);
  const data = response.data;
  return Array.isArray(data) ? data : [data];
}
