import { Project } from './Project'

export interface ToDo {
  id: string
  label: string
  priority: string
  date: string
  checked: boolean
  saved: boolean
  user_id: string | undefined
  project: Project | null
}
