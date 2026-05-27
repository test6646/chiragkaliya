const KEY = "admin_session_v1";
const PIN = (import.meta.env.VITE_ADMIN_PIN as string | undefined) || "";

export function adminConfigured() {
  return PIN.length > 0;
}

export function checkPin(pin: string) {
  return PIN.length > 0 && pin === PIN;
}

export function loginAdmin(pin: string) {
  if (!checkPin(pin)) return false;
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* noop */
  }
  return true;
}

export function logoutAdmin() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

export function isAdminAuthed() {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
