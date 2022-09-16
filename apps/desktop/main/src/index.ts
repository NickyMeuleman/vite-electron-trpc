// import { app, BrowserWindow } from 'electron'
// import { join } from 'path'
// const isSingleInstance = app.requestSingleInstanceLock()

// if (!isSingleInstance) {
//   app.quit()
//   process.exit(0)
// }

// async function createWindow() {
//   const browserWindow = new BrowserWindow({
//     show: false,
//     width: 1200,
//     height: 768,
//     webPreferences: {
//       webviewTag: false,
//       preload:join(app.getAppPath(), "../preload/dist/index.cjs"),
//     },
//   })

//   // If you install `show: true` then it can cause issues when trying to close the window.
//   // Use `show: false` and listener events `ready-to-show` to fix these issues.
//   // https://github.com/electron/electron/issues/25012
//   browserWindow.on('ready-to-show', () => {
//     browserWindow?.show()
//   })

//   // Define the URL to use for the `BrowserWindow`, depending on the DEV env.
//   const pageUrl = import.meta.env.DEV
//     ? 'http://localhost:5173'
//     : 'http://localhost:5173'

//   await browserWindow.loadURL(pageUrl)

//   return browserWindow
// }

// app.on('second-instance', () => {
//   createWindow().catch((err) =>
//     console.error('Error while trying to prevent second-instance Electron event:', err)
//   )
// })

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

// app.on('activate', () => {
//   createWindow().catch((err) =>
//     console.error('Error while trying to handle activate Electron event:', err)
//   )
// })

// app
//   .whenReady()
//   .then(createWindow)
//   .catch((e) => console.error('Failed to create window:', e))

import { app } from "electron";
import "./security-restrictions";
import { restoreOrCreateWindow } from "./mainWindow";

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