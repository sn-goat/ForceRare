import { Component, inject, signal, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { ContentService, NavLink } from '../../services/content.service';

interface NavbarLink {
  label: string;
  route?: string;
  fragment?: string;
  children?: NavLink[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  private readonly content = inject(ContentService);
  private readonly router = inject(Router);
  private readonly aboutRoutes = ['/notre-histoire', '/notre-mission', '/notre-equipe'];

  readonly links: NavbarLink[] = this.buildLinks();
  readonly menuOpen = signal(false);
  readonly mobileAboutOpen = signal(false);
  readonly scrolled = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 50);

    if (this.menuOpen() && window.innerWidth <= 1024) {
      this.closeMenu();
    }
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  toggleMobileAbout(): void {
    this.mobileAboutOpen.update((v) => !v);
  }

  isAboutActive(): boolean {
    const url = this.router.url.split('?')[0].split('#')[0];
    return this.aboutRoutes.some((route) => url === route || url.startsWith(`${route}/`));
  }

  closeMenu(): void {
    this.menuOpen.set(false);
    this.mobileAboutOpen.set(false);
  }

  private buildLinks(): NavbarLink[] {
    const links = this.content.getNavLinks();
    const aboutChildren = links.filter((link) => this.aboutRoutes.includes(link.route));
    const baseLinks = links.filter((link) => !this.aboutRoutes.includes(link.route));
    const homeLink = baseLinks.find((link) => link.route === '/');
    const remainingLinks = baseLinks.filter((link) => link.route !== '/');

    return [
      ...(homeLink ? [homeLink] : []),
      {
        label: 'À Propos',
        children: aboutChildren,
      },
      ...remainingLinks,
    ];
  }
}
