import * as React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { LoadingButton } from '@mui/lab'
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import {
  GET_PROJECTS,
  GET_TODOS,
  GET_TODOS_BY_PROJECT_ID,
  GET_TODO_IDS_BY_PROJECT_ID,
} from '../../graphql/queries'
import { CREATE_TODO, UPDATE_PROJECT } from '../../graphql/mutations'
import { Project } from '../../types/Project'
import { useAuth0 } from '@auth0/auth0-react'
import { filteredProjectsByUserId } from '../../Helpers'

type AddToDoModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function AddToDoModal({ isOpen, onClose }: AddToDoModalProps) {
  const [date, setDate] = useState<Dayjs | null>(null)
  const [inputProject, setInputProject] = useState('')
  const [project, setProject] = useState<Project | null>(null)
  const { user } = useAuth0()

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    refetchQueries: [
      { query: GET_PROJECTS },
      {
        query: GET_TODOS_BY_PROJECT_ID,
        variables: { projectId: project?.id },
      },
    ],
  })

  const [createToDo] = useMutation(CREATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
    onCompleted: (data: any) => {
      let newToDos = projectToDosById().map((todo: any) => todo.id)
      newToDos.push(data.createToDo.id)
      updateProject({
        variables: {
          updateProjectInput: {
            id: project?.id,
            todos: newToDos,
          },
        },
      })
    },
  })

  const queryMultiple = () => {
    const dataProjects = useQuery(GET_PROJECTS)
    const dataProjectToDosById = useQuery(GET_TODO_IDS_BY_PROJECT_ID, {
      variables: { projectId: project?.id },
    })
    return [dataProjects, dataProjectToDosById]
  }

  const [
    { data: dataProjects, loading: loadingProjects, error: errorProjects },
    {
      data: dataProjectToDosById,
      loading: loadingProjectToDosById,
      error: errorProjectToDosById,
    },
  ] = queryMultiple()

  const projectToDosById = () => {
    if (loadingProjectToDosById) {
      return []
    }
    if (errorProjectToDosById) {
      return []
    }
    return dataProjectToDosById.project.todos
  }

  const projects = () => {
    if (loadingProjects) {
      return []
    }
    if (errorProjects) {
      return []
    }
    return filteredProjectsByUserId(dataProjects.projects, user?.sub)
  }

  let emptyTodo = {
    saved: false,
    label: '',
    priority: '',
    date: '',
    checked: false,
    user_id: user?.sub,
  }

  const [todo, setTodo] = useState(emptyTodo)

  const optionsAutoComplete = () => {
    return projects().map((project: Project) => project)
  }

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    })
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      disablePortal
    >
      <DialogContent sx={{ width: 400 }}>
        <Box
          component="form"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            id="standard-label"
            label="Todo"
            variant="outlined"
            onChange={(e) => {
              ;(todo.label = e.target.value), setTodo(todo)
            }}
          />
          <FormControl>
            <FormLabel id="radio-buttons-group-label">Priority</FormLabel>
            <RadioGroup
              row
              aria-labelledby="row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={(e) => {
                ;(todo.priority = e.target.value), setTodo(todo)
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Due date"
              inputFormat="DD/MM/YYYY"
              value={date}
              onChange={(newDate) => {
                setDate(newDate)
                let formattedNewDate = dayjs(newDate).format('DD/MM/YYYY')
                todo.date = formattedNewDate
                setTodo(todo)
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <FormControl>
            <Autocomplete
              id="search-project"
              options={optionsAutoComplete()}
              inputValue={inputProject}
              onChange={(event, project: any) => setProject(project)}
              onInputChange={(event, newInputProject) => {
                setInputProject(newInputProject)
              }}
              renderInput={(params) => (
                <TextField placeholder="Project" {...params} />
              )}
            />
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          loading={loadingProjectToDosById || loadingProjects}
          onClick={() => {
            onClose(),
              createToDo({
                variables: {
                  createToDoInput: {
                    ...todo,
                    project: project?.id,
                  },
                },
              })
            scrollToBottom(), setTodo(emptyTodo)
          }}
        >
          Add todo
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
