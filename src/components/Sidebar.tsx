import React, { useState } from 'react'
import styled from 'styled-components'
import { Note, Tag } from '@/types'
import { Search, Hash, Calendar, Trash2, Plus } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const SidebarContainer = styled.div<{ width: number }>`
  width: ${props => props.width}px;
  background: var(--color-background-secondary);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  user-select: none;
`

const SearchSection = styled.div`
  padding: 16px;
  border-bottom: 1px solid var(--color-border-light);
`

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  padding-left: 36px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-foreground);
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-secondary);
  }
  
  &::placeholder {
    color: var(--color-foreground-tertiary);
  }
`

const SearchInputWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: var(--color-foreground-tertiary);
  }
`

const TagsSection = styled.div`
  padding: 16px;
  border-bottom: 1px solid var(--color-border-light);
`

const SectionTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-foreground-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

const TagItem = styled.button<{ active: boolean; color: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  background: ${props => props.active ? 'var(--color-accent)' : 'var(--color-background-tertiary)'};
  color: ${props => props.active ? 'white' : 'var(--color-foreground-secondary)'};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? 'var(--color-accent)' : 'var(--color-hover)'};
  }
  
  svg {
    width: 12px;
    height: 12px;
  }
  
  .count {
    background: ${props => props.active ? 'rgba(255,255,255,0.2)' : 'var(--color-background)'};
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    margin-left: 4px;
  }
`

const NotesSection = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const NotesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--color-border-light);
`

const NotesList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
`

const NoteItem = styled.div<{ active: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  background: ${props => props.active ? 'var(--color-accent-secondary)' : 'transparent'};
  border-left-color: ${props => props.active ? 'var(--color-accent)' : 'transparent'};
  
  &:hover {
    background: var(--color-hover);
  }
`

const NoteTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: var(--color-foreground);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const NotePreview = styled.div`
  font-size: 12px;
  color: var(--color-foreground-tertiary);
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const NoteMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--color-foreground-tertiary);
`

const NoteActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${NoteItem}:hover & {
    opacity: 1;
  }
`

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--color-foreground-tertiary);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-hover);
    color: var(--color-foreground);
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`

const NewNoteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: var(--color-accent);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`

interface SidebarProps {
  width: number
  notes: Note[]
  tags: Tag[]
  selectedTags: string[]
  currentNote: Note | null
  onSelectNote: (noteId: string) => void
  onDeleteNote: (noteId: string) => void
  onSelectTags: (tags: string[]) => void
  onAddTag: (noteId: string, tagName: string) => void
  onRemoveTag: (noteId: string, tagName: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({
  width,
  notes,
  tags,
  selectedTags,
  currentNote,
  onSelectNote,
  onDeleteNote,
  onSelectTags,
  onAddTag,
  onRemoveTag
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  // 过滤笔记
  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchQuery || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch
  })

  // 处理标签点击
  const handleTagClick = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onSelectTags(selectedTags.filter(t => t !== tagName))
    } else {
      onSelectTags([...selectedTags, tagName])
    }
  }

  // 格式化时间
  const formatTime = (date: Date) => {
    try {
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: zhCN 
      })
    } catch {
      return '刚刚'
    }
  }

  // 获取笔记预览
  const getNotePreview = (note: Note) => {
    const content = note.content.replace(/#+\s*/g, '').replace(/\*\*/g, '').trim()
    return content.substring(0, 60) || '无内容'
  }

  return (
    <SidebarContainer width={width} className="slide-in-left">
      <SearchSection>
        <SearchInputWrapper>
          <Search />
          <SearchInput
            type="text"
            placeholder="搜索笔记..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchInputWrapper>
      </SearchSection>

      <TagsSection>
        <SectionTitle>标签</SectionTitle>
        <TagsList>
          {tags.map(tag => (
            <TagItem
              key={tag.name}
              active={selectedTags.includes(tag.name)}
              color={tag.color}
              onClick={() => handleTagClick(tag.name)}
            >
              <Hash />
              {tag.name}
              <span className="count">{tag.noteCount}</span>
            </TagItem>
          ))}
        </TagsList>
      </TagsSection>

      <NotesSection>
        <NotesHeader>
          <SectionTitle style={{ margin: 0 }}>
            笔记 ({filteredNotes.length})
          </SectionTitle>
          <NewNoteButton 
            className="tooltip"
            data-tooltip="新建笔记"
            onClick={() => {
              // 这里会触发新建笔记，由父组件处理
              const event = new CustomEvent('create-note')
              window.dispatchEvent(event)
            }}
          >
            <Plus />
          </NewNoteButton>
        </NotesHeader>

        <NotesList>
          {filteredNotes.map(note => (
            <NoteItem
              key={note.id}
              active={currentNote?.id === note.id}
              onClick={() => onSelectNote(note.id)}
            >
              <NoteTitle>{note.title}</NoteTitle>
              <NotePreview>{getNotePreview(note)}</NotePreview>
              <NoteMeta>
                <Calendar />
                {formatTime(note.updatedAt)}
                <NoteActions onClick={(e) => e.stopPropagation()}>
                  <ActionButton
                    onClick={() => onDeleteNote(note.id)}
                    className="tooltip"
                    data-tooltip="删除笔记"
                  >
                    <Trash2 />
                  </ActionButton>
                </NoteActions>
              </NoteMeta>
            </NoteItem>
          ))}
          
          {filteredNotes.length === 0 && (
            <div style={{ 
              padding: '40px 16px', 
              textAlign: 'center', 
              color: 'var(--color-foreground-tertiary)' 
            }}>
              {searchQuery ? '未找到匹配的笔记' : '暂无笔记'}
            </div>
          )}
        </NotesList>
      </NotesSection>
    </SidebarContainer>
  )
}

export default Sidebar