'use client';

import { useState } from 'react';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simulación de validación básica
    if (!form.email || !form.password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    console.warn('Login simulado:', form);
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 border p-6 rounded"
      >
        <h1 className="text-xl font-semibold">Iniciar sesión</h1>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          Ingresar
        </button>
      </form>
    </main>
  );
}
