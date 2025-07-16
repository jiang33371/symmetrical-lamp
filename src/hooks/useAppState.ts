import { useState, useCallback, useEffect } from 'react'
import { Note, Tag, EditorMode, AppState } from '@/types'

const APP_STATE_STORAGE_KEY = 'bear-markdown-app-state'

// 生成唯一ID
const generateId = () => Math.random().toString(36).substr(2, 9)

// 创建新笔记
const createNewNote = (): Note => ({
  id: generateId(),
  title: '无标题笔记',
  content: '',
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// 默认标签
const defaultTags: Tag[] = [
  { name: '全部', color: '#007AFF', noteCount: 0 },
  { name: '工作', color: '#34C759', noteCount: 0 },
  { name: '个人', color: '#FF9500', noteCount: 0 },
  { name: '想法', color: '#FF3B30', noteCount: 0 }
]

export const useAppState = () => {
  // 应用状态
  const [appState, setAppState] = useState<AppState>(() => {
    const savedState = localStorage.getItem(APP_STATE_STORAGE_KEY)
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        return {
          ...parsed,
          notes: parsed.notes?.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt)
          })) || []
        }
      } catch {
        // 如果解析失败，使用默认状态
      }
    }
    
    // 默认状态
    const defaultNote = createNewNote()
    return {
      theme: 'mica-white',
      currentNote: defaultNote,
      notes: [defaultNote],
      tags: defaultTags,
      selectedTags: [],
      editorMode: 'edit' as EditorMode,
      sidebarWidth: 300,
      isLoading: false
    }
  })

  // 保存状态到 localStorage
  const saveState = useCallback((state: AppState) => {
    localStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(state))
  }, [])

  // 更新状态的通用方法
  const updateAppState = useCallback((updates: Partial<AppState>) => {
    setAppState(prev => {
      const newState = { ...prev, ...updates }
      saveState(newState)
      return newState
    })
  }, [saveState])

  // 创建新笔记
  const createNote = useCallback(() => {
    const newNote = createNewNote()
    updateAppState({
      notes: [...appState.notes, newNote],
      currentNote: newNote
    })
    return newNote
  }, [appState.notes, updateAppState])

  // 更新当前笔记
  const updateCurrentNote = useCallback((updates: Partial<Note>) => {
    if (!appState.currentNote) return

    const updatedNote = {
      ...appState.currentNote,
      ...updates,
      updatedAt: new Date()
    }

    // 从标题推断笔记标题
    if (updates.content !== undefined) {
      const firstLine = updates.content.split('\n')[0]
      if (firstLine.startsWith('#')) {
        updatedNote.title = firstLine.replace(/^#+\s*/, '').trim() || '无标题笔记'
      } else if (firstLine.trim()) {
        updatedNote.title = firstLine.trim().substring(0, 50) || '无标题笔记'
      }
    }

    const updatedNotes = appState.notes.map(note => 
      note.id === appState.currentNote!.id ? updatedNote : note
    )

    updateAppState({
      currentNote: updatedNote,
      notes: updatedNotes
    })
  }, [appState.currentNote, appState.notes, updateAppState])

  // 删除笔记
  const deleteNote = useCallback((noteId: string) => {
    const filteredNotes = appState.notes.filter(note => note.id !== noteId)
    
    // 如果删除的是当前笔记，选择下一个笔记
    let newCurrentNote = appState.currentNote
    if (appState.currentNote?.id === noteId) {
      newCurrentNote = filteredNotes.length > 0 ? filteredNotes[0] : createNewNote()
      if (filteredNotes.length === 0) {
        filteredNotes.push(newCurrentNote)
      }
    }

    updateAppState({
      notes: filteredNotes,
      currentNote: newCurrentNote
    })
  }, [appState.notes, appState.currentNote, updateAppState])

  // 选择笔记
  const selectNote = useCallback((noteId: string) => {
    const note = appState.notes.find(n => n.id === noteId)
    if (note) {
      updateAppState({ currentNote: note })
    }
  }, [appState.notes, updateAppState])

  // 添加标签到笔记
  const addTagToNote = useCallback((noteId: string, tagName: string) => {
    const updatedNotes = appState.notes.map(note => {
      if (note.id === noteId && !note.tags.includes(tagName)) {
        return { ...note, tags: [...note.tags, tagName], updatedAt: new Date() }
      }
      return note
    })

    const updatedCurrentNote = appState.currentNote?.id === noteId 
      ? updatedNotes.find(n => n.id === noteId) || appState.currentNote
      : appState.currentNote

    updateAppState({
      notes: updatedNotes,
      currentNote: updatedCurrentNote
    })
  }, [appState.notes, appState.currentNote, updateAppState])

  // 从笔记移除标签
  const removeTagFromNote = useCallback((noteId: string, tagName: string) => {
    const updatedNotes = appState.notes.map(note => {
      if (note.id === noteId) {
        return { 
          ...note, 
          tags: note.tags.filter(tag => tag !== tagName),
          updatedAt: new Date()
        }
      }
      return note
    })

    const updatedCurrentNote = appState.currentNote?.id === noteId 
      ? updatedNotes.find(n => n.id === noteId) || appState.currentNote
      : appState.currentNote

    updateAppState({
      notes: updatedNotes,
      currentNote: updatedCurrentNote
    })
  }, [appState.notes, appState.currentNote, updateAppState])

  // 设置选中的标签（用于过滤）
  const setSelectedTags = useCallback((tags: string[]) => {
    updateAppState({ selectedTags: tags })
  }, [updateAppState])

  // 设置编辑器模式
  const setEditorMode = useCallback((mode: EditorMode) => {
    updateAppState({ editorMode: mode })
  }, [updateAppState])

  // 设置侧边栏宽度
  const setSidebarWidth = useCallback((width: number) => {
    updateAppState({ sidebarWidth: width })
  }, [updateAppState])

  // 获取过滤后的笔记
  const getFilteredNotes = useCallback(() => {
    if (appState.selectedTags.length === 0 || appState.selectedTags.includes('全部')) {
      return appState.notes
    }
    
    return appState.notes.filter(note => 
      appState.selectedTags.some(selectedTag => note.tags.includes(selectedTag))
    )
  }, [appState.notes, appState.selectedTags])

  // 更新标签计数
  useEffect(() => {
    const updatedTags = appState.tags.map(tag => {
      if (tag.name === '全部') {
        return { ...tag, noteCount: appState.notes.length }
      }
      const count = appState.notes.filter(note => note.tags.includes(tag.name)).length
      return { ...tag, noteCount: count }
    })

    if (JSON.stringify(updatedTags) !== JSON.stringify(appState.tags)) {
      updateAppState({ tags: updatedTags })
    }
  }, [appState.notes, appState.tags, updateAppState])

  return {
    // 状态
    ...appState,
    
    // 方法
    createNote,
    updateCurrentNote,
    deleteNote,
    selectNote,
    addTagToNote,
    removeTagFromNote,
    setSelectedTags,
    setEditorMode,
    setSidebarWidth,
    getFilteredNotes,
    updateAppState
  }
}