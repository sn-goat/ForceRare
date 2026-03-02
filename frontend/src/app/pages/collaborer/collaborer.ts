import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { FaqComponent } from '../../components/faq/faq';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner';
import { ContentService, CollaborerContent } from '../../services/content.service';

@Component({
  selector: 'app-collaborer',
  standalone: true,
  imports: [RouterLink, PageHeroComponent, FaqComponent, CtaBannerComponent],
  templateUrl: './collaborer.html',
  styleUrl: './collaborer.scss',
})
export class CollaborerComponent {
  private readonly content = inject(ContentService);

  readonly donateUrl = this.content.donateUrl;
  readonly page: CollaborerContent = this.content.getCollaborer();
}
