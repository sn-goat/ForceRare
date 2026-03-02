import { Component, inject, OnInit, signal } from '@angular/core';
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

  readonly donateUrl = this.content.donateUrl;
  readonly page: CollaborerContent = this.content.getCollaborer();

  readonly heroImage = signal<string | null>(null);

  ngOnInit(): void {
    this.imageService.getAll('general').subscribe({
      next: (images) => {
        const bg = images.find(
          (img) =>
            img.title.toLowerCase().includes('football') ||
            img.title.toLowerCase().includes('terrain'),
        );
        if (bg) {
          this.heroImage.set(bg.url);
        }
      },
    });
  }
}
