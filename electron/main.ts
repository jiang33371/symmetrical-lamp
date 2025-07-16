import { app, BrowserWindow, Menu, shell, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { promises as fs } from 'fs'

const isDev = process.env.NODE_ENV === 'development'

class App {
  private mainWindow: BrowserWindow | null = null

  constructor() {
    this.setupApp()
  }

  private setupApp(): void {
    // 应用准备就绪时创建窗口
    app.whenReady().then(() => {
      this.createWindow()
      this.setupMenu()
      this.setupIPC()
    })

    // 所有窗口关闭时退出应用 (macOS 除外)
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    // macOS 激活应用时重新创建窗口
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow()
      }
    })
  }

  private createWindow(): void {
    // 创建主窗口
    this.mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 800,
      minHeight: 600,
      show: false,
      titleBarStyle: 'hiddenInset', // 隐藏标题栏，保持原生感觉
      titleBarOverlay: {
        color: '#00000000',
        symbolColor: '#74b9ff',
        height: 30
      },
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: join(__dirname, 'preload.js'),
        webSecurity: !isDev
      },
      vibrancy: 'under-window', // macOS 磨砂玻璃效果
      backgroundMaterial: 'mica' // Windows 11 Mica 效果
    })

    // 窗口准备显示时才显示，避免闪烁
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show()
      
      if (isDev) {
        this.mainWindow?.webContents.openDevTools()
      }
    })

    // 加载应用
    if (isDev) {
      this.mainWindow.loadURL('http://127.0.0.1:5173')
    } else {
      this.mainWindow.loadFile(join(__dirname, '../react/index.html'))
    }

    // 防止新窗口弹出
    this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url)
      return { action: 'deny' }
    })
  }

  private setupMenu(): void {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'Bear Markdown',
        submenu: [
          { role: 'about', label: '关于 Bear Markdown' },
          { type: 'separator' },
          { role: 'services', label: '服务' },
          { type: 'separator' },
          { role: 'hide', label: '隐藏 Bear Markdown' },
          { role: 'hideOthers', label: '隐藏其他' },
          { role: 'unhide', label: '显示全部' },
          { type: 'separator' },
          { role: 'quit', label: '退出 Bear Markdown' }
        ]
      },
      {
        label: '文件',
        submenu: [
          {
            label: '新建笔记',
            accelerator: 'CmdOrCtrl+N',
            click: () => {
              this.mainWindow?.webContents.send('menu-new-note')
            }
          },
          {
            label: '保存',
            accelerator: 'CmdOrCtrl+S',
            click: () => {
              this.mainWindow?.webContents.send('menu-save')
            }
          },
          { type: 'separator' },
          {
            label: '导出...',
            accelerator: 'CmdOrCtrl+E',
            click: () => {
              this.mainWindow?.webContents.send('menu-export')
            }
          }
        ]
      },
      {
        label: '编辑',
        submenu: [
          { role: 'undo', label: '撤销' },
          { role: 'redo', label: '重做' },
          { type: 'separator' },
          { role: 'cut', label: '剪切' },
          { role: 'copy', label: '复制' },
          { role: 'paste', label: '粘贴' },
          { role: 'selectAll', label: '全选' }
        ]
      },
      {
        label: '视图',
        submenu: [
          {
            label: '切换主题',
            accelerator: 'CmdOrCtrl+T',
            click: () => {
              this.mainWindow?.webContents.send('menu-toggle-theme')
            }
          },
          {
            label: '切换预览',
            accelerator: 'CmdOrCtrl+P',
            click: () => {
              this.mainWindow?.webContents.send('menu-toggle-preview')
            }
          },
          { type: 'separator' },
          { role: 'reload', label: '重新加载' },
          { role: 'forceReload', label: '强制重新加载' },
          { role: 'toggleDevTools', label: '开发者工具' },
          { type: 'separator' },
          { role: 'resetZoom', label: '实际大小' },
          { role: 'zoomIn', label: '放大' },
          { role: 'zoomOut', label: '缩小' },
          { type: 'separator' },
          { role: 'togglefullscreen', label: '切换全屏' }
        ]
      },
      {
        label: '窗口',
        submenu: [
          { role: 'minimize', label: '最小化' },
          { role: 'close', label: '关闭' }
        ]
      }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  }

  private setupIPC(): void {
    // 文件操作
    ipcMain.handle('save-file', async (_, content: string, filePath?: string) => {
      try {
        if (filePath) {
          await fs.writeFile(filePath, content, 'utf-8')
          return { success: true, filePath }
        } else {
          const { canceled, filePath: selectedPath } = await dialog.showSaveDialog(this.mainWindow!, {
            defaultPath: 'untitled.md',
            filters: [
              { name: 'Markdown Files', extensions: ['md', 'markdown'] },
              { name: 'All Files', extensions: ['*'] }
            ]
          })
          
          if (!canceled && selectedPath) {
            await fs.writeFile(selectedPath, content, 'utf-8')
            return { success: true, filePath: selectedPath }
          }
        }
        return { success: false }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('open-file', async () => {
      try {
        const { canceled, filePaths } = await dialog.showOpenDialog(this.mainWindow!, {
          properties: ['openFile'],
          filters: [
            { name: 'Markdown Files', extensions: ['md', 'markdown'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        })
        
        if (!canceled && filePaths.length > 0) {
          const content = await fs.readFile(filePaths[0], 'utf-8')
          return { success: true, content, filePath: filePaths[0] }
        }
        return { success: false }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('export-file', async (_, content: string, format: string) => {
      try {
        const extensions = {
          'pdf': ['pdf'],
          'html': ['html'],
          'md': ['md']
        }
        
        const { canceled, filePath } = await dialog.showSaveDialog(this.mainWindow!, {
          defaultPath: `export.${format}`,
          filters: [
            { name: `${format.toUpperCase()} Files`, extensions: extensions[format] || ['*'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        })
        
        if (!canceled && filePath) {
          await fs.writeFile(filePath, content, 'utf-8')
          return { success: true, filePath }
        }
        return { success: false }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })
  }
}

new App()