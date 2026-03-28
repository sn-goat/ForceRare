import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ImageAsset, ImageCategory } from '../models/image-asset';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = '/api/images';

  getAll(category?: ImageCategory): Observable<ImageAsset[]> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }
    return this.http.get<ImageAsset[]>(`${this.apiBase}/`, { params });
  }

  getOne(id: number): Observable<ImageAsset> {
    return this.http.get<ImageAsset>(`${this.apiBase}/${id}/`);
  }
}
