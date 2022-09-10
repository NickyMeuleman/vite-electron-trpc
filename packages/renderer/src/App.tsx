import { useState } from "react";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./utils/trpc";
import {
  transformRPCResponse,
  TRPCAbortError,
  TRPCClientError,
} from "@trpc/client";
import type { AnyRouter } from "@trpc/server";
import type { TRPCLink, LinkRuntimeOptions } from "@trpc/client";
import Test from "./Test";

// superjson transformer gets inside runtime in this function if passed to client
export function ipcLink<TRouter extends AnyRouter>(): TRPCLink<TRouter> {
  return (runtime: LinkRuntimeOptions) => {
    return ({ op, prev, onDestroy }) => {
      const promise = (window as any).electronTRPC.rpc(op);
      let isDone = false;

      const prevOnce: typeof prev = (result) => {
        if (isDone) {
          return;
        }
        isDone = true;
        prev(result);
      };

      onDestroy(() => {
        prevOnce(TRPCClientError.from(new TRPCAbortError(), { isDone: true }));
      });

      promise
        .then((envelope: any) => {
          const response = transformRPCResponse({ envelope, runtime });
          prevOnce(response);
        })
        .catch((cause: any) => {
          console.error("Got IPC error", cause);
          prevOnce(TRPCClientError.from(cause));
        });
    };
  };
}

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => {
    return trpc.createClient({
      links: [ipcLink()],
    });
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
          <Test />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
