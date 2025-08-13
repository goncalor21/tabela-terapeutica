import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  private idTable: string = '';

  emitIdTable(data: string) {
    this.idTable = data;
  }

  public getIdTable(): string{
    return this.idTable;
  }

  constructor() { }
}
