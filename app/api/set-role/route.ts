// app/api/set-role/route.ts
import { NextResponse } from 'next/server';
import admin from '../../../firebase/admin'; // Importamos la config de admin

export async function POST(request: Request) {
  try {
    const { uid, role } = await request.json();

    if (!uid || !role) {
      return NextResponse.json({ error: 'Faltan UID o rol' }, { status: 400 });
    }

    // Esta es la función mágica que asigna el rol (la "etiqueta") al usuario
    await admin.auth().setCustomUserClaims(uid, { role });

    return NextResponse.json({ message: `Rol '${role}' asignado al usuario ${uid}` });

  } catch (error) {
    console.error('Error al asignar rol:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}