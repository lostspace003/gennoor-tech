// Who can use the CRM and admin centre. THE one list: the sign-in check, the
// route guard, the API and the screens all read it from here. To add or remove
// a person, change this file only.
//
// Plain constants, no imports, so it loads anywhere (browser, server, edge).

export const CRM_USERS = [
  'admin@gennoor.com',
  'jalalkhan@gennoor.com',
  'yusufchaudhary@gennoor.com',
  'sales@gennoor.com',
]

export const CRM_ADMIN = 'admin@gennoor.com'

// Managers can import, assign and delete leads, and see the Team page.
// Everyone else works the leads they hold.
export const CRM_MANAGERS = ['admin@gennoor.com', 'yusufchaudhary@gennoor.com']

export const isCrmUser = (email?: string | null) => CRM_USERS.includes((email || '').toLowerCase())
export const isCrmManager = (email?: string | null) => CRM_MANAGERS.includes((email || '').toLowerCase())

/** "yusufchaudhary@gennoor.com" -> "yusufchaudhary", for chips and menus. */
export const shortName = (email?: string | null) => (email || '').split('@')[0]
