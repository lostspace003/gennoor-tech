import { requireCrmUser, type CrmSessionUser } from './access'

/**
 * Who may open the University Partnership campaign: everyone who works in the CRM, the people who work leads only
 * included, so that anyone can pick up a university and work it (owner, 27 November 2026: "everyone in the CRM").
 * The sign-in check on pages does not cover /api, so every address of the campaign starts with this.
 */
export async function requireCampaignUser(): Promise<CrmSessionUser | null> {
  return requireCrmUser()
}
