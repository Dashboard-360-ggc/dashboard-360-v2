// app/page.tsx

import LoginButton from '../components/LoginButton';

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Dashboard del Restaurante</h1>
      <p className="mt-2">Bienvenido a tu panel de control.</p>

      <LoginButton />

    </main>
  );
}