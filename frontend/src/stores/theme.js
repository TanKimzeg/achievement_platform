import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDarkMode = ref(false)
  
  // 从localStorage加载主题设置
  const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDarkMode.value = savedTheme === 'dark'
    } else {
      // 检查系统主题偏好
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }
  
  // 切换主题
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    applyTheme()
    saveTheme()
  }
  
  // 设置主题
  const setTheme = (dark) => {
    isDarkMode.value = dark
    applyTheme()
    saveTheme()
  }
  
  // 应用主题到document
  const applyTheme = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark-mode')
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark-mode')
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }
  
  // 保存主题设置
  const saveTheme = () => {
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  }
  
  // 监听系统主题变化
  const watchSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        isDarkMode.value = e.matches
        applyTheme()
      }
    })
  }
  
  // 初始化
  const init = () => {
    loadTheme()
    watchSystemTheme()
  }
  
  return {
    isDarkMode,
    toggleTheme,
    setTheme,
    init
  }
})