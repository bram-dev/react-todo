import * as React from 'react'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import TextField from '@mui/material/TextField'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { useMutation } from '@apollo/client'
import { UPDATE_TODO } from '../../../graphql/mutations'
import { useState } from 'react'
import { ToDo } from '../../../types/ToDo'
import { GET_TODOS } from '../../../graphql/queries'

interface DueDatePopOverProps {
  open: boolean
  isOpen: Element | ((element: Element) => Element) | null | undefined
  onClose:
    | ((event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void)
    | undefined
  todo: ToDo
}

export default function DueDatePopOver({
  isOpen,
  onClose,
  todo,
  open,
}: DueDatePopOverProps) {
  const [date, setDate] = useState<Dayjs | null>(null)
  const [updateToDo] = useMutation(UPDATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  })

  return (
    <Popover
      open={open}
      anchorEl={isOpen}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Box component="form" className="py-4 px-4">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="Due date"
            inputFormat="DD/MM/YYYY"
            value={date}
            onChange={(newDate) => {
              setDate(newDate)
              let formattedNewDate = dayjs(newDate).format('DD/MM/YYYY')
              updateToDo({
                variables: {
                  updateToDoInput: { id: todo.id, date: formattedNewDate },
                },
              })
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Box>
    </Popover>
  )
}
