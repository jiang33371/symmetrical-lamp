import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 移除加载动画
const removeLoading = () => {
  const loading = document.querySelector('.loading')
  if (loading) {
    loading.remove()
  }
}

// 渲染应用
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// 应用加载完成后移除加载动画
setTimeout(removeLoading, 100)