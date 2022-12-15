import * as React from 'react'
import { useQuery } from '@apollo/client'
import { GET_TODOS } from '../../../graphql/queries'
import { ToDo } from '../../../types/ToDo'
import ToDoListItem from '../../main/todos/ToDoListItem'
import {
  filteredToDosByUserId,
  filterToDosByToday,
  searchToDos,
  sortToDoListBy,
} from '../../../Helpers'
import { SelectedTabProps } from '../../../types/Props'
import AddToDo from '../../main/AddToDo'
import { List } from '@mui/material'
import { useAuth0 } from '@auth0/auth0-react'

export default function TodayToDos({
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

  filteredToDosByUserId(data.todos, user?.sub)

  const sortedToDos = () => {
    if (sort) {
      return sortToDoListBy(
        sortBy,
        searchToDos(
          search,
          filterToDosByToday(filteredToDosByUserId(data.todos, user?.sub))
        )
      )
    } else {
      return searchToDos(
        search,
        filterToDosByToday(filteredToDosByUserId(data.todos, user?.sub))
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
