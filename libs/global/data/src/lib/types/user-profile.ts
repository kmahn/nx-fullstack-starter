export const USER_ROLES = ['member', 'admin'] as const;
export type UserRoleType = typeof USER_ROLES[number];

export interface UserProfile {
  _id: string;
  role: UserRoleType;
}
