'use client';

import { useEffect, useMemo, useState } from 'react';

import { getCharacters } from '@/services/api';
import type { Character, CharacterStats } from '@/types/character';

export default function DashboardPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<CharacterStats>({
    total: 0,
    alive: 0,
    dead: 0,
    unknown: 0,
  });

  useEffect(() => {
    void fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCharacters();
      setCharacters(data);
      setFilteredCharacters(data);
      calculateStats(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error inesperado al cargar personajes';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (list: Character[]) => {
    const alive = list.filter(c => c.status === 'Alive').length;
    const dead = list.filter(c => c.status === 'Dead').length;
    const unknown = list.filter(c => c.status === 'unknown').length;

    setStats({
      total: list.length,
      alive,
      dead,
      unknown,
    });
  };

  useEffect(() => {
    let temp = [...characters];

    if (search) {
      temp = temp.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      temp = temp.filter(c => c.status === statusFilter);
    }

    setFilteredCharacters(temp);
  }, [search, statusFilter, characters]);


  const totalCharacters = useMemo(() => {
    return filteredCharacters.length;
  }, [filteredCharacters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="spinner-border text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <h1 className="mb-4 text-2xl font-bold">Dashboard de Personajes</h1>

      {/* Estadísticas */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center p-3 shadow-sm">
            <h6>Total</h6>
            <p className="fw-bold">{stats.total}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3 shadow-sm">
            <h6>Alive</h6>
            <p className="fw-bold text-success">{stats.alive}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3 shadow-sm">
            <h6>Dead</h6>
            <p className="fw-bold text-danger">{stats.dead}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3 shadow-sm">
            <h6>Unknown</h6>
            <p className="fw-bold text-warning">{stats.unknown}</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div
        className="mb-4 p-3 rounded"
        style={{ backgroundColor: '#f8f9fa' }}
      >
        <div className="row g-2">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar personaje..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="Alive">Alive</option>
              <option value="Dead">Dead</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <div className="col-md-2 d-flex align-items-center">
            <span className="text-muted">
              Total visibles: {totalCharacters}
            </span>
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="row">
        {filteredCharacters.map(character => (
          <div key={character.id} className="col-md-3 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={character.image}
                alt={character.name}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{character.name}</h5>
                <p className="card-text">
                  <span
                    className={`badge ${character.status === 'Alive'
                        ? 'bg-success'
                        : character.status === 'Dead'
                          ? 'bg-danger'
                          : 'bg-secondary'
                      }`}
                  >
                    {character.status}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Especie: {character.species}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCharacters.length === 0 && (
        <div className="alert alert-info mt-4">
          No se encontraron resultados.
        </div>
      )}
    </div>
  );
}
