import { Auth as LuciaAuth } from "src/server/auth/auth";

declare global {
  /// <reference types="lucia" />
  namespace Lucia {
    type Auth = LuciaAuth;
    type DatabaseUserAttributes = {
      username: string;
      name: string;
      email: string;
      role: "admin" | "user";
    };
    type DatabaseSessionAttributes = {};
  }
}
