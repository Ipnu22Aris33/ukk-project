type InitialMode = "words" | "letters";

export function getInitials(
  text: string,
  options?: {
    length?: number;
    mode?: InitialMode;
  },
): string {
  if (!text || typeof text !== "string") return "";

  const { length = 2, mode = "words" } = options ?? {};
  const cleanText = text.trim();
  if (!cleanText) return "";

  if (mode === "letters") {
    const letters = cleanText.replace(/[^a-zA-Z]/g, "").slice(0, length);
    return letters.toUpperCase();
  }

  const words = cleanText.split(/\s+/);
  const initials = words
    .map((word) => {
      const firstLetter = word.match(/[a-zA-Z]/)?.[0] || "";
      return firstLetter;
    })
    .filter((letter) => letter !== "")
    .join("");

  return initials.slice(0, length).toUpperCase();
}
