const { contextBridge, ipcRenderer } = require("electron");
// const path = require("path");

contextBridge.exposeInMainWorld("electron",
{
    getLatestInstanceId: () =>
    {
        ipcRenderer.send("getLatestInstanceId");
    },
    dragOutListener: (params) =>
    {
        ipcRenderer.send("ondragstart", params);
    },
    minimise: () =>
    {
        ipcRenderer.send("minimise");
    },
    debugPrint: (message) =>
    {
        ipcRenderer.send("debugPrint", message);
    },
    saveConfig: (config) =>
    {
        console.log("received config")
        ipcRenderer.send("saveConfig", config);
    },
    onConfigReceived: (callback) => 
        ipcRenderer.on("configObj", callback),
    fetchConfig: () =>
    {
        ipcRenderer.send("fetchConfig");
    },
    resetConfig: () =>
    {
        ipcRenderer.send("resetConfig");
    }    
});

// For settings renderer
let configObj;
const updateConfigObj = (config) =>
{
    configObj = config;    
    console.log(configObj);
};

ipcRenderer.on("configObj", (event, config) =>
{
    configObj = JSON.parse(config);    
    const configFileContents = require(configObj.config.path);
    console.log(configFileContents);
    ipcRenderer.sendToHost(config);
    return configFileContents;
});

ipcRenderer.on("close-signal", (event) =>
{
    window.close();
});
ipcRenderer.on("history-instance", (event, filelist) => {});