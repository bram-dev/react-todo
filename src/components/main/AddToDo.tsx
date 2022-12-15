import * as React from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Box, Fab } from '@mui/material'
import { useState } from 'react'
import { CREATE_TODO, UPDATE_PROJECT } from '../../graphql/mutations'
import { useMutation, useQuery } from '@apollo/client'
import {
  GET_PROJECTS,
  GET_TODOS,
  GET_TODOS_BY_PROJECT_ID,
  GET_TODO_IDS_BY_PROJECT_ID,
} from '../../graphql/queries'
import { Tabs } from '../../types/Tabs'
import dayjs from 'dayjs'
import { useAuth0 } from '@auth0/auth0-react'

interface AddToDoProps {
  selectedProjectId: string
  selectedTabId: string
}

export default function AddToDo({
  selectedProjectId,
  selectedTabId,
}: AddToDoProps) {
  const scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      })
    }, 200)
  }

  const { user } = useAuth0()

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

  const [createToDo] = useMutation(CREATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
    onCompleted: (dataToDo: any) => {
      let newToDos = data.project.todos.map((todo: any) => todo.id)
      newToDos.push(dataToDo.createToDo.id)
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

  let emptyToDo = {
    checked: false,
    date: '',
    label: '',
    priority: '',
    saved: false,
    user_id: user?.sub,
    project: null,
  }

  const showFabBoolean = () => {
    let booleanShowFab =
      (loading || error) &&
      selectedTabId != Tabs.HOME &&
      selectedTabId != Tabs.INBOX &&
      selectedTabId != Tabs.UPCOMING &&
      selectedTabId != Tabs.TODAY
    return booleanShowFab
  }

  const [todo, setToDo] = useState(emptyToDo)

  const switchToDoByTabsId = () => {
    switch (selectedTabId) {
      case Tabs.HOME:
        return todo
      case Tabs.TODAY:
        return { ...todo, date: dayjs().format('DD/MM/YYYY') }
      case Tabs.INBOX:
        return todo
      case Tabs.UPCOMING:
        return { ...todo, date: dayjs().add(7, 'day').format('DD/MM/YYYY') }
      default:
        return { ...todo, project: selectedProjectId }
    }
  }

  const addToDoFab = (
    <Fab
      className="bg-slate-200"
      size="large"
      aria-label="addToDo"
      onClick={() => {
        setToDo(todo)
        createToDo({
          variables: {
            createToDoInput: {
              ...switchToDoByTabsId(),
            },
          },
        })
        scrollToBottom()
        setToDo(emptyToDo)
      }}
    >
      <AddIcon />
    </Fab>
  )

  return (
    <Box className="sticky bottom-4 flex h-[72px] w-full justify-center">
      {showFabBoolean() ? <></> : addToDoFab}
    </Box>
  )
}
