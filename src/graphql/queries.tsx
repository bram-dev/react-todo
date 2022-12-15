import { gql } from '@apollo/client'

export const GET_TODOS = gql`
  query Todos {
    todos {
      id
      label
      checked
      date
      priority
      saved
      user_id
      project {
        id
        label
      }
    }
  }
`

export const GET_PROJECTS = gql`
  query Projects {
    projects {
      id
      label
      saved
      user_id
      todos {
        id
        user_id
      }
    }
  }
`

export const GET_PROJECT_LABEL_BY_ID = gql`
  query Project($projectId: ID!) {
    project(id: $projectId) {
      label
    }
  }
`

export const GET_PROJECT_BY_ID = gql`
  query Project($projectId: ID!) {
    project(id: $projectId) {
      id
      label
      saved
    }
  }
`
export const GET_TODOS_BY_PROJECT_ID = gql`
  query Project($projectId: ID!) {
    project(id: $projectId) {
      todos {
        id
        label
        saved
        checked
        date
        priority
        user_id
      }
    }
  }
`

export const GET_TODO_IDS_BY_PROJECT_ID = gql`
  query Project($projectId: ID!) {
    project(id: $projectId) {
      todos {
        id
      }
    }
  }
`
