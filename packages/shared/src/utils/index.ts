// ID Generation
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Date Formatting
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("de-DE").format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

// String Utilities
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[äöü]/g, (char) => ({ ä: "ae", ö: "oe", ü: "ue" })[char] || char)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
