import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LowerCasePipe } from '@angular/common';

import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner';
import { ContentService, NosPartenairesContent, PartnerInfo } from '../../services/content.service';
import { ImageService } from '../../services/image.service';
import { ImageAsset } from '../../models/image-asset';

@Component({
  selector: 'app-nos-partenaires',
  standalone: true,
  imports: [LowerCasePipe, PageHeroComponent, CtaBannerComponent],
  templateUrl: './nos-partenaires.html',
  styleUrl: './nos-partenaires.scss',
})
export class NosPartenairesComponent implements OnInit {
  private readonly content = inject(ContentService);
  private readonly imageService = inject(ImageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly page: NosPartenairesContent = this.content.getNosPartenaires();
  readonly partners: PartnerInfo[] = this.content.getPartners();

  readonly heroImage = signal<string | null>(null);
  readonly partnerImages = signal<ImageAsset[]>([]);

  ngOnInit(): void {
    this.imageService.getAll('hero').pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (images) => {
        if (images.length > 0) {
          this.heroImage.set(images[1].url);
        }
      },
      error: () => undefined,
    });

    this.imageService.getAll('partner').pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (images: ImageAsset[]) => {
        this.partnerImages.set(images);
      },
      error: () => undefined,
    });
  }

  getPartnerImage(partner: PartnerInfo): ImageAsset | undefined {
    const titleMap: Record<string, string> = {
      RQMO: 'logo rqmo',
      'Fonds Mille-Pattes': 'logo fdmp',
      CHUL: 'logo chul',
      NovaStim: 'logo novastim',
    };

    const expected = titleMap[partner.name];
    if (!expected) {
      return undefined;
    }

    return this.partnerImages().find(
      (img) => this.normalizeText(img.title) === expected,
    );
  }

  private normalizeText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }
}
