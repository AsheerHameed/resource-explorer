import type {
  Character,
  CharacterListParams,
  CharactersAPIResponse,
} from "../models/model";
import apiClient from "./apiClient";

/*
 Fetch paginated characters with optional filters.
 API supports: page, name, status, species, gender
*/
// Add signal parameter to fetchCharacters
export async function fetchCharacters(
  params: CharacterListParams = {},
  signal?: AbortSignal
) {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, String(value));
    }
  });

  const response = await apiClient.get<CharactersAPIResponse>(
    `/character/?${queryParams.toString()}`,
    { signal }
  );
  return response.data;
}

/**
 Fetch a single characyer by ID.
*/
export async function fetchCharacterById(
  id: number | string
): Promise<Character> {
  const response = await apiClient.get<Character>(`/character/${id}`);
  return response.data;
}

/*
 Fetch multiple characters by IDs in one reqiest.
 Example: /character/1,2,3 returns Character | Character[]
*/
export async function fetchCharactersByIds(
  ids: Array<number | string>
): Promise<Character[]> {
  if (!ids.length) return [];
  const path = `/character/${ids.join(",")}`;
  const response = await apiClient.get<Character | Character[]>(path);
  const data = response.data;
  return Array.isArray(data) ? data : [data];
}
