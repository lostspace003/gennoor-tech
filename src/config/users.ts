// User configuration with Entry IDs and passwords
// TODO: Move this to a secure database in production

interface User {
  entryId: string
  email: string
  password: string
  name: string
  role: 'admin' | 'ceo' | 'manager' | 'sales'
}

// These are the authorized users with their Entry IDs and passwords
// IMPORTANT: In production, passwords should be hashed and stored in a database
export const AUTHORIZED_USERS: User[] = [
  {
    entryId: 'ENTRY-001',
    email: 'admin@gennoor.com',
    password: 'Admin@2024!', // Change this to actual password
    name: 'Admin',
    role: 'admin'
  },
  {
    entryId: 'ENTRY-002',
    email: 'jalalkhan@gennoor.com',
    password: 'Jalal@CEO2024', // Change this to actual password
    name: 'Jalal Khan',
    role: 'ceo'
  },
  {
    entryId: 'ENTRY-003',
    email: 'yusufchaudhary@gennoor.com',
    password: 'Yusuf@Manager24', // Change this to actual password
    name: 'Yusuf Chaudhary',
    role: 'manager'
  },
  {
    entryId: 'ENTRY-004',
    email: 'contact@gennoor.com',
    password: 'Contact@Sales24', // Change this to actual password
    name: 'Contact',
    role: 'sales'
  }
]

export function validateUserCredentials(email: string, password: string): User | null {
  const user = AUTHORIZED_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  return user || null
}

export function getUserByEmail(email: string): User | null {
  return AUTHORIZED_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || null
}