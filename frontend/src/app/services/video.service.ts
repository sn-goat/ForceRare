import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { VideoAsset, VideoCategory } from '../models/video-asset';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = '/api/videos';

  getAll(category?: VideoCategory): Observable<VideoAsset[]> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }
    return this.http.get<VideoAsset[]>(`${this.apiBase}/`, { params });
  }

  getOne(id: number): Observable<VideoAsset> {
    return this.http.get<VideoAsset>(`${this.apiBase}/${id}/`);
  }
}
