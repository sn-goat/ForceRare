import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';

import { VideoService } from '../../services/video.service';
import { VideoAsset, VideoCategory } from '../../models/video-asset';

@Component({
  selector: 'app-video-showcase',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './video-showcase.html',
  styleUrl: './video-showcase.scss',
})
export class VideoShowcaseComponent implements OnInit {
  private readonly videoService = inject(VideoService);
  private readonly destroyRef = inject(DestroyRef);

  @Input() videoIndex = 0;
  @Input() category?: VideoCategory;

  readonly video = signal<VideoAsset | null>(null);
  readonly playing = signal(false);

  get displayHeading(): string {
    return this.video()?.title ?? "";
  }

  get displaySubtext(): string {
    return this.video()?.description ?? "";
  }

  ngOnInit(): void {
    this.videoService.getAll(this.category).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (videos: VideoAsset[]) => {
        if (videos.length > this.videoIndex) {
          this.video.set(videos[this.videoIndex]);
        } else if (videos.length > 0) {
          this.video.set(videos[0]);
        }
      },
      error: () => undefined,
    });
  }

  play(): void {
    this.playing.set(true);
  }
}
