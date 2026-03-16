import { Component, inject, OnInit, signal } from '@angular/core';

import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { ContentService, FaireUnDonContent } from '../../services/content.service';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-faire-un-don',
  standalone: true,
  imports: [PageHeroComponent],
  templateUrl: './faire-un-don.html',
  styleUrl: './faire-un-don.scss',
})
export class FaireUnDonComponent implements OnInit {
  private readonly content = inject(ContentService);
  private readonly imageService = inject(ImageService);

  readonly donateUrl = this.content.donateUrl;
  readonly page: FaireUnDonContent = this.content.getFaireUnDon();

  readonly heroImage = signal<string | null>(null);

  ngOnInit(): void {
    this.imageService.getAll('general').subscribe({
      next: (images) => {
        const bg = images.find(
          (img) =>
            img.title.toLowerCase().includes('football field')
        );
        if (bg) {
          this.heroImage.set(bg.url);
        }
      },
    });
  }
}
