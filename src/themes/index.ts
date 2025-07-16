import { Theme } from '@/types'

// 主题颜色接口
export interface ThemeColors {
  // 背景色
  background: string
  backgroundSecondary: string
  backgroundTertiary: string
  
  // 前景色
  foreground: string
  foregroundSecondary: string
  foregroundTertiary: string
  
  // 强调色
  accent: string
  accentSecondary: string
  
  // 边框色
  border: string
  borderLight: string
  
  // 状态色
  success: string
  warning: string
  error: string
  info: string
  
  // 特殊色
  selection: string
  hover: string
  active: string
  shadow: string
  
  // Markdown 语法高亮
  syntax: {
    text: string
    comment: string
    keyword: string
    string: string
    number: string
    operator: string
    link: string
    header: string
    code: string
    quote: string
  }
}

// 云母白主题 (Mica-White)
export const micaWhiteTheme: ThemeColors = {
  // 背景色 - 云母质感的半透明白色
  background: 'rgba(252, 252, 252, 0.85)',
  backgroundSecondary: 'rgba(248, 248, 248, 0.95)',
  backgroundTertiary: 'rgba(244, 244, 244, 0.90)',
  
  // 前景色 - 高对比度文本
  foreground: '#1a1a1a',
  foregroundSecondary: '#4a4a4a',
  foregroundTertiary: '#8a8a8a',
  
  // 强调色 - 温暖的蓝色
  accent: '#007AFF',
  accentSecondary: 'rgba(0, 122, 255, 0.1)',
  
  // 边框色 - 极其轻微
  border: 'rgba(0, 0, 0, 0.08)',
  borderLight: 'rgba(0, 0, 0, 0.04)',
  
  // 状态色
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  
  // 特殊色
  selection: 'rgba(0, 122, 255, 0.15)',
  hover: 'rgba(0, 0, 0, 0.04)',
  active: 'rgba(0, 0, 0, 0.08)',
  shadow: 'rgba(0, 0, 0, 0.02)',
  
  // Markdown 语法高亮
  syntax: {
    text: '#1a1a1a',
    comment: '#8e8e93',
    keyword: '#ad3da4',
    string: '#d12f1b',
    number: '#272ad8',
    operator: '#ad3da4',
    link: '#0066cc',
    header: '#1a1a1a',
    code: '#af52de',
    quote: '#8e8e93'
  }
}

// 深色主题 (Night-OLED) 
export const nightOledTheme: ThemeColors = {
  // 背景色 - 纯黑 OLED 级别
  background: '#000000',
  backgroundSecondary: '#0a0a0a',
  backgroundTertiary: '#141414',
  
  // 前景色 - 高对比白色
  foreground: '#ffffff',
  foregroundSecondary: '#e5e5e7',
  foregroundTertiary: '#8e8e93',
  
  // 强调色 - 暖橙色
  accent: '#ff9f0a',
  accentSecondary: 'rgba(255, 159, 10, 0.15)',
  
  // 边框色
  border: 'rgba(255, 255, 255, 0.12)',
  borderLight: 'rgba(255, 255, 255, 0.06)',
  
  // 状态色
  success: '#30d158',
  warning: '#ff9f0a',
  error: '#ff453a',
  info: '#64d2ff',
  
  // 特殊色
  selection: 'rgba(255, 159, 10, 0.20)',
  hover: 'rgba(255, 255, 255, 0.06)',
  active: 'rgba(255, 255, 255, 0.12)',
  shadow: 'rgba(0, 0, 0, 0.5)',
  
  // Markdown 语法高亮
  syntax: {
    text: '#ffffff',
    comment: '#8e8e93',
    keyword: '#ff7ab2',
    string: '#fc6a5d',
    number: '#d0bf69',
    operator: '#ff7ab2',
    link: '#6699ff',
    header: '#ffffff',
    code: '#dabaff',
    quote: '#8e8e93'
  }
}

// 主题映射
export const themes: Record<Theme, ThemeColors> = {
  'mica-white': micaWhiteTheme,
  'night-oled': nightOledTheme
}

// 获取主题
export const getTheme = (theme: Theme): ThemeColors => themes[theme]

// CSS 变量生成器
export const generateCSSVariables = (theme: ThemeColors): Record<string, string> => {
  return {
    '--color-background': theme.background,
    '--color-background-secondary': theme.backgroundSecondary,
    '--color-background-tertiary': theme.backgroundTertiary,
    '--color-foreground': theme.foreground,
    '--color-foreground-secondary': theme.foregroundSecondary,
    '--color-foreground-tertiary': theme.foregroundTertiary,
    '--color-accent': theme.accent,
    '--color-accent-secondary': theme.accentSecondary,
    '--color-border': theme.border,
    '--color-border-light': theme.borderLight,
    '--color-success': theme.success,
    '--color-warning': theme.warning,
    '--color-error': theme.error,
    '--color-info': theme.info,
    '--color-selection': theme.selection,
    '--color-hover': theme.hover,
    '--color-active': theme.active,
    '--color-shadow': theme.shadow,
    '--syntax-text': theme.syntax.text,
    '--syntax-comment': theme.syntax.comment,
    '--syntax-keyword': theme.syntax.keyword,
    '--syntax-string': theme.syntax.string,
    '--syntax-number': theme.syntax.number,
    '--syntax-operator': theme.syntax.operator,
    '--syntax-link': theme.syntax.link,
    '--syntax-header': theme.syntax.header,
    '--syntax-code': theme.syntax.code,
    '--syntax-quote': theme.syntax.quote
  }
}