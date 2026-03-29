import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private readonly destroyRef = inject(DestroyRef);

  readonly donateUrl = this.content.donateUrl;
  readonly page: FaireUnDonContent = this.content.getFaireUnDon();

  readonly heroImage = signal<string | null>(null);

  ngOnInit(): void {
    this.imageService.getAll('general').pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (images) => {
        if (images.length > 0) {
          this.heroImage.set(images[3].url);
        }
      },
      error: () => undefined,
    });
  }
}
