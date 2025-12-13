/**
 * OpenAI Chat API Route
 * 
 * POST /api/chat
 * 
 * Verarbeitet Chat-Anfragen mit OpenAI GPT-4o-mini.
 * Unterstützt verschiedene Aktionen: summary, keypoints, default.
 * 
 * Request Body:
 * {
 *   prompt: string;           // Der Benutzer-Prompt
 *   action?: 'summary' | 'keypoints' | 'default';  // Optional: Aktionstyp
 * }
 * 
 * Response:
 * {
 *   success: boolean;
 *   response: string;          // Die AI-Antwort
 *   error?: string;            // Fehlermeldung (nur bei success: false)
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialisiere OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * System-Prompts für verschiedene Aktionen
 */
const SYSTEM_PROMPTS = {
  summary: 'Fasse den folgenden Text präzise und verständlich zusammen.',
  keypoints: 'Extrahiere die wichtigsten Punkte aus dem folgenden Text.',
  default: 'Du bist ein hilfreicher AI-Assistent namens Arvo.',
} as const;

/**
 * POST Handler für Chat-Anfragen
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[Chat API] Neue Anfrage erhalten');

    // Request Body parsen
    const body = await request.json();
    const { prompt, action = 'default' } = body;

    // Validierung
    if (!prompt || typeof prompt !== 'string') {
      console.error('[Chat API] Fehler: prompt fehlt oder ist kein String');
      return NextResponse.json(
        {
          success: false,
          response: '',
          error: 'prompt ist erforderlich und muss ein String sein',
        },
        { status: 400 }
      );
    }

    if (prompt.trim().length === 0) {
      console.error('[Chat API] Fehler: prompt ist leer');
      return NextResponse.json(
        {
          success: false,
          response: '',
          error: 'prompt darf nicht leer sein',
        },
        { status: 400 }
      );
    }

    // Validiere action
    const validActions: Array<'summary' | 'keypoints' | 'default'> = [
      'summary',
      'keypoints',
      'default',
    ];
    const selectedAction = validActions.includes(action) ? action : 'default';

    console.log('[Chat API] Verarbeite Anfrage:', {
      action: selectedAction,
      promptLength: prompt.length,
    });

    // Prüfe API Key
    if (!process.env.OPENAI_API_KEY) {
      console.error('[Chat API] Fehler: OPENAI_API_KEY nicht gesetzt');
      return NextResponse.json(
        {
          success: false,
          response: '',
          error: 'OpenAI API Key nicht konfiguriert',
        },
        { status: 500 }
      );
    }

    // System-Prompt basierend auf Aktion auswählen
    const systemPrompt = SYSTEM_PROMPTS[selectedAction];

    console.log('[Chat API] Sende Anfrage an OpenAI:', {
      model: 'gpt-4o-mini',
      action: selectedAction,
      systemPrompt,
    });

    // OpenAI API aufrufen
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    // Antwort extrahieren
    const response = completion.choices[0]?.message?.content;

    if (!response) {
      console.error('[Chat API] Fehler: Keine Antwort von OpenAI erhalten');
      return NextResponse.json(
        {
          success: false,
          response: '',
          error: 'Keine Antwort von OpenAI erhalten',
        },
        { status: 500 }
      );
    }

    console.log('[Chat API] Erfolgreiche Antwort erhalten:', {
      responseLength: response.length,
      tokensUsed: completion.usage?.total_tokens,
    });

    // Erfolgreiche Antwort zurückgeben
    return NextResponse.json({
      success: true,
      response: response,
    });
  } catch (error) {
    // Error Handling
    console.error('[Chat API] Fehler beim Verarbeiten der Anfrage:', error);

    // Spezifische Fehlerbehandlung
    if (error instanceof OpenAI.APIError) {
      console.error('[Chat API] OpenAI API Fehler:', {
        status: error.status,
        message: error.message,
        code: error.code,
      });

      return NextResponse.json(
        {
          success: false,
          response: '',
          error: `OpenAI API Fehler: ${error.message}`,
        },
        { status: error.status || 500 }
      );
    }

    // Generischer Fehler
    const errorMessage =
      error instanceof Error ? error.message : 'Unbekannter Fehler';

    return NextResponse.json(
      {
        success: false,
        response: '',
        error: `Fehler beim Verarbeiten der Anfrage: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
