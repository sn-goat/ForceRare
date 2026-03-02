import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
  ElementRef,
  afterNextRender,
} from '@angular/core';

import { ContentService, StatsContent, StatItem } from '../../services/content.service';

@Component({
  selector: 'app-impact-stats',
  standalone: true,
  templateUrl: './impact-stats.html',
  styleUrl: './impact-stats.scss',
})
export class ImpactStatsComponent implements OnInit, OnDestroy {
  private readonly content = inject(ContentService);
  private readonly elRef = inject(ElementRef);

  readonly stats: StatsContent = this.content.getHome().stats;
  readonly animatedValues = signal<number[]>([]);

  private observer?: IntersectionObserver;
  private animated = false;

  constructor() {
    afterNextRender(() => {
      this.setupObserver();
    });
  }

  ngOnInit(): void {
    // Initialise all counters to 0
    this.animatedValues.set(this.stats.items.map(() => 0));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  formatStat(index: number, item: StatItem): string {
    const val = this.animatedValues()[index];
    if (item.suffix) {
      return `${val}${item.suffix}`;
    }
    return val.toString();
  }

  private setupObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.animated) {
          this.animated = true;
          this.animateCounters();
        }
      },
      { threshold: 0.3 }
    );
    this.observer.observe(this.elRef.nativeElement);
  }

  private animateCounters(): void {
    const duration = 1500;
    const fps = 60;
    const totalFrames = Math.round(duration / (1000 / fps));
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      const newValues = this.stats.items.map((item) =>
        Math.round(item.value * Math.min(ease, 1))
      );
      this.animatedValues.set(newValues);

      if (frame >= totalFrames) {
        clearInterval(interval);
        // Ensure exact final values
        this.animatedValues.set(this.stats.items.map((item) => item.value));
      }
    }, 1000 / fps);
  }
}
