import React from 'react'
import styled from 'styled-components'
import { Theme, EditorMode } from '@/types'
import { 
  Sun, 
  Moon, 
  Edit3, 
  Eye, 
  Columns, 
  Save, 
  Download,
  Plus,
  Command
} from 'lucide-react'

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--color-background-secondary);
  border-bottom: 1px solid var(--color-border);
  min-height: 48px;
  user-select: none;
  -webkit-app-region: drag; /* 允许拖拽窗口 */
`

const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  -webkit-app-region: no-drag; /* 按钮区域不可拖拽 */
`

const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--color-foreground-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-hover);
    color: var(--color-foreground);
  }
  
  &.active {
    background: var(--color-accent);
    color: white;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`

const ToolbarDivider = styled.div`
  width: 1px;
  height: 20px;
  background: var(--color-border);
  margin: 0 4px;
`

const AppTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-foreground);
  user-select: none;
`

interface ToolbarProps {
  theme: Theme
  onToggleTheme: () => void
  editorMode: EditorMode
  onSetEditorMode: (mode: EditorMode) => void
  onSave: () => void
  onExport: () => void
  onNewNote: () => void
}

const Toolbar: React.FC<ToolbarProps> = ({
  theme,
  onToggleTheme,
  editorMode,
  onSetEditorMode,
  onSave,
  onExport,
  onNewNote
}) => {
  return (
    <ToolbarContainer>
      <ToolbarSection>
        <AppTitle>Bear Markdown</AppTitle>
      </ToolbarSection>
      
      <ToolbarSection>
        {/* 文件操作 */}
        <ToolbarButton 
          onClick={onNewNote}
          className="tooltip"
          data-tooltip="新建笔记 (Ctrl+N)"
        >
          <Plus />
        </ToolbarButton>
        
        <ToolbarButton 
          onClick={onSave}
          className="tooltip"
          data-tooltip="保存 (Ctrl+S)"
        >
          <Save />
        </ToolbarButton>
        
        <ToolbarButton 
          onClick={onExport}
          className="tooltip"
          data-tooltip="导出 (Ctrl+E)"
        >
          <Download />
        </ToolbarButton>
        
        <ToolbarDivider />
        
        {/* 编辑器模式 */}
        <ToolbarButton 
          onClick={() => onSetEditorMode('edit')}
          className={`tooltip ${editorMode === 'edit' ? 'active' : ''}`}
          data-tooltip="编辑模式"
        >
          <Edit3 />
        </ToolbarButton>
        
        <ToolbarButton 
          onClick={() => onSetEditorMode('split')}
          className={`tooltip ${editorMode === 'split' ? 'active' : ''}`}
          data-tooltip="分屏模式"
        >
          <Columns />
        </ToolbarButton>
        
        <ToolbarButton 
          onClick={() => onSetEditorMode('preview')}
          className={`tooltip ${editorMode === 'preview' ? 'active' : ''}`}
          data-tooltip="预览模式"
        >
          <Eye />
        </ToolbarButton>
        
        <ToolbarDivider />
        
        {/* 主题切换 */}
        <ToolbarButton 
          onClick={onToggleTheme}
          className="tooltip"
          data-tooltip={`切换到${theme === 'mica-white' ? '深色' : '云母白'}主题 (Ctrl+T)`}
        >
          {theme === 'mica-white' ? <Moon /> : <Sun />}
        </ToolbarButton>
      </ToolbarSection>
      
      <ToolbarSection>
        {/* 命令面板提示 */}
        <ToolbarButton 
          className="tooltip"
          data-tooltip="命令面板 (Ctrl+Shift+P)"
        >
          <Command />
        </ToolbarButton>
      </ToolbarSection>
    </ToolbarContainer>
  )
}

export default Toolbar