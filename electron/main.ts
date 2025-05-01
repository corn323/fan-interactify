import { release } from 'os'
import path from 'path'
import express, { type Request, type Response, type NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import bodyParser from 'body-parser'
import { BrowserWindow, app, ipcMain, shell } from 'electron'
import { PrismaClient } from '@prisma/client';
import ngrok from '@ngrok/ngrok';

const prisma = new PrismaClient()
const server = express();
const userDataPath = 'userData.db'
let tokenInputWondow: BrowserWindow | null = null;
let win: BrowserWindow | null = null
const preload = path.join(__dirname, 'preload.js')
const distPath = path.join(__dirname, '../.output/public')
let expressServer;
let ngrokListener: ngrok.Listener;
let exePath = path.join(`${__dirname}/../`);
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
if (app.isPackaged) {
  process.env.DATABASE_URL = `file:${userDataPath}`
  exePath = path.join(path.dirname(app.getPath("exe")))
}
console.log(`exePath: ${exePath}`);

server.use('/', rateLimit({
  windowMs: 60 * 1000,
  max: 600,
  message: '請不要發送太多請求',
  keyGenerator: (req) => req.ip ?? ''
}));
server.use(bodyParser.json());
server.get('/', (req, res) => {
  res.status(200).sendFile(path.join(exePath, 'fanInteraction.html'));
})
server.use('/interactionPage', internalOnlyMiddleware, express.static(path.join(exePath, 'liveStickInteractionPage')));
server.get('/getUserData', internalOnlyMiddleware, async (req: Request, res: Response) => {
  res.status(200).json(await prisma.userData.findMany());
})
server.get('/getUrl', internalOnlyMiddleware, async (req: Request, res: Response) => {
  res.status(200).send(ngrokListener?.url());
});

server.post('/', async (req: Request, res: Response) => {
  const data = req.body
  if (data && Object.keys(data).length > 0) {
    const deviceID = Object.keys(data)[0]
    const rotation = Number(data[deviceID])

    if (!deviceID || isNaN(rotation)) {
      res.status(400).json({ message: '無效的 deviceID 或 rotation' })
    }

    try {
      await prisma.userData.upsert({
        where: { id: deviceID },
        update: { Rotation: rotation },
        create: { id: deviceID, Rotation: rotation },
      })
      res.status(200).json({ message: '成功接收與更新資料' })
    } catch (error) {
      console.error('資料庫寫入錯誤:', error)
      res.status(500).json({ message: '資料庫寫入失敗' })
    }
  } else {
    res.status(400).json({ message: '無效的資料格式' })
  }
})

function internalOnlyMiddleware(req: Request, res: Response, next: NextFunction) {
  const clientIp = req.ip
  const ngrokUrl: string = ngrokListener.url()!;
  if (clientIp?.startsWith(ngrokUrl)) {
    res.status(403).send('Forbidden');
  }
  next();
}


async function startNgrokAndApp(token: string) {
  try {
    expressServer = server.listen(3001, () => {
      console.log('Express已成功運行，網址為:http://localhost:3001');
    });
    ngrokListener = await ngrok.forward({
      addr: 3001,
      authtoken: token
    });
    try {
      await createWindow();
      tokenInputWondow?.close();
    } catch (error) {
      console.error('啟動主視窗錯誤:', error);
    }
  } catch (error) {
    console.error('Ngrok 啟動錯誤:', error);
  }
}

async function showTokenInputWindow() {
  await prisma.userData.deleteMany();
  tokenInputWondow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    icon: path.join(__dirname, '../public/favicon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: preload,
    }
  });

  if (app.isPackaged) {
    tokenInputWondow.loadFile(path.join(distPath, 'ngrokTokenPage.html'))
  } else {
    tokenInputWondow.loadFile(path.join('./public/ngrokTokenPage.html'))
  }
}

async function createWindow() {
  win = new BrowserWindow({
    width: 1300,
    height: 800,
    icon: path.join(__dirname, '../public/favicon.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: preload,
    }
  });

  if (app.isPackaged) {
    win.loadFile(path.join(distPath, 'index.html'))
  } else {
    win.loadURL(process.env.VITE_DEV_SERVER_URL!)
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.on('window-all-closed', () => {
  ngrokListener?.close();
})

function setupIpcHandlers() {
  ipcMain.handle('sendToken', async (event, token: string) => {
    try {
      await startNgrokAndApp(token);
      console.log("開始啟動Ngrok")
    } catch (e) {
      console.error('啟動 Ngrok 錯誤:', e)
    }
  })
}

if (release().startsWith('6.1')) app.disableHardwareAcceleration()
if (process.platform === 'win32') app.setAppUserModelId(app.getName())
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.whenReady().then(() => {
  setupIpcHandlers();
  showTokenInputWindow();
})
