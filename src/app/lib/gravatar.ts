export default async function getGravatarURL(
  email?: string,
): Promise<string | undefined> {
  if (!email) {
    return undefined;
  }

  const hashArray = Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(email)),
    ),
  );
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `https://gravatar.com/avatar/${hashHex}?d=404`;
}
