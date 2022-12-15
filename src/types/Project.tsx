import { ToDo } from './ToDo'

export interface Project {
  id: string
  label: string
  saved: boolean
  user_id: string | undefined
  todos: [ToDo]
}
