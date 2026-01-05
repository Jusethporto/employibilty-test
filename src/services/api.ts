import type { ApiResponse, Character } from "@/types/character";

const CHARACTERS_API_URL = "https://rickandmortyapi.com/api/character";

export async function getCharacters(): Promise<Character[]> {
  const response = await fetch(CHARACTERS_API_URL);

  if (!response.ok) {
    throw new Error(`Error al obtener personajes: ${response.status} ${response.statusText}`);
  }

  const data: ApiResponse = await response.json();
  return data.results;
}
