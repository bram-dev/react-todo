import * as React from 'react'
import { List } from '@mui/material'
import HomeToDos from '../../tabs/home/HomeToDos'
import { SelectedTabProps } from '../../../types/Props'
import { Tabs } from '../../../types/Tabs'
import InboxToDos from '../../tabs/inbox/InboxToDos'
import TodayToDos from '../../tabs/today/TodayToDos'
import UpcomingToDos from '../../tabs/upcoming/UpcomingToDos'
import ProjectToDos from '../../tabs/project/ProjectToDos'

export default function ToDoList({
  search,
  selectedTabId,
  selectedProjectId,
  sortBy,
  sort,
  setSort,
}: SelectedTabProps) {
  const switchRenderToDos = (selectedTabId: string) => {
    switch (selectedTabId) {
      case Tabs.HOME:
        return (
          <HomeToDos
            key={'Home'}
            sort={sort}
            setSort={setSort}
            sortBy={sortBy}
            selectedProjectId={selectedProjectId}
            search={search}
            selectedTabId={selectedTabId}
          />
        )
      case Tabs.INBOX:
        return (
          <InboxToDos
            key={'Inbox'}
            sort={sort}
            setSort={setSort}
            sortBy={sortBy}
            selectedProjectId={selectedProjectId}
            search={search}
            selectedTabId={selectedTabId}
          />
        )
      case Tabs.TODAY:
        return (
          <TodayToDos
            key={'Today'}
            sort={sort}
            setSort={setSort}
            sortBy={sortBy}
            selectedProjectId={selectedProjectId}
            search={search}
            selectedTabId={selectedTabId}
          />
        )
      case Tabs.UPCOMING:
        return (
          <UpcomingToDos
            key={'Upcoming'}
            sort={sort}
            setSort={setSort}
            sortBy={sortBy}
            selectedProjectId={selectedProjectId}
            search={search}
            selectedTabId={selectedTabId}
          />
        )
      default:
        return (
          <ProjectToDos
            key={'Project'}
            sort={sort}
            setSort={setSort}
            sortBy={sortBy}
            search={search}
            selectedTabId={selectedTabId}
            selectedProjectId={selectedProjectId}
          />
        )
    }
  }

  return <>{switchRenderToDos(selectedTabId)}</>
}
