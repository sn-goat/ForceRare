import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService, PartnersPreviewContent, PartnerInfo } from '../../services/content.service';

@Component({
  selector: 'app-partners-strip',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './partners-strip.html',
  styleUrl: './partners-strip.scss',
})
export class PartnersStripComponent {
  private readonly content = inject(ContentService);

  readonly heading: string = this.content.getHome().partners.heading;
  readonly subtext: string = this.content.getHome().partners.subtext;
  readonly cta: string = this.content.getHome().partners.cta;

  readonly partners: PartnerInfo[] = this.content.getPartners();
}
