export function obfuscateEmail(email: string): string {
  const [username, domain] = email.split('@'); // Split into username and domain
  if (!username || !domain) {
    throw new Error('Invalid email format');
  }

  const obfuscatedUsername =
    username.length > 3
      ? username.substring(0, 3) + 'x'.repeat(username.length - 3) // Preserve first 3 characters, replace rest with 'x'
      : username; // If username is too short, leave it as is

  return `${obfuscatedUsername}@${domain}`;
}
