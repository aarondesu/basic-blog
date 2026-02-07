import { createSessionStorage } from "react-router";

type SessionData = {
  access_token: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } = createSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: "__session",
    domain: "localhost",
    httpOnly: true,
    maxAge: 50,
    path: "/",
    sameSite: "lax",
    secrets: ["test"],
    secure: true,
  },
  createData: async () => JSON.stringify({ access_token: "" }),
  readData: async (data) => JSON.parse(data),
  updateData: async (data) => {},
  deleteData: async () => {},
});

export { getSession, commitSession, destroySession };
