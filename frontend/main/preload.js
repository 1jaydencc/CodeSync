// frontend/main/preload.js

const { contextBridge, ipcRenderer } = require("electron");

// Define allowed channels for send and receive
const validSendChannels = ["save-file"];
const validReceiveChannels = ["fromMain", "file-opened", "invoke-save"]; // Include "file-opened" here
const validInvokeChannels = ["open-file", "save-file"];

contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel, data) => {
    if (validSendChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    if (validReceiveChannels.includes(channel)) {
      const subscription = (event, ...args) => func(event, ...args);
      ipcRenderer.on(channel, subscription);

      // Return a cleanup function to remove the listener
      return () => ipcRenderer.removeListener(channel, subscription);
    }
  },
  openFile: () => {
    if (validInvokeChannels.includes("open-file")) {
      return ipcRenderer.invoke("open-file");
    }
  },
  saveFile: (data) => {
    if (validInvokeChannels.includes("save-file")) {
      return ipcRenderer.invoke("save-file", data);
    }
  },
});
