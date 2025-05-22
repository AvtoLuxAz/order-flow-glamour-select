export interface User {
  id: string;
  email?: string;
  role: string;

  // Properties from user profile data (users table)
  firstName?: string; // Mapped from first_name
  lastName?: string;  // Mapped from last_name
  
  // isActive: To be determined by is_active column in 'users' table, defaults to true.
  isActive: boolean; 

  // lastLoginAt: Represents the actual last sign-in time from Supabase auth.
  // This will be sourced from session.user.last_sign_in_at.
  lastLoginAt?: string; 

  // profileUpdatedAt: Represents the last update time of the user's record in the 'users' table.
  // This is if we decide to keep data.updated_at for some purpose.
  // For now, focusing on lastLoginAt for actual login time.
  // profileUpdatedAt?: string; 

  // Add other user-specific properties here if needed
  // For example:
  // avatar_url?: string;
  // phone_number?: string;
}

// Console log to confirm changes and guide testing
console.log("User model updated in src/models/user.model.ts:");
console.log("- Ensured 'role' is present.");
console.log("- Added 'firstName' (from 'first_name') and 'lastName' (from 'last_name').");
console.log("- Added 'isActive: boolean'. Intended to be sourced from 'users.is_active', defaults to true.");
console.log("- Added 'lastLoginAt?: string'. Intended to be sourced from Supabase session's 'last_sign_in_at'.");
console.log("- Removed confusing 'lastLogin' previously mapped from 'updated_at'.");
