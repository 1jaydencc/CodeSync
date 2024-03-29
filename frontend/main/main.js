//frontend/main/main.js

const {
  app,
  BrowserWindow,
  Menu,
  globalShortcut,
  dialog,
  ipcMain,
} = require("electron");
const serve = require("electron-serve");
const path = require("path");
const fs = require("fs").promises; // Import fs promises for async file operations

const appName = "CodeSync";
app.setName(appName);
const appData = app.getPath("appData");
app.setPath("userData", path.join(appData, appName));

const appServe = app.isPackaged
  ? serve({
      directory: path.join(__dirname, "../out"),
    })
  : null;

let win;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true, // Protect against prototype pollution
      enableRemoteModule: false, // Turn off remote
      nodeIntegration: false, // Node integration should be off for security
    },
    titleBarStyle: "hidden",
  });

  const isMac = process.platform === "darwin";

  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: "File",
      submenu: [
        {
          label: "Open...",
          accelerator: isMac ? "Cmd+O" : "Ctrl+O",
          click: async () => {
            // Mark this function as async
            const result = await dialog.showOpenDialog(win, {
              properties: ["openFile"],
            });
            if (!result.canceled && result.filePaths.length > 0) {
              const filePath = result.filePaths[0];
              try {
                const data = await fs.readFile(filePath, "utf8"); // Use await with fs.readFile
                win.webContents.send("file-opened", {
                  path: filePath,
                  content: data,
                });
                console.log("File opened:", filePath);
              } catch (err) {
                console.error("Failed to read file:", err);
              }
            }
          },
        },
        {
          label: "Save",
          accelerator: isMac ? "Cmd+S" : "Ctrl+S",
          click: () => {
            win.webContents.send("invoke-save"); // Change from "save-request" to "invoke-save"
          },
        },
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" },
      ],
    },
    // { role: 'editMenu' }
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
              },
            ]
          : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
      ],
    },
    // { role: 'viewMenu' }
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    // { role: 'windowMenu' }
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...(isMac
          ? [
              { type: "separator" },
              { role: "front" },
              { type: "separator" },
              { role: "window" },
            ]
          : [{ role: "close" }]),
      ],
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: async () => {
            const { shell } = require("electron");
            await shell.openExternal("https://electronjs.org");
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  if (app.isPackaged) {
    appServe(win).then(() => {
      win.loadURL("app://-");
    });
  } else {
    win.loadURL("http://localhost:3000");
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }
};

app.on("ready", () => {
  const ret = globalShortcut.register("F12", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
      win.webContents.toggleDevTools();
    }
  });

  if (!ret) {
    console.log("registration failed");
  }

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered("F12"));
  createWindow();
});

ipcMain.handle("open-file", async () => {
  const { filePaths } = await dialog.showOpenDialog(win, {
    properties: ["openFile"],
    // Optional: add filters for file types
  });
  if (filePaths && filePaths.length > 0) {
    const fs = require("fs").promises;
    const content = await fs.readFile(filePaths[0], "utf8");
    return { path: filePaths[0], content };
  }
});

ipcMain.handle("save-file", async (event, { path, content }) => {
  const fs = require("fs").promises;
  await fs.writeFile(path, content);
  console.log("file:", path, "saved:", content);
});

app.on("window-all-closed", () => {
  globalShortcut.unregisterAll();
  app.quit();
});
