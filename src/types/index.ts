// 全局类型定义
declare global {
  interface Window {
    electronAPI: {
      saveFile: (content: string, filePath?: string) => Promise<{ success: boolean; filePath?: string; error?: string }>
      openFile: () => Promise<{ success: boolean; content?: string; filePath?: string; error?: string }>
      exportFile: (content: string, format: string) => Promise<{ success: boolean; filePath?: string; error?: string }>
      onMenuAction: (callback: (action: string) => void) => void
      removeAllListeners: () => void
    }
  }
}

// 主题类型
export type Theme = 'mica-white' | 'night-oled'

// 笔记类型
export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  filePath?: string
}

// 标签类型
export interface Tag {
  name: string
  color: string
  noteCount: number
}

// 编辑器模式
export type EditorMode = 'edit' | 'preview' | 'split'

// 应用状态
export interface AppState {
  theme: Theme
  currentNote: Note | null
  notes: Note[]
  tags: Tag[]
  selectedTags: string[]
  editorMode: EditorMode
  sidebarWidth: number
  isLoading: boolean
}

// 编辑器配置
export interface EditorConfig {
  fontSize: number
  lineHeight: number
  tabSize: number
  wordWrap: boolean
  minimap: boolean
  lineNumbers: boolean
}

// 文件操作结果
export interface FileOperationResult {
  success: boolean
  filePath?: string
  error?: string
}

// 导出格式
export type ExportFormat = 'pdf' | 'html' | 'md'

export {}