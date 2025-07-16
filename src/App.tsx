import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useTheme } from '@/hooks/useTheme'
import { useAppState } from '@/hooks/useAppState'
import { useHotkeys } from 'react-hotkeys-hook'
import Sidebar from '@/components/Sidebar'
import Editor from '@/components/Editor'
import Preview from '@/components/Preview'
import Toolbar from '@/components/Toolbar'
import CommandPalette from '@/components/CommandPalette'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background: var(--color-background);
  color: var(--color-foreground);
  overflow: hidden;
`

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`

const EditorArea = styled.div<{ mode: string }>`
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden;
`

const ResizeHandle = styled.div`
  width: 4px;
  background: transparent;
  cursor: col-resize;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: var(--color-border);
  }
  
  &::after {
    content: '';
    width: 1px;
    height: 32px;
    background: var(--color-border-light);
  }
`

function App() {
  const { theme, toggleTheme } = useTheme()
  const appState = useAppState()
  const [showCommandPalette, setShowCommandPalette] = React.useState(false)
  const [isResizing, setIsResizing] = React.useState(false)

  // 快捷键绑定
  useHotkeys('cmd+n, ctrl+n', () => appState.createNote(), [appState])
  useHotkeys('cmd+s, ctrl+s', handleSave, [appState])
  useHotkeys('cmd+t, ctrl+t', toggleTheme, [toggleTheme])
  useHotkeys('cmd+p, ctrl+p', togglePreview, [appState])
  useHotkeys('cmd+shift+p, ctrl+shift+p', () => setShowCommandPalette(true), [])
  useHotkeys('escape', () => setShowCommandPalette(false), [])
  useHotkeys('cmd+e, ctrl+e', handleExport, [appState])

  // 处理保存
  async function handleSave() {
    if (!appState.currentNote) return
    
    try {
      const result = await window.electronAPI?.saveFile(
        appState.currentNote.content,
        appState.currentNote.filePath
      )
      
      if (result?.success) {
        appState.updateCurrentNote({ filePath: result.filePath })
        console.log('笔记已保存')
      }
    } catch (error) {
      console.error('保存失败:', error)
    }
  }

  // 切换预览模式
  function togglePreview() {
    const modes = ['edit', 'split', 'preview']
    const currentIndex = modes.indexOf(appState.editorMode)
    const nextIndex = (currentIndex + 1) % modes.length
    appState.setEditorMode(modes[nextIndex] as any)
  }

  // 处理导出
  async function handleExport() {
    if (!appState.currentNote) return
    
    try {
      const result = await window.electronAPI?.exportFile(
        appState.currentNote.content,
        'md'
      )
      
      if (result?.success) {
        console.log('导出成功')
      }
    } catch (error) {
      console.error('导出失败:', error)
    }
  }

  // 监听 Electron 菜单事件
  useEffect(() => {
    if (!window.electronAPI) return

    window.electronAPI.onMenuAction((action: string) => {
      switch (action) {
        case 'menu-new-note':
          appState.createNote()
          break
        case 'menu-save':
          handleSave()
          break
        case 'menu-export':
          handleExport()
          break
        case 'menu-toggle-theme':
          toggleTheme()
          break
        case 'menu-toggle-preview':
          togglePreview()
          break
      }
    })

    return () => {
      window.electronAPI?.removeAllListeners()
    }
  }, [appState, toggleTheme])

  // 处理侧边栏调整大小
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(200, Math.min(500, e.clientX))
      appState.setSidebarWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, appState])

  return (
    <AppContainer className="fade-in">
      <Toolbar 
        theme={theme}
        onToggleTheme={toggleTheme}
        editorMode={appState.editorMode}
        onSetEditorMode={appState.setEditorMode}
        onSave={handleSave}
        onExport={handleExport}
        onNewNote={appState.createNote}
      />
      
      <MainContent>
        <Sidebar 
          width={appState.sidebarWidth}
          notes={appState.getFilteredNotes()}
          tags={appState.tags}
          selectedTags={appState.selectedTags}
          currentNote={appState.currentNote}
          onSelectNote={appState.selectNote}
          onDeleteNote={appState.deleteNote}
          onSelectTags={appState.setSelectedTags}
          onAddTag={appState.addTagToNote}
          onRemoveTag={appState.removeTagFromNote}
        />
        
        <ResizeHandle 
          onMouseDown={handleMouseDown}
          style={{ cursor: isResizing ? 'col-resize' : 'default' }}
        />
        
        <EditorArea mode={appState.editorMode}>
          {(appState.editorMode === 'edit' || appState.editorMode === 'split') && (
            <Editor
              note={appState.currentNote}
              onUpdateNote={appState.updateCurrentNote}
              isVisible={appState.editorMode !== 'preview'}
              width={appState.editorMode === 'split' ? '50%' : '100%'}
            />
          )}
          
          {(appState.editorMode === 'preview' || appState.editorMode === 'split') && (
            <Preview
              content={appState.currentNote?.content || ''}
              isVisible={appState.editorMode !== 'edit'}
              width={appState.editorMode === 'split' ? '50%' : '100%'}
            />
          )}
        </EditorArea>
      </MainContent>

      {showCommandPalette && (
        <CommandPalette
          onClose={() => setShowCommandPalette(false)}
          onAction={(action) => {
            switch (action) {
              case 'new-note':
                appState.createNote()
                break
              case 'save':
                handleSave()
                break
              case 'export':
                handleExport()
                break
              case 'toggle-theme':
                toggleTheme()
                break
              case 'toggle-preview':
                togglePreview()
                break
            }
            setShowCommandPalette(false)
          }}
        />
      )}
    </AppContainer>
  )
}

export default App