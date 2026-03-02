import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeroComponent } from '../../components/page-hero/page-hero';
import { FaqComponent } from '../../components/faq/faq';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner';
import { ContentService, NotreMissionContent } from '../../services/content.service';

@Component({
  selector: 'app-notre-mission',
  standalone: true,
  imports: [RouterLink, PageHeroComponent, FaqComponent, CtaBannerComponent],
  templateUrl: './notre-mission.html',
  styleUrl: './notre-mission.scss',
})
export class NotreMissionComponent {
  private readonly content = inject(ContentService);

  readonly page: NotreMissionContent = this.content.getNotreMission();
}
