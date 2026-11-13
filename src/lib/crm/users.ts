// Who can use the admin centre and the CRM. THE one place: the sign-in check, the
// route guard, the API and the screens all read it from here. To add or remove
// a person, change this file only.
//
// Two levels (owner, 13 November 2026):
//   ADMIN_USERS  open everything: the admin centre (/admin) and the CRM (/crm).
//   CRM_USERS    everyone above, and the people who work leads in the CRM only.
// A person on CRM_USERS alone is sent to the CRM if they open /admin, and the
// admin centre's own addresses (/api/admin/...) refuse them.
//
// Plain constants, no imports, so it loads anywhere (browser, server, edge).

/** The admin centre and the CRM: the whole back office. */
export const ADMIN_USERS = [
  'admin@gennoor.com',
  'jalalkhan@gennoor.com',
  'yusufchaudhary@gennoor.com',
  'sales@gennoor.com',
]

/** The CRM only (they also may sign in, but see nothing of the admin centre). */
const CRM_ONLY_USERS = [
  'luthermarak@gennoor.com',
]

/** Everyone who may sign in and use the CRM. */
export const CRM_USERS = [...ADMIN_USERS, ...CRM_ONLY_USERS]

export const CRM_ADMIN = 'admin@gennoor.com'

// Managers can import, assign and delete leads, and see the Team page.
// Everyone else works the leads they hold.
export const CRM_MANAGERS = ['admin@gennoor.com', 'yusufchaudhary@gennoor.com']

export const isCrmUser = (email?: string | null) => CRM_USERS.includes((email || '').toLowerCase())
export const isCrmManager = (email?: string | null) => CRM_MANAGERS.includes((email || '').toLowerCase())
/** May this person open the admin centre? */
export const isAdminUser = (email?: string | null) => ADMIN_USERS.includes((email || '').toLowerCase())

/** "yusufchaudhary@gennoor.com" -> "yusufchaudhary", for chips and menus. */
export const shortName = (email?: string | null) => (email || '').split('@')[0]
