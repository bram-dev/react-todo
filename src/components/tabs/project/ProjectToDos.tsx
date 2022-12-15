import * as React from 'react'
import { useQuery } from '@apollo/client'
import { GET_TODOS_BY_PROJECT_ID } from '../../../graphql/queries'
import { ToDo } from '../../../types/ToDo'
import ToDoListItem from '../../main/todos/ToDoListItem'
import {
  filteredToDosByUserId,
  searchToDos,
  sortToDoListBy,
} from '../../../Helpers'
import { SelectedTabProps } from '../../../types/Props'
import AddToDo from '../../main/AddToDo'
import { List } from '@mui/material'
import { useAuth0 } from '@auth0/auth0-react'

export default function ProjectToDos({
  search,
  selectedProjectId,
  selectedTabId,
  sortBy,
  sort,
}: SelectedTabProps) {
  const { loading, error, data } = useQuery(GET_TODOS_BY_PROJECT_ID, {
    variables: { projectId: selectedProjectId },
  })

  const { user } = useAuth0()

  if (error) {
    return <></>
  }

  const sortedToDos = () => {
    if (sort) {
      return sortToDoListBy(
        sortBy,
        searchToDos(
          search,
          filteredToDosByUserId(data.project.todos, user?.sub)
        )
      )
    } else {
      return searchToDos(
        search,
        filteredToDosByUserId(data.project.todos, user?.sub)
      )
    }
  }

  return (
    <>
      <List className="w-full">
        {loading ? (
          <></>
        ) : (
          sortedToDos().map((todo: ToDo) => (
            <ToDoListItem
              key={todo.id}
              selectedProjectId={selectedProjectId}
              selectedTabId={selectedTabId}
              todo={todo}
              loading={loading}
              error={error}
            />
          ))
        )}
      </List>
      <AddToDo
        selectedTabId={selectedTabId}
        selectedProjectId={selectedProjectId}
      />
    </>
  )
}
