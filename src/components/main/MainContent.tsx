import * as React from 'react'
import { Box, Typography } from '@mui/material'
import { GET_PROJECT_LABEL_BY_ID } from '../../graphql/queries'
import { useQuery } from '@apollo/client'
import { Tabs } from '../../types/Tabs'
import ToDoList from './todos/ToDoList'
import { SelectedTabProps } from '../../types/Props'

export default function MainContent({
  selectedProjectId,
  selectedTabId,
  search,
  sortBy,
  sort,
  setSort,
}: SelectedTabProps) {
  const { loading, error, data } = useQuery(GET_PROJECT_LABEL_BY_ID, {
    variables: { projectId: selectedProjectId },
  })
  const showSelectedProjectLabel = (selectedTabId: string) => {
    switch (selectedTabId) {
      case Tabs.HOME:
        return 'Home'
      case Tabs.TODAY:
        return 'Today'
      case Tabs.INBOX:
        return 'Inbox'
      case Tabs.UPCOMING:
        return 'Upcoming'
      default:
        if (error) {
          return <p>ERROR: {error.message}</p>
        }
        return data.project.label
    }
  }

  return (
    <Box className="flex flex-col items-center">
      <Box
        className="sticky top-[72px] w-full overflow-auto"
        sx={{ zIndex: 1200, bgcolor: 'background.paper' }}
      >
        <Typography className="flex h-[72px] items-center justify-center text-2xl font-semibold">
          {loading ? <></> : showSelectedProjectLabel(selectedTabId)}
        </Typography>
      </Box>
      <ToDoList
        sort={sort}
        setSort={setSort}
        sortBy={sortBy}
        search={search}
        selectedTabId={selectedTabId}
        selectedProjectId={selectedProjectId}
      />
    </Box>
  )
}
