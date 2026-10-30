// ** MUI Imports
import MuiChip, { ChipProps } from '@mui/material/Chip'

// ** Third Party Imports
import clsx from 'clsx'

// ** Types
import { CustomChipProps } from './types'

// ** Hooks Imports
import useBgColor, { UseBgColorType } from 'src/@core/hooks/useBgColor'

// Helper para determinar si un color de texto debe ser oscuro o claro basado en el fondo
function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '')
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000
    
return yiq >= 150 ? '#1f2937' : '#ffffff'
  }
  
return '#1f2937'
}

const Chip = (props: CustomChipProps) => {
  // ** Props - Extraemos color, skin, rounded y sx para no filtrarlos como tipos incompatibles a MuiChip
  const { sx, skin, color, rounded, ...restProps } = props

  // ** Hook
  const bgColors = useBgColor()

  const colors: UseBgColorType = {
    primary: { ...bgColors.primaryLight },
    secondary: { ...bgColors.secondaryLight },
    success: { ...bgColors.successLight },
    error: { ...bgColors.errorLight },
    warning: { ...bgColors.warningLight },
    info: { ...bgColors.infoLight }
  }

  const isCustomColor = typeof color === 'string' && (color.startsWith('#') || color.startsWith('rgb'))

  let customSx: any = sx || {}

  if (isCustomColor && color) {
    if (skin === 'light') {
      const isYellow = color.toUpperCase() === '#FFFF00' || color.toUpperCase() === '#FF0'
      const textColor = isYellow ? '#856404' : color
      customSx = {
        backgroundColor: `${color}25`,
        color: textColor,
        border: 'none',
        ...customSx
      }
    } else {
      const textColor = getContrastColor(color)
      customSx = {
        backgroundColor: color,
        color: textColor,
        border: 'none',
        ...customSx
      }
    }
  } else if (skin === 'light' && color && (colors as any)[color]) {
    customSx = Object.assign({}, (colors as any)[color], customSx)
  }

  // Solo pasamos color a MuiChip si es uno de los valores válidos de la paleta MUI
  const muiColor: ChipProps['color'] =
    !isCustomColor && color && ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'default'].includes(color)
      ? (color as ChipProps['color'])
      : undefined

  return (
    <MuiChip
      {...restProps}
      color={muiColor}
      variant='filled'
      className={clsx({
        'MuiChip-rounded': rounded,
        'MuiChip-light': skin === 'light'
      })}
      sx={customSx}
    />
  )
}

export default Chip
