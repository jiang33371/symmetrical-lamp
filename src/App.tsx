import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useTheme } from './contexts/ThemeContext'
import { useApp } from './contexts/AppContext'
import Sidebar from './components/Sidebar/Sidebar'
import Editor from './components/Editor/Editor'
import Preview from './components/Preview/Preview'
import TopBar from './components/TopBar/TopBar'
import StatusBar from './components/StatusBar/StatusBar'
import { GlobalStyle } from './styles/GlobalStyle'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
`

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`

const EditorArea = styled.div<{ $showPreview: boolean }>`
  display: flex;
  flex: 1;
  overflow: hidden;
  
  ${props => props.$showPreview && `
    & > *:first-child {
      flex: 1;
      border-right: 1px solid var(--border-color);
    }
    
    & > *:last-child {
      flex: 1;
    }
  `}
`

function App() {
  const { theme } = useTheme()
  const { showPreview, isLoading } = useApp()

  useEffect(() => {
    // 监听菜单事件
    if (window.electronAPI) {
      const handleMenuEvent = (event: string) => {
        console.log('Menu event:', event)
        // 这里可以添加菜单事件处理逻辑
      }

      window.electronAPI.onMenuEvent?.(handleMenuEvent)
    }
  }, [])

  if (isLoading) {
    return (
      <AppContainer>
        <GlobalStyle />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: 'var(--text-secondary)'
        }}>
          加载中...
        </div>
      </AppContainer>
    )
  }

  return (
    <AppContainer>
      <GlobalStyle />
      <TopBar />
      <MainContent>
        <Sidebar />
        <EditorArea $showPreview={showPreview}>
          <Editor />
          {showPreview && <Preview />}
        </EditorArea>
      </MainContent>
      <StatusBar />
    </AppContainer>
  )
}

export default App