export const UserRoles = {
  ADMIN: 'admin',
  USER: 'user',
  SUPER_ADMIN: 'super_admin',
} as const;

export type UserRolesTyps = (typeof UserRoles)[keyof typeof UserRoles];
