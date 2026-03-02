import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { VideoService } from '../../services/video.service';
import { VideoAsset } from '../../models/video-asset';
import { ContentService, VideoShowcaseContent } from '../../services/content.service';

@Component({
  selector: 'app-video-showcase',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './video-showcase.html',
  styleUrl: './video-showcase.scss',
})
export class VideoShowcaseComponent implements OnInit {
  private readonly videoService = inject(VideoService);
  private readonly content = inject(ContentService);

  @Input() videoIndex = 0;
  @Input() heading?: string;
  @Input() subtext?: string;

  readonly videoContent: VideoShowcaseContent = this.content.getHome().videoShowcase;

  readonly video = signal<VideoAsset | null>(null);
  readonly playing = signal(false);

  get displayHeading(): string {
    return this.heading ?? this.videoContent.heading;
  }

  get displaySubtext(): string {
    return this.subtext ?? this.videoContent.subtext;
  }

  ngOnInit(): void {
    this.videoService.getAll().subscribe({
      next: (videos: VideoAsset[]) => {
        if (videos.length > this.videoIndex) {
          this.video.set(videos[this.videoIndex]);
        } else if (videos.length > 0) {
          this.video.set(videos[0]);
        }
      },
    });
  }

  play(): void {
    this.playing.set(true);
  }
}
