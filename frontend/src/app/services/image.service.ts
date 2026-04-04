import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

import { ImageAsset, ImageCategory } from '../models/image-asset';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = '/api/images';
  private readonly cache = new Map<string, Observable<ImageAsset[]>>();

  getAll(category?: ImageCategory): Observable<ImageAsset[]> {
    const key = category ?? '__all__';
    if (!this.cache.has(key)) {
      let params = new HttpParams();
      if (category) {
        params = params.set('category', category);
      }
      this.cache.set(
        key,
        this.http.get<ImageAsset[]>(`${this.apiBase}/`, { params }).pipe(shareReplay(1)),
      );
    }
    return this.cache.get(key)!;
  }

  getOne(id: number): Observable<ImageAsset> {
    return this.http.get<ImageAsset>(`${this.apiBase}/${id}/`);
  }
}
