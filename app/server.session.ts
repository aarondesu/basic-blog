import { createCookieSessionStorage } from "react-router";

type SessionFlashData = {
  error?: {
    code?: string;
    message: string;
  };
  message?: string;
};

/**
 * Session storage for displaying flash message data into toasts
 * https://reactrouter.com/explanation/sessions-and-cookies#sessions
 */
const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionFlashData>({
    cookie: {
      name: "__session",
      secrets: ["myBlogSessionCookie"],
    },
  });

export { getSession, commitSession, destroySession };
