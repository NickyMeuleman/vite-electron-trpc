import type { AppRouter } from "api/router";
import { createTRPCReact } from "@trpc/react";

export const trpc = createTRPCReact<AppRouter>();
