import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ImageAsset, ImageCategory } from '../models/image-asset';

/**
 * Thin HTTP wrapper around the read-only image API.
 *
 * Uses relative URLs so requests go through nginx in every environment.
 * Registered at root level — one singleton for the whole app.
 */
@Injectable({ providedIn: 'root' })
export class ImageService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = '/api/images';

  /** Fetch all published images, optionally filtered by category. */
  getAll(category?: ImageCategory): Observable<ImageAsset[]> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }
    return this.http.get<ImageAsset[]>(`${this.apiBase}/`, { params });
  }

  /** Fetch a single published image by id. */
  getOne(id: number): Observable<ImageAsset> {
    return this.http.get<ImageAsset>(`${this.apiBase}/${id}/`);
  }
}
