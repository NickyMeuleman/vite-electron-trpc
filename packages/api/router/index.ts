import { z } from "zod";
import { createRouter } from "../context";

export const appRouter = createRouter().query("hi", {
  input: z.object({ name: z.string() }).nullish(),
  resolve({ input }) {
    return `Hello ${input?.name || "world"}`;
  },
});

// export type definition of API
export type AppRouter = typeof appRouter;
