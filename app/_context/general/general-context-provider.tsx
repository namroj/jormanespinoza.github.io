'use client'

import React, { FC, createContext, useContext, useEffect, useMemo, useState } from 'react'

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum SidebarState {
  COLLAPSED = 'collapsed',
  EXPANDED = 'expanded',
}

type GeneralContextType = {
  theme: Theme;
  toggleTheme: () => void;
  sidebarState: SidebarState;
  toggleSidebarState: () => void;
}

export interface GeneralProviderProps {
  children: React.ReactNode;
}

export const THEME_ACTIVE_LOCAL_STORAGE_KEY = 'theme_active'
export const SIDEBAR_STATE_LOCAL_STORAGE_KEY = 'sidebar_state'

const getThemeFromLocalStorage = (): Theme => {
  if (typeof window === 'undefined') {
    return Theme.LIGHT
  }

  const theme = localStorage.getItem(THEME_ACTIVE_LOCAL_STORAGE_KEY)

  if (!theme || !Object.values(Theme).includes(theme as Theme)) {
    return Theme.LIGHT
  }

  return theme as Theme
}

const isSidebarCollapseFromLocalStorage = (): SidebarState => {
  if (typeof window === 'undefined') {
    return SidebarState.EXPANDED
  }

  const sidebarState = localStorage.getItem(SIDEBAR_STATE_LOCAL_STORAGE_KEY)
  if (!sidebarState || !Object.values(SidebarState).includes(sidebarState as SidebarState)) {
    return SidebarState.EXPANDED
  }

  return sidebarState as SidebarState
}

// Creación del contexto
const GeneralContext = createContext<GeneralContextType | undefined>(undefined)

// Hook personalizado para acceder al contexto
export const useGeneralContext = () => {
  const context = useContext(GeneralContext)
  if (!context) {
    throw new Error('useGeneralContext must be used within a GeneralContextProvider')
  }

  return context
}

// Proveedor de contexto
export const GeneralContextProvider: FC<GeneralProviderProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<Theme>(getThemeFromLocalStorage)
  const [sidebarState, setSidebarState] = useState<SidebarState>(isSidebarCollapseFromLocalStorage)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    localStorage.setItem(THEME_ACTIVE_LOCAL_STORAGE_KEY, theme)
    document.body.className = theme
  }, [theme])

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STATE_LOCAL_STORAGE_KEY, sidebarState)
  }, [sidebarState])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT))
  }

  const toggleSidebarState = () => {
    setSidebarState((prevState) => (prevState === SidebarState.COLLAPSED ? SidebarState.EXPANDED : SidebarState.COLLAPSED))
  }

  const contextValue = useMemo(() => ({ theme, toggleTheme, sidebarState, toggleSidebarState }), [theme, toggleTheme, sidebarState, toggleSidebarState])

  return (
    <GeneralContext.Provider value={contextValue}>
      {mounted && <>{children}</>}
    </GeneralContext.Provider>
  )
}