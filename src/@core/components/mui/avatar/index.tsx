import { forwardRef, Ref } from 'react'
import MuiAvatar from '@mui/material/Avatar'
import { lighten, useTheme } from '@mui/material/styles'
import { CustomAvatarProps } from './types'
import { ThemeColor } from 'src/@core/layouts/types'
import useBgColor, { UseBgColorType } from 'src/@core/hooks/useBgColor'

const Avatar = forwardRef((props: CustomAvatarProps, ref: Ref<any>) => {
  const { sx, src, skin, color, ...restProps } = props
  const theme = useTheme()
  const bgColors: UseBgColorType = useBgColor()

  const getAvatarStyles = (skin: 'filled' | 'light' | 'light-static' | undefined, skinColor: ThemeColor) => {
    let avatarStyles

    if (skin === 'light') {
      avatarStyles = { ...bgColors[`${skinColor}Light`] }
    } else if (skin === 'light-static') {
      avatarStyles = {
        color: bgColors[`${skinColor}Light`].color,
        backgroundColor: lighten(theme.palette[skinColor].main, 0.88)
      }
    } else {
      avatarStyles = { ...bgColors[`${skinColor}Filled`] }
    }

    return avatarStyles
  }

  const colors: UseBgColorType = {
    primary: getAvatarStyles(skin, 'primary'),
    secondary: getAvatarStyles(skin, 'secondary'),
    success: getAvatarStyles(skin, 'success'),
    error: getAvatarStyles(skin, 'error'),
    warning: getAvatarStyles(skin, 'warning'),
    info: getAvatarStyles(skin, 'info')
  }

  const isCustomColor = typeof color === 'string' && (color.startsWith('#') || color.startsWith('rgb'))

  let avatarSx: any = sx || {}

  if (isCustomColor && color) {
    if (skin === 'light') {
      const isYellow = color.toUpperCase() === '#FFFF00' || color.toUpperCase() === '#FF0'
      avatarSx = {
        backgroundColor: `${color}25`,
        color: isYellow ? '#856404' : color,
        ...avatarSx
      }
    } else {
      const isYellow = color.toUpperCase() === '#FFFF00' || color.toUpperCase() === '#FF0'
      avatarSx = {
        backgroundColor: color,
        color: isYellow ? '#1f2937' : '#ffffff',
        ...avatarSx
      }
    }
  } else if (!src && skin && color && (colors as any)[color]) {
    avatarSx = Object.assign({}, (colors as any)[color], avatarSx)
  }

  return <MuiAvatar ref={ref} {...restProps} src={src} sx={avatarSx} />
})

Avatar.defaultProps = {
  skin: 'filled',
  color: 'primary'
}

export default Avatar
