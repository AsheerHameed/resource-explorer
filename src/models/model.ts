/*this file has models or interfaces for different api calls 
Character - is for single character when we search by id
CharactersAPIInfo - this is the base api info given from api like count , pages 
CharactersAPIResponse - response consolidated the above will work as a root
*/
export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CharactersAPIInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface CharactersAPIResponse {
  info: CharactersAPIInfo;
  results: Character[];
}

export interface CharacterListParams {
  page?: number;
  name?: string;
  status?: "alive" | "dead" | "unknown";
  species?: string;
  gender?: "female" | "male" | "genderless" | "unknown";
}
