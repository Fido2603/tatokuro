const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

// Setting the environment
process.env.NODE_ENV = 'producton';

let mainWindow;
let readingWindow;
let aboutWindow;

// Listen for app-ready - Main application window
app.on('ready', function(){
    var screenSize = electron.screen.getPrimaryDisplay().size;

    // New window
    mainWindow = new BrowserWindow({
        title: 'Tatokuro - Manga Reader',
        icon: __dirname + '/assets/icons/icon.png',
        show: false,
        // The size of the window will be dependant on the size of the primary display
        width: screenSize.width/100*80,
        height: screenSize.height/100*80
    });

    // Load HTML into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);

    // Show the application once it has loaded
    mainWindow.on('ready-to-show', function() { 
        mainWindow.show(); 
        mainWindow.focus(); 
    });

    // Quit app when close button is clicked
    mainWindow.on('closed', function(){
        app.quit();
    });

    // Open links in external browser
    mainWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    });
});

// Main menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Import Manga'
            },
            {
                label: 'Export Manga'
            },
            {
                label: 'Preferences'
            },
            {
                label: 'Exit',
                accelerator: 'CmdOrCtrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'About',
                click(){
                    createAboutWindow();
                }
            }
        ]
    }
]

// Creates the reading window
function createReadingWindow(){
    // New window
    readingWindow = new BrowserWindow({
        title: 'Tatokuro - Reading Window',
        icon: __dirname + '/assets/icons/icon.png',
        fullscreen: true
    });

    // Load HTML into window
    readingWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'reading.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open links in external browser
    readingWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    });

    // Garbage collection
    readingWindow.on('close', function(){
        readingWindow = null;
    });
}

// Creates the about window
function createAboutWindow(){
    var screenSize = electron.screen.getPrimaryDisplay().size;
    
    // New window
    aboutWindow = new BrowserWindow({
        title: 'Tatokuro - About',
        icon: __dirname + '/assets/icons/icon.png',
        show: false,
        width: screenSize.height/100*50,
        height: screenSize.height/100*50
    });

    // Removing menu
    if (process.env.NODE_ENV == 'production'){
        aboutWindow.removeMenu();
    }

    //aboutWindow.webContents.openDevTools();

    // Load HTML into window
    aboutWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'about.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open links in external browser
    aboutWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    });

    // Show the application once it has loaded
    aboutWindow.on('ready-to-show', function() { 
        aboutWindow.show(); 
        aboutWindow.focus(); 
    });

    // Garbage collection
    aboutWindow.on('close', function(){
        aboutWindow = null;
    });
}

// Add developer tools if not in production
if (process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: 'CmdOrCtrl+Shift+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}
