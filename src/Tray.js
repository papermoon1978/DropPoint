const { Tray, Menu, nativeImage, app } = require("electron");
const { droppointDefaultIcon } = require("./Icons");
const { Settings } = require("./Settings");
const { Instance } = require("./Window");

let trayIcon = nativeImage
    .createFromPath(droppointDefaultIcon)
    .resize({ width: 16 });

trayIcon.setTemplateImage(true);

let tray;

/**
 * Sets system tray
 */
const setTray = () =>
{    
    tray = new Tray(trayIcon);
    let trayMenu =
    [
        {
            label: "New Instance",
            click: function ()
            {
                const instance = new Instance();
                const instanceID = instance.createNewWindow();
            },
        },
        {
            label: "Settings",
            click: function ()
            {
                const settings = new Settings();
                settings.openSettings();
            },
        },
        {
            type: "separator"
        },
        {
            label: "Quit",
            click: function ()
            {
                app.exit();
            },
        }
    ];    

    tray.setContextMenu(Menu.buildFromTemplate(trayMenu));
    tray.setToolTip("DropPoint");

    tray.on("double-click", () =>
    {
        const instance = new Instance();
        instance.createNewWindow();
    });
};

module.exports = {
    setTray: setTray,
};
