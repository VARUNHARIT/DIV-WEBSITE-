export type ClubId =
  | 'coding'
  | 'industry-readiness'
  | 'cultural'
  | 'sports'
  | 'social-media';

export type EventCategory =
  | 'All'
  | 'Workshops'
  | 'Hackathons'
  | 'Competitions'
  | 'Technical'
  | 'Cultural'
  | 'Sports';

export type GalleryCategory =
  | 'All moments'
  | 'Technology'
  | 'Community'
  | 'Creative work'
  | 'Videos';

export type PortalTab =
  | 'overview'
  | 'profile'
  | 'clubs'
  | 'events'
  | 'certificates'
  | 'notifications';

export type AdminTab =
  | 'overview'
  | 'students'
  | 'clubs'
  | 'events'
  | 'create-event'
  | 'content'
  | 'roles'
  | 'analytics';

export type AdminRole =
  | 'Super Admin'
  | 'Faculty Coordinator'
  | 'President'
  | 'Vice President'
  | 'Club Head'
  | 'Event Manager';

export interface ClubInfo {
  id: ClubId;
  index: string;
  symbol: string;
  shortName: string;
  fullName: string;
  homeTitle: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  hubTagline: string;
  hubDescription: string;
  homeTagline: string;
  tags: string[];
  leader: string;
  heroEmblemLabel: string;
  whatWeDo: {
    index: string;
    title: string;
    description: string;
  }[];
  showcaseTitle: string;
  showcaseItems: {
    index: string;
    title: string;
  }[];
  headRoleTitle: string;
}

export interface EventProgramme {
  id: string;
  category: Exclude<EventCategory, 'All'>;
  kicker: string;
  homeKicker: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  clubId: ClubId;
  clubName: string;
  audience: string;
  date: string;
  venue: string;
  format: string;
  status: string;
  image?: string;
  cardOverlayText?: string;
  expectHeading: string;
  expectSteps: {
    index: string;
    title: string;
    description: string;
  }[];
  bringNote?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, 'All moments'>;
  caption: string;
  type: 'photo' | 'video';
  image?: string;
}

export interface TeamLeader {
  index: string;
  role: string;
  name: string;
  affiliation: string;
}

export interface DemoStudentRecord {
  id: string;
  name: string;
  divId: string;
  club: string;
  clubIds: ClubId[];
  status: 'Active' | 'Pending review' | 'Rejected';
  email: string;
  department: string;
  academicYear: string;
}

export interface DemoNotification {
  id: string;
  category: 'MEMBERSHIP' | 'EVENTS' | 'ANNOUNCEMENT' | 'CERTIFICATES';
  title: string;
  body: string;
  unread: boolean;
}

export interface DraftEventItem {
  id: string;
  kicker: string;
  title: string;
  club: string;
  category: string;
  date: string;
  venue: string;
  description: string;
  eligibility: string;
  status: 'Draft' | 'In review' | 'Published' | 'Archived';
}

export type ActiveModal =
  | null
  | { type: 'enquiry'; name: string; subject: string }
  | { type: 'membership-preview'; name: string }
  | { type: 'review-student'; studentId: string }
  | { type: 'draft-preview'; title: string; status: string }
  | { type: 'sample-report'; reportTitle: string }
  | { type: 'sample-certificate' }
  | { type: 'forgot-password' }
  | { type: 'access-context'; roleName?: string }
  | { type: 'lightbox'; item: GalleryItem }
  | { type: 'video-placeholder'; title: string }
  | { type: 'edit-club-head'; clubId: ClubId };
