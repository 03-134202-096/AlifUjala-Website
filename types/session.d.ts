import "iron-session"

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number | string
      username?: string
      email?: string
      isPremium?: boolean
      lives?: number
    }
  }
}
