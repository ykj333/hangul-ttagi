export type VideoCategory =
  | "언어·동화"
  | "신체·음악"
  | "자연·수학"
  | "자연·관찰"
  | "마음·감정"
  | "생활 습관";

export interface VideoItem {
  id: string;
  order: number;
  title: string;
  category: VideoCategory | string;
  creatorName: string;
  ownerEmail: string;
  className: string;
  ageGroup: string;
  durationLabel: string;
  durationSeconds?: number;
  description: string;
  playbackUrl?: string;
  downloadUrl?: string;
  sourceSiteUrl?: string;
  licenseNote?: string;
  isTeacherUpload: boolean;
  isSharedCuration: boolean;
  rightsConfirmed: boolean;
  sponsorFreeConfirmed: boolean;
  likes: number;
  shares: number;
  downloads: number;
  views: number;
  themeColors?: [string, string, string];
  characterType?: string;
  createdAt?: string;
}

export interface TeacherUser {
  id: string;
  name: string;
  email: string;
  avatarText: string;
  className: string;
  institutionName: string;
  authProvider: "google" | "demo";
}

export interface ScrapeVideoCandidate {
  title: string;
  description?: string;
  playbackUrl: string;
  downloadUrl?: string;
  sourceSiteUrl?: string;
  ageGroup?: string;
  category?: VideoCategory | string;
  durationLabel?: string;
  licenseNote?: string;
  sponsorFreeConfirmed?: boolean;
  rightsConfirmed?: boolean;
}
