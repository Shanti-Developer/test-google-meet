export type AccessType = 'ACCESS_TYPE_UNSPECIFIED' | 'OPEN' | 'TRUSTED' | 'RESTRICTED';
export type EntryPointAccess = 'ENTRY_POINT_ACCESS_UNSPECIFIED' | 'ALL' | 'CREATOR_ONLY';
export type Moderation = 'MODERATION_UNSPECIFIED' | 'ON' | 'OFF';

export interface SpaceConfig {
  accessType?: AccessType;
  entryPointAccess?: EntryPointAccess;
  moderation?: Moderation;
}

export interface ActiveConference {
  conferenceRecord?: string;
}

export interface Space {
  name: string; // e.g. "spaces/abc-defg-hij"
  meetingUri: string; // e.g. "https://meet.google.com/abc-defg-hij"
  meetingCode: string; // e.g. "abc-defg-hij"
  config?: SpaceConfig;
  activeConference?: ActiveConference;
}

export interface UserProfile {
  name: string;
  email: string;
  photoURL: string;
}
