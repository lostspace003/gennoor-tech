# Update User Passwords from Entry IDs

## Current User Configuration Location
File: `src/config/users.ts`

## Update Required
Please update the passwords in the users configuration file with the actual passwords from your Entry ID system.

### Current Users and Entry IDs:

```typescript
{
  entryId: 'ENTRY-001',
  email: 'admin@gennoor.com',
  password: 'Admin@2024!', // <- UPDATE THIS
  name: 'Admin',
  role: 'admin'
},
{
  entryId: 'ENTRY-002',
  email: 'jalalkhan@gennoor.com',
  password: 'Jalal@CEO2024', // <- UPDATE THIS
  name: 'Jalal Khan',
  role: 'ceo'
},
{
  entryId: 'ENTRY-003',
  email: 'yusufchaudhary@gennoor.com',
  password: 'Yusuf@Manager24', // <- UPDATE THIS
  name: 'Yusuf Chaudhary',
  role: 'manager'
},
{
  entryId: 'ENTRY-004',
  email: 'contact@gennoor.com',
  password: 'Contact@Sales24', // <- UPDATE THIS
  name: 'Contact',
  role: 'sales'
}
```

## How to Update:

1. Open `src/config/users.ts`
2. Replace each password with the actual password from your Entry ID system
3. Update the Entry IDs if they're different
4. Save the file
5. Commit and push to deploy

## Security Note:
In production, these passwords should be:
- Hashed (using bcrypt or similar)
- Stored in a secure database
- Never hardcoded in the source code

## Alternative: Environment Variables
If you prefer, you can set passwords in environment variables:
```
USER_ADMIN_PASSWORD=actual_password_here
USER_CEO_PASSWORD=actual_password_here
USER_MANAGER_PASSWORD=actual_password_here
USER_SALES_PASSWORD=actual_password_here
```

Then update the code to read from `process.env.USER_ADMIN_PASSWORD` etc.

## Testing After Update:
1. Run locally: `npm run dev`
2. Test each user login
3. Deploy to production
4. Test on live site