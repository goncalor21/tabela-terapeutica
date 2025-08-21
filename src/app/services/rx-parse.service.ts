import { Injectable } from '@angular/core';

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
export class RxParseService {
  private base = '/api/parse'; // if backend runs on same origin via proxy; else set full URL

  async parse(text: string): Promise<TableElement[]> {
    const r = await fetch(this.base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!r.ok) {
      const err = await r.text().catch(()=>'');
      throw new Error(`Backend error (${r.status}): ${err}`);
    }
    const data = (await r.json()) as ParseResult;
    return data.items ?? [];
  }
}
