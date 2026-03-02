import { Component, inject, OnInit, signal } from '@angular/core';

import { VideoService } from '../../services/video.service';
import { VideoAsset } from '../../models/video-asset';
import { ContentService, VideoShowcaseContent } from '../../services/content.service';

@Component({
  selector: 'app-video-showcase',
  standalone: true,
  templateUrl: './video-showcase.html',
  styleUrl: './video-showcase.scss',
})
export class VideoShowcaseComponent implements OnInit {
  private readonly videoService = inject(VideoService);
  private readonly content = inject(ContentService);

  readonly videoContent: VideoShowcaseContent = this.content.getHome().videoShowcase;

  readonly video = signal<VideoAsset | null>(null);
  readonly playing = signal(false);

  ngOnInit(): void {
    this.videoService.getAll().subscribe({
      next: (videos: VideoAsset[]) => {
        if (videos.length > 0) {
          this.video.set(videos[0]);
        }
      },
    });
  }

  play(): void {
    this.playing.set(true);
  }
}
