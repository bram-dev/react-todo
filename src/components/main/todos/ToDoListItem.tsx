import * as React from 'react'
import {
  Box,
  Checkbox,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { ToDo } from '../../../types/ToDo'
import { useState } from 'react'
import ProjectPopover from '../popover/ProjectPopOver'
import PriorityPopover from '../popover/PriorityPopOver'
import DueDatePopOver from '../popover/DueDatePopOver'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import FolderIcon from '@mui/icons-material/Folder'
import EmojiFlagsTwoToneIcon from '@mui/icons-material/EmojiFlagsTwoTone'
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded'
import { useMutation, useQuery } from '@apollo/client'
import {
  REMOVE_TODO,
  UPDATE_PROJECT,
  UPDATE_TODO,
} from '../../../graphql/mutations'
import {
  GET_PROJECTS,
  GET_TODOS,
  GET_TODOS_BY_PROJECT_ID,
  GET_TODO_IDS_BY_PROJECT_ID,
} from '../../../graphql/queries'
import { Tabs } from '../../../types/Tabs'

interface ToDoListItemProps {
  todo: ToDo
  loading: boolean
  error: any
  selectedTabId: string
  selectedProjectId: string
}

export default function ToDoListItem({
  selectedTabId,
  selectedProjectId,
  todo,
  loading,
  error,
}: ToDoListItemProps) {
  return (
    <Box>
      <ListItem
        disablePadding
        sx={{ bgcolor: 'background.paper' }}
        key={'list-item-' + todo.id}
      >
        <ToDoItem
          key={'todo-item-' + todo.id}
          selectedTabId={selectedTabId}
          selectedProjectId={selectedProjectId}
          todo={todo}
          loadingToDo={loading}
          errorToDo={error}
        />
      </ListItem>
      <Divider />
    </Box>
  )
}

interface ToDoItemProps {
  selectedProjectId: string
  selectedTabId: string
  todo: ToDo
  loadingToDo: boolean
  errorToDo: any
}

function ToDoItem({
  selectedProjectId,
  selectedTabId,
  todo,
  loadingToDo,
  errorToDo,
}: ToDoItemProps) {
  const [isEditing, setIsEditing] = useState(todo.saved)
  const [isChecked, setIsChecked] = useState(todo.checked)
  const [label, setLabel] = useState(todo.label)

  const { loading, error, data } = useQuery(GET_TODO_IDS_BY_PROJECT_ID, {
    variables: { projectId: selectedProjectId },
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

  const [removeToDo] = useMutation(REMOVE_TODO, {
    refetchQueries: [
      { query: GET_TODOS },
      { query: GET_PROJECTS },
      {
        query: GET_TODOS_BY_PROJECT_ID,
        variables: { projectId: selectedProjectId },
      },
    ],
    onCompleted: (dataToDo: any) => {
      let newToDos = data.map((todo: any) => todo.id)
      newToDos.filter((todo: any) => todo.id !== dataToDo.createToDo.id)
      updateProject({
        variables: {
          updateProjectInput: {
            id: selectedProjectId,
            todos: newToDos,
          },
        },
      })
    },
  })

  const [updateToDo] = useMutation(UPDATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  })

  let todoContent

  if (errorToDo || error) {
    todoContent = <></>
  }

  const [isOpenPriorityPopOver, setIsOpenPriorityPopOver] =
    useState<HTMLButtonElement | null>(null)

  const handleClickPriority = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpenPriorityPopOver(event.currentTarget)
  }

  const handleClosePriority = () => {
    setIsOpenPriorityPopOver(null)
  }

  const [isOpenProjectPopOver, setIsOpenProjectPopOver] =
    useState<HTMLButtonElement | null>(null)

  const handleClickProject = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpenProjectPopOver(event.currentTarget)
  }

  const handleCloseProject = () => {
    setIsOpenProjectPopOver(null)
  }

  const [isOpenDueDatePopOver, setIsOpenDueDatePopOver] =
    useState<HTMLButtonElement | null>(null)

  const handleClickDueDate = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpenDueDatePopOver(event.currentTarget)
  }

  const handleCloseDueDate = () => {
    setIsOpenDueDatePopOver(null)
  }

  const openDueDatePopOver = Boolean(isOpenDueDatePopOver)
  const openProjectPopOver = Boolean(isOpenProjectPopOver)
  const openPriorityPopover = Boolean(isOpenPriorityPopOver)

  const setColorPriorityBorder = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'green'
      case 'medium':
        return 'orange'
      case 'high':
        return 'red'
      default:
        return 'background.paper'
    }
  }

  const standardButtons = (
    <Box className="flex flex-row">
      <Tooltip title="Todo project">
        <IconButton onClick={handleClickProject}>
          <FolderIcon />
        </IconButton>
      </Tooltip>
      <ProjectPopover
        todo={todo}
        isOpen={isOpenProjectPopOver}
        onClose={handleCloseProject}
        selectedProjectId={selectedProjectId}
        open={openProjectPopOver}
      />
      <Tooltip title="Todo priority">
        <IconButton onClick={handleClickPriority}>
          <EmojiFlagsTwoToneIcon />
        </IconButton>
      </Tooltip>
      <PriorityPopover
        todo={todo}
        isOpen={isOpenPriorityPopOver}
        onClose={handleClosePriority}
        open={openPriorityPopover}
      />
      <Tooltip title="Todo due date">
        <IconButton onClick={handleClickDueDate}>
          <DateRangeRoundedIcon />
        </IconButton>
      </Tooltip>
      <DueDatePopOver
        todo={todo}
        isOpen={isOpenDueDatePopOver}
        onClose={handleCloseDueDate}
        open={openDueDatePopOver}
      />
      <Tooltip title="Delete todo">
        <IconButton
          onClick={() => {
            removeToDo({ variables: { removeToDoId: todo.id } })
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )

  const checkboxContent = (
    <ListItemIcon>
      <Checkbox
        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
        checked={isChecked}
        onChange={(e) => {
          let newChecked = e.target.checked
          setIsChecked(newChecked)
          updateToDo({
            variables: {
              updateToDoInput: { id: todo.id, checked: newChecked },
            },
          })
        }}
      />
    </ListItemIcon>
  )

  let listItemTextTodo

  if (todo.checked) {
    listItemTextTodo = (
      <ListItemText
        className="w-full max-w-[400px] pb-[4px] line-through"
        primary={label}
      />
    )
  } else {
    listItemTextTodo = (
      <ListItemText className="w-full max-w-[400px] pb-[4px]" primary={label} />
    )
  }

  let projectText

  if (
    selectedTabId === Tabs.HOME ||
    selectedTabId === Tabs.INBOX ||
    selectedTabId === Tabs.TODAY ||
    selectedTabId === Tabs.UPCOMING
  ) {
    projectText = (
      <Typography className="pl-4" sx={{ width: 150, minWidth: 150 }}>
        {loadingToDo || loading || todo.project === null ? (
          <></>
        ) : (
          todo.project.label
        )}
      </Typography>
    )
  } else {
    projectText = <Box className="w-[150px]"></Box>
  }

  if (isEditing || (todo.saved && todo.label === '')) {
    todoContent = (
      <>
        <Box className="flex w-full items-center">
          {checkboxContent}
          <Box className="flex w-full flex-1 items-center truncate">
            {listItemTextTodo}
            {projectText}
            <Typography className="pl-12" sx={{ width: '100px' }}>
              {loadingToDo || loading ? <></> : todo.date}
            </Typography>
          </Box>
        </Box>
        <Box className="flex pl-4">
          <Tooltip title="Edit todo">
            <IconButton
              onClick={() => {
                setIsEditing(false)
                updateToDo({
                  variables: { updateToDoInput: { id: todo.id, saved: false } },
                })
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          {standardButtons}
        </Box>
      </>
    )
  } else {
    todoContent = (
      <>
        <Box className="flex w-full items-center">
          {checkboxContent}
          <Box className="flex w-full flex-1 items-center truncate">
            <TextField
              variant="standard"
              className="max-w-[400px]"
              sx={{ width: 1 }}
              size="small"
              value={label}
              onChange={(e) => {
                let newLabel = e.target.value
                setLabel(newLabel),
                  updateToDo({
                    variables: {
                      updateToDoInput: { id: todo.id, label: newLabel },
                    },
                  })
              }}
            />
            {projectText}
            <Typography className="pl-12" sx={{ width: '100px' }}>
              {loadingToDo || loading ? <></> : todo.date}
            </Typography>
          </Box>
        </Box>
        <Box className="flex pl-4">
          <Tooltip title="Save todo">
            <IconButton
              onClick={() => {
                setIsEditing(true)
                updateToDo({
                  variables: { updateToDoInput: { id: todo.id, saved: true } },
                })
              }}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
          {standardButtons}
        </Box>
      </>
    )
  }

  return (
    <Box
      sx={{
        paddingX: 2,
        paddingY: 1,
        borderLeft: 6,
        borderColor: setColorPriorityBorder(todo.priority),
      }}
      className="flex w-full flex-row items-center"
    >
      {todoContent}
    </Box>
  )
}
