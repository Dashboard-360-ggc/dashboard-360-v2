// app/api/sheets/route.ts
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // --- ¡RECUERDA MODIFICAR ESTO! ---
    const spreadsheetId = 'ID_DE_TU_HOJA_DE_INVENTARIO'; 
    const range = 'Hoja 1!A1:Z100'; // Ajusta el nombre de la hoja y el rango

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return NextResponse.json({ rows: response.data.values || [] });

  } catch (error) {
    console.error('El error en el servidor es:', error);
    return NextResponse.json({ error: 'Error en el servidor al leer la hoja de inventario.' }, { status: 500 });
  }
}