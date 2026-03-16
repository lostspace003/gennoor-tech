import { NextRequest, NextResponse } from 'next/server'
import { AzureOpenAI } from 'openai'

export const maxDuration = 30

function getClient() {
  return new AzureOpenAI({
    endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
    apiKey: process.env.AZURE_OPENAI_API_KEY!,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-12-01-preview',
  })
}

interface FieldDef {
  key: string
  label: string
  required: boolean
  type: string
}

export async function POST(req: NextRequest) {
  try {
    const { text, fields, agentName } = await req.json() as {
      text: string
      fields: FieldDef[]
      agentName: string
    }

    if (!text?.trim()) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT
    const apiKey = process.env.AZURE_OPENAI_API_KEY
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o'

    if (!endpoint || !apiKey) {
      console.error('Missing Azure OpenAI env vars:', { endpoint: !!endpoint, apiKey: !!apiKey, deployment })
      return NextResponse.json({ error: 'AI service is not configured. Please contact support.' }, { status: 503 })
    }

    const client = getClient()

    const fieldDescriptions = fields
      .map(f => `- "${f.key}" (${f.label})${f.required ? ' [REQUIRED]' : ' [OPTIONAL]'} — ${f.type === 'textarea' ? 'multi-line text' : 'short text'}`)
      .join('\n')

    const systemPrompt = `You are an expert resume/document parser for a career coaching platform. Your job is to extract structured information from a document and map it to specific form fields.

RULES:
1. Extract ONLY information that is clearly present in the document
2. Do NOT fabricate, guess, or infer information that isn't explicitly stated
3. If a field cannot be filled from the document, set its value to an empty string ""
4. For multi-line fields (textarea), preserve relevant detail and formatting
5. Be concise but complete — include key details like company names, years, technologies
6. For skills fields, extract as a comma-separated list
7. Return ONLY valid JSON — no markdown, no explanation, no code fences`

    const userPrompt = `The user selected the "${agentName}" agent. Extract information from the following document and fill in these form fields:

FIELDS TO FILL:
${fieldDescriptions}

DOCUMENT TEXT:
---
${text.slice(0, 8000)}
---

Return a JSON object where each key matches a field key above, and the value is the extracted text. Use empty string "" for fields you cannot fill. Example format:
{"field_key_1": "extracted value", "field_key_2": "", "field_key_3": "another value"}`

    const response = await client.chat.completions.create({
      model: deployment,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content?.trim()
    if (!content) {
      return NextResponse.json({ error: 'LLM returned empty response' }, { status: 500 })
    }

    let parsed: Record<string, string>
    try {
      parsed = JSON.parse(content)
    } catch {
      return NextResponse.json({ error: 'LLM returned invalid JSON' }, { status: 500 })
    }

    // Only keep known field keys and non-empty values
    const validKeys = new Set(fields.map(f => f.key))
    const result: Record<string, string> = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (validKeys.has(key) && typeof value === 'string' && value.trim()) {
        result[key] = value.trim()
      }
    }

    return NextResponse.json({ fields: result })
  } catch (error: any) {
    console.error('Field extraction error:', error?.status, error?.message, error?.error)
    const msg = error?.status === 404
      ? `Azure OpenAI deployment not found. Check AZURE_OPENAI_DEPLOYMENT env var (current: ${process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o'})`
      : `Failed to extract fields: ${error.message || 'Unknown error'}`
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
