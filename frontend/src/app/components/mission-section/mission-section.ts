import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService, MissionContent } from '../../services/content.service';

@Component({
  selector: 'app-mission-section',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mission-section.html',
  styleUrl: './mission-section.scss',
})
export class MissionSectionComponent {
  private readonly content = inject(ContentService);

  readonly mission: MissionContent = this.content.getHome().mission;
}
