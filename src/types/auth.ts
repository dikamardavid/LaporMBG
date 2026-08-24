export type UserRole =
  | 'BGN_ADMIN'
  | 'BGN_AUDITOR'
  | 'SPPG_ADMIN'
  | 'SPPG_CHEF'
  | 'SCHOOL_PIC'

export interface SessionPayload {
  userId: string
  role: UserRole
  sppgId?: string
  schoolId?: string
  iat?: number
  exp?: number
}
