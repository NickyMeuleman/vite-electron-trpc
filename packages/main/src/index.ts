import { app, ipcMain } from "electron";
import type { IpcMain } from "electron";
import "./security-restrictions";
import { restoreOrCreateWindow } from "/@/mainWindow";
import type {
  AnyRouter,
  inferRouterContext,
  inferRouterError,
  ProcedureType,
} from "@trpc/server";
import {
  callProcedure,
  getErrorFromUnknown,
  transformTRPCResponse,
  TRPCError,
} from "@trpc/server";
import type {
  TRPCResponse,
  TRPCErrorResponse,
  TRPCResultResponse,
} from "@trpc/server/rpc";
import { createContext } from "../../api/context";
import { appRouter } from "../../api/router";
// import { createIPCHandler } from "electron-trpc";

/**
 * Prevent electron from running multiple instances.
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on("second-instance", restoreOrCreateWindow);

/**
 * Disable Hardware Acceleration to save more system resources.
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/latest/api/app#event-activate-macos Event: 'activate'.
 */
app.on("activate", restoreOrCreateWindow);

/**
 * Create the application window when the background process is ready.
 */
app
  .whenReady()
  .then(restoreOrCreateWindow)
  .catch((e) => console.error("Failed create window:", e));

/**
 * Install Vue.js or any other extension in development mode only.
 * Note: You must install `electron-devtools-installer` manually
 */
// if (import.meta.env.DEV) {
//   app.whenReady()
//     .then(() => import('electron-devtools-installer'))
//     .then(({default: installExtension, VUEJS3_DEVTOOLS}) => installExtension(VUEJS3_DEVTOOLS, {
//       loadExtensionOptions: {
//         allowFileAccess: true,
//       },
//     }))
//     .catch(e => console.error('Failed install extension:', e));
// }

/**
 * Check for new version of the application - production mode only.
 */
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import("electron-updater"))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error("Failed check updates:", e));
}

function createIPCHandler<TRouter extends AnyRouter>({
  createContext,
  router,
  ipcMain,
}: {
  createContext?: () => Promise<inferRouterContext<TRouter>>;
  router: TRouter;
  ipcMain: IpcMain;
}) {
  ipcMain.handle("electron-trpc", (_event: unknown, opts: TRPCHandlerArgs) => {
    const { input, path, type } = opts;
    return resolveIPCResponse({
      createContext,
      input,
      path,
      router,
      type,
    });
  });
}

async function resolveIPCResponse<TRouter extends AnyRouter>({
  createContext,
  type,
  input,
  path,
  router,
}: {
  createContext?: () =>
    | inferRouterContext<TRouter>
    | Promise<inferRouterContext<TRouter>>;
  input?: unknown;
  type: ProcedureType;
  path: string;
  router: TRouter;
}): Promise<TRPCResponse> {
  type TRouterResponse =
    | TRPCErrorResponse<inferRouterError<TRouter>>
    | TRPCResultResponse<unknown>;

  let ctx: inferRouterContext<TRouter> | undefined = undefined;

  let json: TRouterResponse;
  try {
    if (type === "subscription") {
      throw new TRPCError({
        message: `Unexpected operation ${type}`,
        code: "METHOD_NOT_SUPPORTED",
      });
    }

    ctx = await createContext?.();

    const deserializedInput =
      typeof input !== "undefined"
        ? router._def.transformer.input.deserialize(input)
        : input;
    //! tracked the transformer issue down to deserialize(input) returning undefined if superjson is used
    // input doesn't arrive as serialized since it doesn't have the shape superjson serialized to (an object with json and meta fields)
    // apparently superjson transformer isn't needed here because Set and Date work without it somehow
    // later me: I forgot I wasn't doing web and the input doesn't go over HTTP, maybe the stuff I use superjson for on the web isn't needed here

    const output = await callProcedure({
      ctx,
      router: router as any,
      path,
      input: deserializedInput,
      type,
    });

    json = {
      id: null,
      result: {
        type: "data",
        data: output,
      },
    };
  } catch (cause) {
    const error = getErrorFromUnknown(cause);

    json = {
      id: null,
      error: router.getErrorShape({
        error,
        type,
        path,
        input,
        ctx,
      }),
    };
  }

  return transformTRPCResponse(router, json) as TRPCResponse;
}

export interface TRPCHandlerArgs {
  path: string;
  type: ProcedureType;
  input?: unknown;
}

app.on("ready", () => {
  createIPCHandler({ ipcMain, router: appRouter, createContext });
});
