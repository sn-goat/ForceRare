import { Component, inject } from '@angular/core';

import { ContentService, CtaContent } from '../../services/content.service';

@Component({
  selector: 'app-cta-banner',
  standalone: true,
  templateUrl: './cta-banner.html',
  styleUrl: './cta-banner.scss',
})
export class CtaBannerComponent {
  private readonly content = inject(ContentService);

  readonly cta: CtaContent = this.content.getHome().cta;
  readonly donateUrl: string = this.content.donateUrl;
}
