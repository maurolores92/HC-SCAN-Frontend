// ** React Imports
import React, { useState, useEffect, useRef, useCallback } from 'react'

// ** MUI Imports
import TextField, { TextFieldProps } from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

export interface TableSearchInputProps extends Omit<TextFieldProps, 'onChange'> {
  value: string
  onChange: (val: string) => void
  onSearch?: (val: string) => void
  debounceMs?: number
  placeholder?: string
  label?: string
}

export const TableSearchInput = ({
  value,
  onChange,
  onSearch,
  debounceMs = 600,
  placeholder = 'Buscar...',
  label,
  size = 'small',
  sx,
  ...rest
}: TableSearchInputProps) => {
  const [internalValue, setInternalValue] = useState<string>(value || '')
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Sincronizar estado interno si el valor externo cambia (ej. al limpiar filtros)
  useEffect(() => {
    setInternalValue(value || '')
  }, [value])

  const triggerSearch = useCallback(
    (termToSearch: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      const trimmed = termToSearch.trim()
      onChange(trimmed)
      if (onSearch) {
        onSearch(trimmed)
      }
    },
    [onChange, onSearch]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value
    setInternalValue(newVal)

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Si el usuario borra todo el texto, disparamos la búsqueda de inmediato
    if (newVal === '') {
      triggerSearch('')

      return
    }

    // Debounce automático al dejar de escribir
    timerRef.current = setTimeout(() => {
      triggerSearch(newVal)
    }, debounceMs)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      triggerSearch(internalValue)
    }
  }

  const handleClear = () => {
    setInternalValue('')
    triggerSearch('')
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return (
    <TextField
      size={size}
      value={internalValue}
      placeholder={placeholder}
      label={label}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            {internalValue ? (
              <Tooltip title='Limpiar búsqueda'>
                <IconButton size='small' edge='end' onClick={handleClear} sx={{ mr: 0.5 }}>
                  <Icon icon='tabler:x' fontSize={18} />
                </IconButton>
              </Tooltip>
            ) : null}
            <Tooltip title='Buscar (Enter)'>
              <IconButton
                size='small'
                edge='end'
                color='primary'
                onClick={() => triggerSearch(internalValue)}
              >
                <Icon icon='tabler:search' fontSize={20} />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
        ...rest.InputProps,
      }}
      sx={sx}
      {...rest}
    />
  )
}

export default TableSearchInput
