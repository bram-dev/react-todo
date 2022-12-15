import { gql } from '@apollo/client'

export const REMOVE_TODO = gql`
  mutation RemoveToDo($removeToDoId: ID!) {
    removeToDo(id: $removeToDoId) {
      id
    }
  }
`

export const UPDATE_TODO = gql`
  mutation UpdateToDo($updateToDoInput: UpdateToDoInput!) {
    updateToDo(updateToDoInput: $updateToDoInput) {
      id
    }
  }
`
export const CREATE_TODO = gql`
  mutation CreateToDo($createToDoInput: CreateToDoInput) {
    createToDo(createToDoInput: $createToDoInput) {
      id
      user_id
    }
  }
`

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($updateProjectInput: UpdateProjectInput!) {
    updateProject(updateProjectInput: $updateProjectInput) {
      id
    }
  }
`

export const REMOVE_PROJECT = gql`
  mutation RemoveProject($removeProjectId: ID!) {
    removeProject(id: $removeProjectId) {
      id
    }
  }
`

export const CREATE_PROJECT = gql`
  mutation CreateProject($createProjectInput: CreateProjectInput) {
    createProject(createProjectInput: $createProjectInput) {
      id
      user_id
    }
  }
`
