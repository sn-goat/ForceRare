import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

import { VideoAsset, VideoCategory } from '../models/video-asset';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = '/api/videos';
  private readonly cache = new Map<string, Observable<VideoAsset[]>>();

  getAll(category?: VideoCategory): Observable<VideoAsset[]> {
    const key = category ?? '__all__';
    if (!this.cache.has(key)) {
      let params = new HttpParams();
      if (category) {
        params = params.set('category', category);
      }
      this.cache.set(
        key,
        this.http.get<VideoAsset[]>(`${this.apiBase}/`, { params }).pipe(shareReplay(1)),
      );
    }
    return this.cache.get(key)!;
  }

  getOne(id: number): Observable<VideoAsset> {
    return this.http.get<VideoAsset>(`${this.apiBase}/${id}/`);
  }
}
