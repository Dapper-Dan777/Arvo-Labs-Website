/**
 * OpenAI Chat API Route
 * 
 * POST /api/chat
 * 
 * Verarbeitet Chat-Anfragen mit OpenAI GPT-4o-mini.
 * Unterstützt verschiedene Aktionen: summary, keypoints, default, mail, qa.
 * 
 * Request Body:
 * {
 *   prompt: string;           // Der Benutzer-Prompt
 *   action?: 'summary' | 'keypoints' | 'default' | 'mail' | 'qa';  // Optional: Aktionstyp
 *   documentText?: string;     // Optional: Text aus einem Dokument (für Dokumente-Funktion)
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

/**
 * Initialisiert den OpenAI Client lazy (zur Laufzeit, nicht beim Build)
 * 
 * WICHTIG: Client wird erst initialisiert, wenn die Route aufgerufen wird,
 * um Build-Fehler zu vermeiden, wenn OPENAI_API_KEY nicht gesetzt ist.
 */
function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  
  return new OpenAI({
    apiKey: apiKey,
  });
}

/**
 * System-Prompts für verschiedene Aktionen
 */
const SYSTEM_PROMPTS = {
  summary: 'Fasse den folgenden Text präzise und verständlich zusammen.',
  keypoints: 'Extrahiere die wichtigsten Punkte aus dem folgenden Text.',
  default: 'Du bist ein hilfreicher AI-Assistent namens Arvo.',
  mail: 'Du bist ein professioneller E-Mail-Assistent. Erstelle professionelle, höfliche E-Mails basierend auf den Anforderungen des Benutzers. Die E-Mail sollte klar, präzise und geschäftsmäßig formuliert sein.',
  qa: 'Du bist ein hilfreicher Assistent, der Fragen zu Dokumenten beantwortet. Antworte präzise und basiere deine Antworten ausschließlich auf dem bereitgestellten Dokument.',
} as const;

/**
 * POST Handler für Chat-Anfragen
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[Chat API] Neue Anfrage erhalten');

    // Request Body parsen
    const body = await request.json();
    const { prompt, action = 'default', documentText } = body;

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
    type ActionType = 'summary' | 'keypoints' | 'default' | 'mail' | 'qa';
    const validActions: ActionType[] = [
      'summary',
      'keypoints',
      'default',
      'mail',
      'qa',
    ];
    const selectedAction: ActionType = validActions.includes(action as ActionType) 
      ? (action as ActionType) 
      : 'default';

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

    // User-Content zusammenstellen (mit Dokument, falls vorhanden)
    let userContent = prompt;
    if (documentText && documentText.trim().length > 0) {
      // Wenn ein Dokument vorhanden ist, füge es zum Prompt hinzu
      userContent = `Dokument:\n${documentText}\n\nAnfrage: ${prompt}`;
    }

    console.log('[Chat API] Sende Anfrage an OpenAI:', {
      model: 'gpt-4o-mini',
      action: selectedAction,
      systemPrompt,
      hasDocument: !!documentText,
      promptLength: prompt.length,
      documentLength: documentText?.length || 0,
    });

    // OpenAI Client zur Laufzeit initialisieren
    const openai = getOpenAIClient();

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
          content: userContent,
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

