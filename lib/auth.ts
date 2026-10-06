export type CustomerUser = {
  id: string;
  name: string;
  email: string;
};

const AUTH_STORAGE_KEY = "kulaura-bazar-user";

export function getCurrentUser(): CustomerUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!savedUser) {
    return null;
  }

  try {
    const user = JSON.parse(savedUser);

    if (
      typeof user?.id !== "string" ||
      typeof user?.name !== "string" ||
      typeof user?.email !== "string"
    ) {
      return null;
    }

    return user as CustomerUser;
  } catch {
    return null;
  }
}

export function saveCurrentUser(user: CustomerUser): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

  window.dispatchEvent(new Event("auth-updated"));
}

export function logoutUser(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);

  window.dispatchEvent(new Event("auth-updated"));
}

export function isUserLoggedIn(): boolean {
  return getCurrentUser() !== null;
}