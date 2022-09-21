import * as trpc from "@trpc/server";
import { prisma } from "database/src";

export const createContext = async (opts?: any) => {
  return {
    tomato: "tomahto",
    prisma,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const t = trpc.initTRPC.context<Context>().create();
