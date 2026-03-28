import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ContentService, HeroContent, MissionContent } from '../../services/content.service';
import { ImageService } from '../../services/image.service';
import { ImageAsset } from '../../models/image-asset';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent implements OnInit {
  private readonly content = inject(ContentService);
  private readonly imageService = inject(ImageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly hero: HeroContent = this.content.getHome().hero;
  readonly mission: MissionContent = this.content.getHome().mission;
  readonly logoUrl = signal<string | null>(null);
  readonly pillarsIcons = ['01', '02', '03', '04'];

  ngOnInit(): void {
    this.imageService.getAll('hero').pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (images: ImageAsset[]) => {
        if (images.length > 0) {
          this.logoUrl.set(images[0].url);
        }
      },
      error: () => undefined,
    });
  }
}
