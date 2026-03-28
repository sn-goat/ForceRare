import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService, NavLink } from '../../services/content.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {
  private readonly content = inject(ContentService);

  readonly footer = this.content.getFooter();
  readonly navLinks: NavLink[] = this.content.getNavLinks().filter(l => l.route !== '/');
}
