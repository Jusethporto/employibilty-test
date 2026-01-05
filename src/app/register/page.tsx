'use client';

import { useState } from 'react';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    console.warn('Registro simulado:', form);
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 border p-6 rounded"
      >
        <h1 className="text-xl font-semibold">Registro</h1>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Nombre completo"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

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

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          Registrarse
        </button>
      </form>
    </main>
  );
}
