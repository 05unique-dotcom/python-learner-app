const USER_ID_KEY = "pythonLearnerUserId";

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `user-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getOrCreateUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = generateId();
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}
