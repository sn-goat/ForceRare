import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { VideoAsset, VideoCategory } from '../models/video-asset';

/**
 * Thin HTTP wrapper around the read-only video API.
 *
 * Uses relative URLs so requests go through nginx in every environment.
 * Registered at root level — one singleton for the whole app.
 */
@Injectable({ providedIn: 'root' })
export class VideoService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = '/api/videos';

  /** Fetch all published videos, optionally filtered by category. */
  getAll(category?: VideoCategory): Observable<VideoAsset[]> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }
    return this.http.get<VideoAsset[]>(`${this.apiBase}/`, { params });
  }

  /** Fetch a single published video by id. */
  getOne(id: number): Observable<VideoAsset> {
    return this.http.get<VideoAsset>(`${this.apiBase}/${id}/`);
  }
}
