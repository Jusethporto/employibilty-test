'use client'

import { useEffect, useState } from "react";

import { Card } from "@/app/components/Card";
import { getCharacters } from "@/services/api";
import type { Character } from "@/types/character";

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacters = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getCharacters();
        setCharacters(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error desconocido al cargar personajes";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, []);

  if (loading) {
    return <p>Cargando personajes...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!characters.length) {
    return <p>No se encontraron personajes.</p>;
  }

  return (
    <div>
      {characters.map((char) => (
        <div key={char.id}>
          <h3>{char.name}</h3>
          <Card
            title={char.name}
            description={char.species}
            imageUrl={char.image}
            onClick={() => console.log("Card clicked", char.id)}
          />
        </div>
      ))}
    </div>
  );
}
