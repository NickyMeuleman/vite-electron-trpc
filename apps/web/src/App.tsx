import { useState } from "react";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./utils/trpc";
import Home from "./Home";
import { ipcLink } from "trpc-electron/ipcLink";

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
        <Home />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
