// ** MUI Imports
import { ChipProps } from '@mui/material/Chip'

export type CustomChipProps = Omit<ChipProps, 'color'> & {
  color?: ChipProps['color'] | string
  skin?: 'light'
  rounded?: boolean
}
