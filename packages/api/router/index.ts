import { createRouter } from "../context";
import { z } from "zod";
import { type BinaryLike, createHash } from "crypto";
import superjson from "superjson";

export function sha256sum(data: BinaryLike) {
  return createHash("sha256").update(data).digest("hex");
}

export const appRouter = createRouter()
  // .transformer(superjson)
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `hello ${input?.text ?? "world"}`,
      };
    },
  })
  .query("sha265", {
    input: z.object({
      string: z.string(),
    }),
    resolve({ input }) {
      return createHash("sha256").update(input.string).digest("hex");
    },
  })
  .query("date", {
    input: z.object({
      string: z.string(),
      test: z.set(z.number()),
    }),
    resolve({ input }) {
      const set = input.test;
      set.delete(3);
      return { date: new Date(input.string), setWith3Removed: set };
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;
