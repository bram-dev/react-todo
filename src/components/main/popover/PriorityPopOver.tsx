import * as React from 'react'
import Popover from '@mui/material/Popover'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import Box from '@mui/material/Box'
import { useMutation } from '@apollo/client'
import { UPDATE_TODO } from '../../../graphql/mutations'
import { useState } from 'react'
import { ToDo } from '../../../types/ToDo'
import { GET_TODOS } from '../../../graphql/queries'

interface PriorityPopOverProps {
  open: boolean
  isOpen: Element | ((element: Element) => Element) | null | undefined
  onClose:
    | ((event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void)
    | undefined
  todo: ToDo
}

export default function PriorityPopover({
  isOpen,
  onClose,
  todo,
  open,
}: PriorityPopOverProps) {
  const [updateToDo] = useMutation(UPDATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  })
  const [priority, setPriority] = useState<string>(todo.priority)

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
        <FormControl>
          <FormLabel id="radio-buttons-group-label">Priority</FormLabel>
          <RadioGroup
            defaultValue={priority}
            row
            aria-labelledby="row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={(e) => {
              let newPriority = e.target.value
              setPriority(newPriority)
              updateToDo({
                variables: {
                  updateToDoInput: { id: todo.id, priority: newPriority },
                },
              })
            }}
          >
            <FormControlLabel value="low" control={<Radio />} label="Low" />
            <FormControlLabel
              value="medium"
              control={<Radio />}
              label="Medium"
            />
            <FormControlLabel value="high" control={<Radio />} label="High" />
          </RadioGroup>
        </FormControl>
      </Box>
    </Popover>
  )
}
