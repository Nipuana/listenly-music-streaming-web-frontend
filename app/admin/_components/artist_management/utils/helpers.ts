export function getInitials(name: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => (n ? n[0] : ""))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function resolveAdminNote(r: any) {
  return r?.adminNote ?? "";
}

export function getMessage(r: any) {
  return r?.message ?? "No message provided.";
}

export default {
  getInitials,
  resolveAdminNote,
  getMessage,
};
