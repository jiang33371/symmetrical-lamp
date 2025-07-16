import { useState, useEffect, useCallback } from 'react'
import { Theme } from '@/types'
import { getTheme, generateCSSVariables } from '@/themes'

const THEME_STORAGE_KEY = 'bear-markdown-theme'

export const useTheme = () => {
  // 从 localStorage 获取保存的主题，默认为云母白主题
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    return (savedTheme as Theme) || 'mica-white'
  })

  // 应用主题到 DOM
  const applyTheme = useCallback((themeName: Theme) => {
    const themeColors = getTheme(themeName)
    const cssVariables = generateCSSVariables(themeColors)
    
    const root = document.documentElement
    
    // 应用 CSS 变量
    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
    
    // 设置 body 的背景色和字体色
    document.body.style.backgroundColor = themeColors.background
    document.body.style.color = themeColors.foreground
    
    // 添加主题类名
    document.body.className = document.body.className.replace(
      /theme-[\w-]+/g, 
      ''
    ).trim()
    document.body.classList.add(`theme-${themeName}`)
    
    // 平滑过渡
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease'
    
  }, [])

  // 切换主题
  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === 'mica-white' ? 'night-oled' : 'mica-white'
    setTheme(newTheme)
  }, [theme])

  // 设置特定主题
  const changeTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme)
  }, [])

  // 当主题改变时，应用到 DOM 并保存到 localStorage
  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme, applyTheme])

  // 初始化时应用主题
  useEffect(() => {
    applyTheme(theme)
  }, [])

  return {
    theme,
    toggleTheme,
    changeTheme,
    themeColors: getTheme(theme),
    isDark: theme === 'night-oled'
  }
}