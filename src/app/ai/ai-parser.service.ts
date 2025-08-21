import { Injectable } from '@angular/core';
import { SYSTEM_PROMPT, USER_PROMPT } from './prompt';
import Ajv from 'ajv';
import { parseResultSchema } from './schema';
const ajv = new Ajv({ allErrors: true });
export interface TableElement {
    comprimido: string;
    jejum: string;
    peqAlmoco: string;
    almoco: string;
    lanche: string;
    jantar: string;
    deitar: string;
    notas: string;
}
export interface ParseResult { items: TableElement[] }

@Injectable({ providedIn: 'root' })
export class AiParserService {
    private model = 'mistral:latest';

    async parse(rawText: string, signal?: AbortSignal): Promise<TableElement[]> {
        const body = {
            model: this.model,
            stream: false,
            // "format":"json" helps Ollama return strict JSON in chat mode
            format: "json",
            options: {
                temperature: 0.1
            },
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: USER_PROMPT(rawText) }
            ]
        };

        const res = await fetch('/ollama/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`Ollama HTTP ${res.status}: ${text}`);
        }

        // Typical Ollama chat response: { message: { content }, ... }
        const data = await res.json();
        const content: string = data?.message?.content ?? '';

        // If format: "json" worked, content should be raw JSON. Still be defensive:
        const json = this.extractJson(content);
        const parsed = JSON.parse(json) as ParseResult;
        const validate = ajv.compile(parseResultSchema);
        if (!validate(parsed)) {
            console.warn('Schema validation failed:', validate.errors);
            // Decide: throw error or continue best-effort
        }
        return (parsed.items || []).map(this.normalizeRow);
    }

    private extractJson(text: string): string {
        const fence = text.match(/```json\s*([\s\S]*?)```/i);
        if (fence) return fence[1].trim();
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) return text.slice(start, end + 1).trim();
        return text.trim(); // trust "format":"json" path
    }

    private normalizeRow(row: Partial<TableElement>): TableElement {
        return {
            comprimido: row.comprimido?.trim() || '',
            jejum: row.jejum?.trim() || '',
            peqAlmoco: row.peqAlmoco?.trim() || '',
            almoco: row.almoco?.trim() || '',
            lanche: row.lanche?.trim() || '',
            jantar: row.jantar?.trim() || '',
            deitar: row.deitar?.trim() || '',
            notas: row.notas?.trim() || ''
        };
    }
}
