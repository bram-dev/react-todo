import { ToDo } from './types/ToDo'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Project } from './types/Project'
dayjs.extend(customParseFormat)

export const filterInboxTodos = (todos: ToDo[]) => {
  let inboxToDos: ToDo[] = []
  inboxToDos.push(...filterToDosByEmptyProject(todos))
  inboxToDos.push(...filterToDosByEmptyDueDate(todos))
  inboxToDos.push(...filterToDosByEmptyLabel(todos))
  inboxToDos.push(...filterToDosByChecked(todos))
  let uniqueInboxToDos = inboxToDos.filter((todo: ToDo, index: number) => {
    return inboxToDos.indexOf(todo) === index
  })
  let filteredTodosByChecked = filterToDosByChecked(uniqueInboxToDos)
  return filteredTodosByChecked
}

export const filterToDosByEmptyLabel = (todos: ToDo[]) => {
  const filteredToDosByEmptyLabel: any = todos.filter((todo) => {
    return '' === todo.label
  })
  return filteredToDosByEmptyLabel
}

export const filterToDosByEmptyDueDate = (todos: ToDo[]) => {
  const filteredToDosByEmptyDueDate: ToDo[] = todos.filter((todo) => {
    return '' === todo.date
  })
  return filteredToDosByEmptyDueDate
}

export const filterToDosByEmptyProject = (todos: ToDo[]) => {
  const filteredToDosByProject: ToDo[] = todos.filter((todo) => {
    return null === todo?.project
  })
  return filteredToDosByProject
}

export const filterToDosByToday = (todos: ToDo[]) => {
  const filteredToDosByToday: any = todos.filter((todo) => {
    return dayjs().format('DD/MM/YYYY') === todo.date
  })
  return filteredToDosByToday
}

export const filterToDosByChecked = (todos: ToDo[]) => {
  const filteredToDosByChecked: any = todos.filter((todo) => {
    return todo.checked === false
  })
  return filteredToDosByChecked
}

export const filterToDosByUpcomingDueDate = (todos: ToDo[]) => {
  const filteredToDosByUpcomingDueDate: ToDo[] = todos.filter((todo) => {
    const parsedDueDate = dayjs(todo.date, 'DD-MM-YYYY')
    const now = dayjs()
    return parsedDueDate.isAfter(now)
  })
  return filteredToDosByUpcomingDueDate
}

export const searchToDos = (search: string | null, dataToDos: any) => {
  if (search === null || '') {
    return dataToDos
  }
  let searchedData = dataToDos.filter((todo: ToDo) =>
    todo.label.toLowerCase().includes(search.toLowerCase())
  )
  return searchedData
}

export const sortToDoListBy = (sortBy: string, todos: ToDo[]) => {
  switch (sortBy) {
    case 'todos-a-z':
      return todos.sort((a, b) =>
        !a.label ? 1 : !b.label ? -1 : a.label.localeCompare(b.label)
      )
    case 'todos-z-a':
      return todos.sort((a, b) =>
        !a.label ? 1 : !b.label ? -1 : b.label.localeCompare(a.label)
      )
    case 'due-date-soonest':
      return todos.sort((a, b) =>
        !a.date
          ? 1
          : !b.date
          ? -1
          : dayjs(a.date, 'DD/MM/YYYY').isAfter(dayjs(b.date, 'DD/MM/YYYY'))
          ? 1
          : -1
      )
    case 'due-date-latest':
      return todos.sort((a, b) =>
        !a.date
          ? 1
          : !b.date
          ? -1
          : dayjs(b.date, 'DD/MM/YYYY').isAfter(dayjs(a.date, 'DD/MM/YYYY'))
          ? 1
          : -1
      )
    case 'projects-a-z':
      return todos.sort((a, b) =>
        !a?.project
          ? 1
          : !b?.project
          ? -1
          : a?.project.label.localeCompare(b?.project.label)
      )
    case 'projects-z-a':
      return todos.sort((a, b) =>
        !a?.project
          ? 1
          : !b?.project
          ? -1
          : b?.project.label.localeCompare(a?.project.label)
      )
    default:
      const sortedToDosByPriority = todos.sort((a, b) => {
        const indexes = ['high', 'medium', 'low', '']
        return indexes.indexOf(a.priority) - indexes.indexOf(b.priority)
      })
      return sortedToDosByPriority
  }
}

export const filteredProjectsByUserId = (
  projects: Project[],
  user_id: string | undefined
) => {
  return projects.filter((project: Project) => project.user_id === user_id)
}

export const filteredToDosByUserId = (
  todos: ToDo[],
  user_id: string | undefined
) => {
  return todos.filter((todo: ToDo) => todo.user_id === user_id)
}
