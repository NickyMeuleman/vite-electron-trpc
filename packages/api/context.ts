import * as trpc from "@trpc/server";
import { prisma } from "./db/client";

export const createContext = async (opts?: any) => {
  return {
    prisma,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
