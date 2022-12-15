import * as React from 'react'
import { useQuery } from '@apollo/client'
import { GET_TODOS } from '../../../graphql/queries'
import { ToDo } from '../../../types/ToDo'
import ToDoListItem from '../../main/todos/ToDoListItem'
import {
  filteredToDosByUserId,
  filterToDosByUpcomingDueDate,
  searchToDos,
  sortToDoListBy,
} from '../../../Helpers'
import { SelectedTabProps } from '../../../types/Props'
import { List } from '@mui/material'
import AddToDo from '../../main/AddToDo'
import { useAuth0 } from '@auth0/auth0-react'

export default function UpcomingToDos({
  search,
  selectedTabId,
  selectedProjectId,
  sortBy,
  sort,
}: SelectedTabProps) {
  const { loading, error, data } = useQuery(GET_TODOS)
  const { user } = useAuth0()

  if (error) {
    return <></>
  }

  const sortedToDos = () => {
    if (sort) {
      return sortToDoListBy(
        sortBy,
        filterToDosByUpcomingDueDate(
          filteredToDosByUserId(data.todos, user?.sub)
        )
      )
    } else {
      return searchToDos(
        search,
        filterToDosByUpcomingDueDate(
          filteredToDosByUserId(data.todos, user?.sub)
        )
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
