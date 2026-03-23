import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = '/api/events';

  getAll(): Observable<Event[]> {
    console.log('getAll called');
    return this.http.get<Event[]>(`${this.apiBase}/`);
  }

  getOne(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiBase}/${id}/`);
  }
}
