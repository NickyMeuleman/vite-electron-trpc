import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./utils/trpc";
import {
  transformRPCResponse,
  TRPCAbortError,
  TRPCClientError,
  createTRPCClient,
} from "@trpc/client";
import type { AnyRouter } from "@trpc/server";
import type { TRPCLink, LinkRuntimeOptions } from "@trpc/client";
import Test from "./Test";
import superjson from "superjson";

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
          console.log({ op, envelope, response });
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
      // transformer: superjson,
      links: [ipcLink()],
    });
  });
  const [count, setCount] = useState(0);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <Test />
          <div>
            <a href="https://vitejs.dev" target="_blank">
              <img src="/vite.svg" className="logo" alt="Vite logo" />
            </a>
            <a href="https://reactjs.org" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>dinges</h1>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
