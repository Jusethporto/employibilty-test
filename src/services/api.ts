export async function getCharacters() {
  const response = await fetch("https://rickandmortyapi.com/api/character")
  return response
}
