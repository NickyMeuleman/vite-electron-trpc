import { contextBridge, ipcRenderer } from "electron";
import type { IpcRenderer, ContextBridge } from "electron";
import type { ProcedureType } from "@trpc/server";

export const exposeElectronTRPC = ({
  contextBridge,
  ipcRenderer,
}: {
  contextBridge: ContextBridge;
  ipcRenderer: IpcRenderer;
}) => {
  return contextBridge.exposeInMainWorld("electronTRPC", {
    rpc: (args: TRPCHandlerArgs) => ipcRenderer.invoke("electron-trpc", args),
  });
};

export interface TRPCHandlerArgs {
  path: string;
  type: ProcedureType;
  input?: unknown;
}

process.once("loaded", async () => {
  exposeElectronTRPC({ contextBridge, ipcRenderer });
  // If you expose something here, you get window.something in the React app
  // contextBridge.exposeInMainWorld("something", {
  //   exposedThing: "this value was exposed via the preload file",
  // });
});
