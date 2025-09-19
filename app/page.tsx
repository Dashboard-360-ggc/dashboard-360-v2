// app/page.tsx

export default function HomePage() {
  // Intentamos leer la variable de prueba y la de Firebase
  const testVar = process.env.NEXT_PUBLIC_TEST_VARIABLE;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Prueba de Variables en Vercel</h1>

      <div className="mt-4">
        <p>Variable de prueba (NEXT_PUBLIC_TEST_VARIABLE):</p>
        <p className="font-mono bg-gray-200 p-2 rounded">
          <strong>{testVar || "NO SE LEYÓ LA VARIABLE DE PRUEBA"}</strong>
        </p>
      </div>

      <div className="mt-4">
        <p>API Key de Firebase (NEXT_PUBLIC_FIREBASE_API_KEY):</p>
        <p className="font-mono bg-gray-200 p-2 rounded break-all">
          <strong>{apiKey || "NO SE LEYÓ LA API KEY"}</strong>
        </p>
      </div>
    </main>
  );
}