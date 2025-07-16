import { contextBridge, ipcRenderer } from 'electron'

// 定义暴露给渲染进程的 API
const electronAPI = {
  // 文件操作
  saveFile: (content: string, filePath?: string) => 
    ipcRenderer.invoke('save-file', content, filePath),
  
  openFile: () => 
    ipcRenderer.invoke('open-file'),
  
  exportFile: (content: string, format: string) => 
    ipcRenderer.invoke('export-file', content, format),

  // 菜单事件监听
  onMenuAction: (callback: (action: string) => void) => {
    const actions = [
      'menu-new-note',
      'menu-save', 
      'menu-export',
      'menu-toggle-theme',
      'menu-toggle-preview'
    ]
    
    actions.forEach(action => {
      ipcRenderer.on(action, () => callback(action))
    })
  },

  // 移除监听器
  removeAllListeners: () => {
    const actions = [
      'menu-new-note',
      'menu-save',
      'menu-export', 
      'menu-toggle-theme',
      'menu-toggle-preview'
    ]
    
    actions.forEach(action => {
      ipcRenderer.removeAllListeners(action)
    })
  }
}

// 通过 contextBridge 安全地暴露 API
contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// 类型定义
export type ElectronAPI = typeof electronAPI