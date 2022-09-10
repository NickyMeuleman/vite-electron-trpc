import * as trpc from "@trpc/server";

export const createContext = async (opts?: any) => {
  return {
    test:"yupyup"
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
