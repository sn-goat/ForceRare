import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ImageAsset } from '../models/image-asset';

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

  getAll(): Observable<ImageAsset[]> {
    return this.http.get<ImageAsset[]>(`${this.apiBase}/`);
  }

  getOne(id: number): Observable<ImageAsset> {
    return this.http.get<ImageAsset>(`${this.apiBase}/${id}/`);
  }
}
