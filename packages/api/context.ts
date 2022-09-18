import * as trpc from "@trpc/server";
import { prisma } from "./dbClient";

// 'PrismaClient' is not exported by ../api/generated/client/index.js, imported by ../api/dbClient.ts
// file: C:/Users/nicky/projects/vite-electron-builder-modified/packages/api/dbClient.ts:1:9
// 1: import { PrismaClient } from "./generated/client/index";
//             ^

// adding prisma to context makes things go boom
export const createContext = async (opts?: any) => {
  return {
    iets: "ahja",
    // prisma
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
