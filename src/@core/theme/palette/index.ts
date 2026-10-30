// ** Type Imports
import { Palette } from '@mui/material'
import { Skin } from 'src/@core/layouts/types'

const DefaultPalette = (mode: Palette['mode'], skin: Skin): Palette => {
  // ** Vars
  const whiteColor = '#FFF'
  const lightColor = '15, 23, 42' // Slate 900
  const darkColor = '241, 245, 249' // Slate 100
  const darkPaperBgColor = '#1E293B' // Slate 800
  const mainColor = mode === 'light' ? lightColor : darkColor

  const defaultBgColor = () => {
    if (skin === 'bordered' && mode === 'light') {
      return whiteColor
    } else if (skin === 'bordered' && mode === 'dark') {
      return darkPaperBgColor
    } else if (mode === 'light') {
      return '#F8FAFC'
    } else return '#0F172A'
  }

  return {
    customColors: {
      dark: darkColor,
      main: mainColor,
      light: lightColor,
      lightPaperBg: whiteColor,
      darkPaperBg: darkPaperBgColor,
      bodyBg: mode === 'light' ? '#F8FAFC' : '#0F172A',
      trackBg: mode === 'light' ? '#F1F5F9' : '#334155',
      avatarBg: mode === 'light' ? '#E2E8F0' : '#475569',
      tableHeaderBg: mode === 'light' ? '#F8FAFC' : '#334155'
    },
    mode: mode,
    common: {
      black: '#000',
      white: whiteColor
    },
    primary: {
      light: '#818CF8',
      main: '#4F46E5', // Cognitive Indigo (HC-SCAN Primary)
      dark: '#3730A3',
      contrastText: whiteColor
    },
    secondary: {
      light: '#94A3B8',
      main: '#64748B', // Slate
      dark: '#475569',
      contrastText: whiteColor
    },
    error: {
      light: '#F87171',
      main: '#EF4444',
      dark: '#DC2626',
      contrastText: whiteColor
    },
    warning: {
      light: '#FBBF24',
      main: '#F59E0B',
      dark: '#D97706',
      contrastText: whiteColor
    },
    info: {
      light: '#38BDF8',
      main: '#0284C7', // Laser Cyan / AI scanner
      dark: '#0369A1',
      contrastText: whiteColor
    },
    success: {
      light: '#34D399',
      main: '#10B981', // Clean Emerald
      dark: '#059669',
      contrastText: whiteColor
    },
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
      A100: '#F1F5F9',
      A200: '#E2E8F0',
      A400: '#94A3B8',
      A700: '#334155'
    },
    text: {
      primary: `rgba(${mainColor}, ${mode === 'light' ? 0.88 : 0.92})`,
      secondary: `rgba(${mainColor}, ${mode === 'light' ? 0.65 : 0.7})`,
      disabled: `rgba(${mainColor}, 0.38)`
    },
    divider: `rgba(${mainColor}, ${mode === 'light' ? 0.08 : 0.12})`,
    background: {
      paper: mode === 'light' ? whiteColor : darkPaperBgColor,
      default: defaultBgColor()
    },
    action: {
      active: `rgba(${mainColor}, 0.54)`,
      hover: `rgba(${mainColor}, 0.04)`,
      selected: `rgba(${mainColor}, 0.08)`,
      selectedOpacity: 0.08,
      disabled: `rgba(${mainColor}, 0.26)`,
      disabledBackground: `rgba(${mainColor}, 0.12)`,
      focus: `rgba(${mainColor}, 0.12)`
    }
  } as Palette
}

export default DefaultPalette
