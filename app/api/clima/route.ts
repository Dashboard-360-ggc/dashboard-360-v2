// app/api/clima/route.ts
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
    const spreadsheetId = '1dMX4o2TbX_GqAkwDWDq3GKzjxMoUwhnnolsJROejbRQ'; 
    const range = 'Respuestas de formulario 1!A2:Z'; // Ajusta el nombre de la hoja

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    
    return NextResponse.json({ rows: response.data.values || [] });

  } catch (error) {
    console.error('Error al leer la hoja de clima:', error);
    return NextResponse.json({ error: 'Error al leer los datos de clima.' }, { status: 500 });
  }
}