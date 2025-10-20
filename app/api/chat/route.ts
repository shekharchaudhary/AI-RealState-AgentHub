import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Use OpenAI to parse the natural language query
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a real estate search assistant. Parse the user's natural language query into structured search filters.

Return ONLY a valid JSON object with these fields (all optional):
{
  "location": "city name or address",
  "priceMin": number or null,
  "priceMax": number or null,
  "beds": number or null,
  "baths": number or null,
  "propertyType": "house" | "condo" | "townhouse" | "land" | "all" | null,
  "mapCenter": { "lat": number, "lng": number } or null,
  "mapZoom": number between 8-15 or null
}

Examples:
- "Show me houses in Palo Alto" → {"location": "Palo Alto, CA", "propertyType": "house", "mapCenter": {"lat": 37.4419, "lng": -122.1430}, "mapZoom": 13}
- "3 bedroom condos under 1 million in San Jose" → {"location": "San Jose, CA", "beds": 3, "propertyType": "condo", "priceMax": 1000000, "mapCenter": {"lat": 37.3382, "lng": -121.8863}, "mapZoom": 12}
- "Properties between 1.5M and 3M with 4+ bedrooms" → {"priceMin": 1500000, "priceMax": 3000000, "beds": 4}

Known Bay Area cities with coordinates:
- Palo Alto: 37.4419, -122.1430
- Mountain View: 37.3861, -122.0839
- Sunnyvale: 37.3688, -122.0363
- Menlo Park: 37.4530, -122.1817
- Redwood City: 37.4852, -122.2364
- San Jose: 37.3382, -121.8863
- San Francisco: 37.7749, -122.4194
- Oakland: 37.8044, -122.2712
- Berkeley: 37.8715, -122.2730
- Cupertino: 37.3230, -122.0322

Return ONLY the JSON object, no markdown formatting or explanation.`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const result = completion.choices[0].message.content;
    const parsedFilters = JSON.parse(result || '{}');

    // Return the parsed filters and a friendly response
    return NextResponse.json({
      filters: parsedFilters,
      message: `I'll search for ${parsedFilters.location ? `properties in ${parsedFilters.location}` : 'properties'}${parsedFilters.priceMin || parsedFilters.priceMax ? ` priced ${parsedFilters.priceMin ? `from $${(parsedFilters.priceMin / 1000000).toFixed(1)}M` : ''}${parsedFilters.priceMin && parsedFilters.priceMax ? ' to ' : ''}${parsedFilters.priceMax ? `up to $${(parsedFilters.priceMax / 1000000).toFixed(1)}M` : ''}` : ''}${parsedFilters.beds ? ` with ${parsedFilters.beds}+ bedrooms` : ''}${parsedFilters.baths ? ` and ${parsedFilters.baths}+ bathrooms` : ''}${parsedFilters.propertyType && parsedFilters.propertyType !== 'all' ? ` (${parsedFilters.propertyType}s only)` : ''}.`,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
