import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
} from '@mui/material'
import * as React from 'react'
import { Tabs } from '../../types/Tabs'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import TodayIcon from '@mui/icons-material/Today'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { GET_TODOS } from '../../graphql/queries'
import { useQuery } from '@apollo/client'
import {
  filteredToDosByUserId,
  filterInboxTodos,
  filterToDosByToday,
  filterToDosByUpcomingDueDate,
} from '../../Helpers'
import { useAuth0 } from '@auth0/auth0-react'

interface StandardListItemsProps {
  selectedTabId: string
  handleListItemClick: (_event: any, id: React.SetStateAction<string>) => void
}

export default function StandardListItems({
  selectedTabId,
  handleListItemClick,
}: StandardListItemsProps) {
  function renderSwitch(param: string) {
    switch (param) {
      case 'Home':
        return <HomeOutlinedIcon />
      case 'Inbox':
        return <InboxIcon />
      case 'Today':
        return <TodayIcon />
      case 'Upcoming':
        return <CalendarMonthIcon />
      default:
        undefined
    }
  }

  const { user } = useAuth0()

  const { loading, error, data } = useQuery(GET_TODOS)

  return (
    <>
      <ListItem key="home-list-item" disablePadding>
        <ListItemButton
          sx={{ height: 56 }}
          key="home-list-item-button"
          selected={selectedTabId === Tabs.HOME}
          onClick={(event) => handleListItemClick(event, Tabs.HOME)}
          className="rounded"
        >
          <ListItemIcon>{renderSwitch('Home')}</ListItemIcon>
          <ListItemText primary="Home" />
          {loading || error ? (
            <></>
          ) : (
            <Badge
              sx={{ mx: 2 }}
              badgeContent={filteredToDosByUserId(data.todos, user?.sub).length}
            ></Badge>
          )}
        </ListItemButton>
      </ListItem>
      <ListItem key="inbox-list-item" disablePadding>
        <ListItemButton
          sx={{ height: 56 }}
          key="inbox-list-item-button"
          selected={selectedTabId === Tabs.INBOX}
          onClick={(event) => handleListItemClick(event, Tabs.INBOX)}
          className="rounded"
        >
          <ListItemIcon>{renderSwitch('Inbox')}</ListItemIcon>
          <ListItemText primary="Inbox" />
          {loading || error ? (
            <></>
          ) : (
            <Badge
              sx={{ mx: 2 }}
              badgeContent={
                filterInboxTodos(filteredToDosByUserId(data.todos, user?.sub))
                  .length
              }
            ></Badge>
          )}
        </ListItemButton>
      </ListItem>
      <ListItem key="today-list-item" disablePadding>
        <ListItemButton
          sx={{ height: 56 }}
          key={'today-list-item-button'}
          selected={selectedTabId === Tabs.TODAY}
          onClick={(event) => handleListItemClick(event, Tabs.TODAY)}
          className="rounded"
        >
          <ListItemIcon>{renderSwitch('Today')}</ListItemIcon>
          <ListItemText primary="Today" />
          {loading || error ? (
            <></>
          ) : (
            <Badge
              sx={{ mx: 2 }}
              badgeContent={
                filterToDosByToday(filteredToDosByUserId(data.todos, user?.sub))
                  .length
              }
            ></Badge>
          )}
        </ListItemButton>
      </ListItem>
      <ListItem key="upcoming-list-item" disablePadding>
        <ListItemButton
          sx={{ height: 56 }}
          key={'upcoming-list-item-button'}
          selected={selectedTabId === Tabs.UPCOMING}
          onClick={(event) => handleListItemClick(event, Tabs.UPCOMING)}
          className="rounded"
        >
          <ListItemIcon>{renderSwitch('Upcoming')}</ListItemIcon>
          <ListItemText primary="Upcoming" />
          {loading || error ? (
            <></>
          ) : (
            <Badge
              sx={{ mx: 2 }}
              badgeContent={
                filterToDosByUpcomingDueDate(
                  filteredToDosByUserId(data.todos, user?.sub)
                ).length
              }
            ></Badge>
          )}
        </ListItemButton>
      </ListItem>
    </>
  )
}
