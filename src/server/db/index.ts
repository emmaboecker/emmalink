import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";

export const queryClient = postgres(env.DATABASE_URL);

export const db = drizzle(queryClient, { schema });
