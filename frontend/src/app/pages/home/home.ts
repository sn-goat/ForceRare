import { Component } from '@angular/core';

import { HeroComponent } from '../../components/hero/hero';
import { VideoShowcaseComponent } from '../../components/video-showcase/video-showcase';
import { AboutPreviewComponent } from '../../components/about-preview/about-preview';
import { ImpactStatsComponent } from '../../components/impact-stats/impact-stats';
import { MissionSectionComponent } from '../../components/mission-section/mission-section';
import { PartnersStripComponent } from '../../components/partners-strip/partners-strip';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner';
import { FaqComponent } from '../../components/faq/faq';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    VideoShowcaseComponent,
    AboutPreviewComponent,
    ImpactStatsComponent,
    MissionSectionComponent,
    PartnersStripComponent,
    CtaBannerComponent,
    FaqComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {}
