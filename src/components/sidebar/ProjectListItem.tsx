import * as React from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import { Box, TextField, Tooltip } from '@mui/material'
import { useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import { ProjectListItemProps } from './SideBar'
import { useMutation, useQuery } from '@apollo/client'
import {
  REMOVE_PROJECT,
  UPDATE_PROJECT,
  UPDATE_TODO,
} from '../../graphql/mutations'
import {
  GET_PROJECTS,
  GET_PROJECT_LABEL_BY_ID,
  GET_TODOS,
} from '../../graphql/queries'
import { useAuth0 } from '@auth0/auth0-react'
import { filteredToDosByUserId } from '../../Helpers'

export function ProjectListItem({
  selectedProjectId,
  handleListItemClick,
  project,
  selectedTabId,
}: ProjectListItemProps) {
  const [updateProject] = useMutation(UPDATE_PROJECT, {
    refetchQueries: [
      { query: GET_PROJECTS },
      {
        query: GET_PROJECT_LABEL_BY_ID,
        variables: { projectId: selectedProjectId },
      },
    ],
  })

  const { user } = useAuth0()

  const [updateToDo] = useMutation(UPDATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  })

  const [removeProject] = useMutation(REMOVE_PROJECT, {
    refetchQueries: [{ query: GET_PROJECTS }],
  })

  const [label, setLabel] = useState(project.label || '')
  const [isEditing, setIsEditing] = useState(project.saved)
  const [isHover, setIsHover] = useState('paper')

  let addProjectContent
  let addProjectButton

  if (isEditing || (project.saved && project.label === '')) {
    addProjectContent = (
      <>
        <ListItemText
          className="truncate"
          sx={{
            width: 160,
            maxWidth: 160,
            paddingBottom: '1px',
            paddingRight: '6px',
            '.MuiListItemButton-root:hover': {
              bgcolor: 'rgb(203 213 225)',
            },
          }}
          primary={label}
        />
      </>
    )
    addProjectButton = (
      <>
        <Tooltip title="Edit project">
          <IconButton
            edge="end"
            size="small"
            onClick={() => {
              setIsEditing(false)
              updateProject({
                variables: {
                  updateProjectInput: {
                    id: project.id,
                    saved: false,
                  },
                },
              })
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </>
    )
  } else {
    addProjectContent = (
      <>
        <TextField
          hiddenLabel
          variant="standard"
          sx={{ width: 160 }}
          onClick={(e) => e.stopPropagation()}
          value={label}
          onChange={(e) => {
            let newLabel = e.target.value
            setLabel(newLabel)
            updateProject({
              variables: {
                updateProjectInput: { id: project.id, label: newLabel },
              },
            })
          }}
        />
      </>
    )
    addProjectButton = (
      <>
        <Tooltip title="Save project">
          <IconButton
            edge="end"
            size="small"
            onClick={() => {
              setIsEditing(true)
              updateProject({
                variables: {
                  updateProjectInput: { id: project.id, saved: true },
                },
              })
            }}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
      </>
    )
  }

  return (
    <>
      <ListItem
        sx={{ paddingLeft: 4, bgcolor: 'background.paper' }}
        disablePadding
        key={'list-item' + project.id}
        secondaryAction={
          <Box className="flex flex-row items-center justify-center">
            <Box
              onMouseEnter={() => setIsHover('rgb(203 213 225)')}
              onMouseLeave={() => setIsHover('paper')}
              className="flex cursor-pointer flex-row items-center justify-center"
              onClick={(event) => handleListItemClick(event, project.id)}
            >
              {addProjectContent}
              <Badge
                sx={{ mx: 2 }}
                badgeContent={
                  filteredToDosByUserId(project.todos, user?.sub).length
                }
              />
            </Box>
            {addProjectButton}
            <Box className="flex pl-2">
              <Tooltip title="Delete project">
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => {
                    removeProject({
                      variables: { removeProjectId: project.id },
                    })
                    project.todos.forEach((todo) =>
                      updateToDo({
                        variables: {
                          updateToDoInput: { id: todo.id, project: null },
                        },
                      })
                    )
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        }
      >
        <ListItemButton
          sx={{ height: 56, bgcolor: isHover }}
          key={'list-item-button' + project.id}
          className="rounded"
          role={undefined}
          selected={selectedTabId === project.id}
          onClick={(event) => handleListItemClick(event, project.id)}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <FiberManualRecordIcon />
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
    </>
  )
}
