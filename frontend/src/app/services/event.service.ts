import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Event } from '../models/event';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = '/api/events';
  private cache$: Observable<Event[]> | null = null;

  getAll(): Observable<Event[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<Event[]>(`${this.apiBase}/`).pipe(shareReplay(1));
    }
    return this.cache$;
  }

  getOne(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiBase}/${id}/`);
  }
}
