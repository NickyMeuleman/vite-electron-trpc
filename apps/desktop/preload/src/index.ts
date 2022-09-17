import { contextBridge, ipcRenderer } from "electron";
import { exposeElectronTRPC } from "trpc-electron/exposeTRPC";

process.once("loaded", async () => {
  exposeElectronTRPC({ contextBridge, ipcRenderer });
  // If you expose something here, you get window.something in the React app
  // contextBridge.exposeInMainWorld("something", {
  //   exposedThing: "this value was exposed via the preload file",
  // });
});
