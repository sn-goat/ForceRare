import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner';
import { ContentService, CollaborerContent } from '../../services/content.service';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-collaborer',
  standalone: true,
  imports: [RouterLink, PageHeroComponent, CtaBannerComponent],
  templateUrl: './collaborer.html',
  styleUrl: './collaborer.scss',
})
export class CollaborerComponent implements OnInit {
  private readonly content = inject(ContentService);
  private readonly imageService = inject(ImageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly donateUrl = this.content.donateUrl;
  readonly page: CollaborerContent = this.content.getCollaborer();

  readonly heroImage = signal<string | null>(null);

  ngOnInit(): void {
    this.imageService.getAll('general').pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (images) => {
        if (images.length > 0) {
          this.heroImage.set(images[1].url);
        }
      },
      error: () => undefined,
    });
  }
}
