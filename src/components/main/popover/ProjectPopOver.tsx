import * as React from 'react'
import Popover from '@mui/material/Popover'
import FormControl from '@mui/material/FormControl'
import Box from '@mui/material/Box'
import { useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import {
  GET_PROJECTS,
  GET_TODOS,
  GET_TODOS_BY_PROJECT_ID,
} from '../../../graphql/queries'
import { useMutation, useQuery } from '@apollo/client'
import { ToDo } from '../../../types/ToDo'
import { Project } from '../../../types/Project'
import { UPDATE_PROJECT, UPDATE_TODO } from '../../../graphql/mutations'
import { useAuth0 } from '@auth0/auth0-react'

interface ProjectPopOverProps {
  selectedProjectId: string
  open: boolean
  isOpen: Element | ((element: Element) => Element) | null | undefined
  onClose:
    | ((event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void)
    | undefined
  todo: ToDo
}

export default function ProjectPopover({
  isOpen,
  onClose,
  todo,
  open,
  selectedProjectId,
}: ProjectPopOverProps) {
  const [inputProject, setInputProject] = useState(todo?.project?.label)

  const { loading, error, data } = useQuery(GET_PROJECTS)
  const { user } = useAuth0()

  const [updateToDo] = useMutation(UPDATE_TODO, {
    refetchQueries: [
      { query: GET_TODOS },
      {
        query: GET_TODOS_BY_PROJECT_ID,
        variables: { projectId: selectedProjectId },
      },
      { query: GET_PROJECTS },
    ],
    onCompleted: () => {
      if (todo.project !== null) {
        let projectId: string
        todo?.project?.id === undefined
          ? (projectId = selectedProjectId)
          : (projectId = todo.project.id)
        let project = data.projects.find(
          (projectfilter: Project) => projectfilter.id === projectId
        )
        let projectToDosIds = project?.todos.map((todo: ToDo) => todo.id)
        let filteredProjectToDoIds = projectToDosIds?.filter(
          (todoIdInProject: string) => todoIdInProject !== todo.id
        )
        updateProject({
          variables: {
            updateProjectInput: {
              id: project?.id,
              todos: filteredProjectToDoIds,
            },
          },
        })
      }
    },
  })

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    refetchQueries: [
      { query: GET_PROJECTS },
      {
        query: GET_TODOS_BY_PROJECT_ID,
        variables: { projectId: selectedProjectId },
      },
    ],
  })

  const filteredProjects = () => {
    return data.projects
      .filter((project: Project) => project.user_id === user?.sub)
      .filter((project: Project) => project.id != selectedProjectId)
  }

  let autoComplete

  autoComplete = (
    <Autocomplete
      sx={{ width: 230 }}
      id="search-project"
      options={loading || error ? [] : filteredProjects()}
      defaultValue={todo?.project?.label}
      onInputChange={(event, newInputProject) => {
        setInputProject(newInputProject)
      }}
      inputValue={inputProject}
      onChange={(event, project: any) => {
        updateToDo({
          variables: {
            updateToDoInput: { id: todo.id, project: project.id },
          },
        })
        let projectToDoIds = project?.todos.map((todo: ToDo) => todo.id)
        projectToDoIds?.push(todo.id)
        updateProject({
          variables: {
            updateProjectInput: { id: project.id, todos: projectToDoIds },
          },
        })
      }}
      renderInput={(params) => <TextField placeholder="Project" {...params} />}
    />
  )

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
        <FormControl>{autoComplete}</FormControl>
      </Box>
    </Popover>
  )
}
