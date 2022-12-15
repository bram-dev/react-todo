import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import CssBaseline from '@mui/material/CssBaseline'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import FolderIcon from '@mui/icons-material/Folder'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import MainContent from '../main/MainContent'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import AddToDoModal from '../navbar/AddToDoModal'
import { useMutation, useQuery } from '@apollo/client'
import { ProjectListItem } from './ProjectListItem'
import { GET_PROJECTS } from '../../graphql/queries'
import { CREATE_PROJECT } from '../../graphql/mutations'
import StandardListItems from './StandardListItems'
import { Project } from '../../types/Project'
import { Tabs } from '../../types/Tabs'
import { useAuth0 } from '@auth0/auth0-react'
import { filteredProjectsByUserId } from '../../Helpers'

const drawerWidth = 400

interface SideBarProps {
  selectedTabId: string
  search: string | null
  open: boolean
  isOpen: boolean
  onClose: () => void
  setSelectedTabId: React.Dispatch<React.SetStateAction<string>>
  sortBy: string
  sort: boolean
  setSort: React.Dispatch<React.SetStateAction<boolean>>
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  paddingTop: 0,
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  paddingTop: 72,
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}))

export default function SideBar({
  open,
  isOpen,
  onClose,
  search,
  selectedTabId,
  setSelectedTabId,
  sortBy,
  sort,
  setSort,
}: SideBarProps) {
  const [createProject] = useMutation(CREATE_PROJECT, {
    refetchQueries: [{ query: GET_PROJECTS }],
  })
  const { loading, error, data } = useQuery(GET_PROJECTS)

  const { user } = useAuth0()

  const [openProject, setOpenProject] = useState(true)
  const [selectedProjectId, setSelectedProjectId] = useState('')

  const handleClick = () => {
    setOpenProject(!openProject)
  }

  let emptyProject = {
    label: '',
    saved: false,
    user_id: user?.sub,
  }

  const handleListItemClick = (
    _event: any,
    id: React.SetStateAction<string>
  ) => {
    setSelectedTabId(id)
    if (id != Tabs.INBOX && Tabs.TODAY && Tabs.UPCOMING) {
      setSelectedProjectId(id)
    } else {
      setSelectedProjectId('')
    }
  }

  if (loading) return <></>
  if (error) return <></>

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <CssBaseline />
        <Main open={open} className="flex flex-col items-center">
          <Box className="w-full max-w-5xl">
            <DrawerHeader />
            <MainContent
              setSort={setSort}
              sort={sort}
              sortBy={sortBy}
              search={search}
              selectedProjectId={selectedProjectId}
              selectedTabId={selectedTabId}
            />
          </Box>
        </Main>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader />
          <Box>
            <List
              sx={{
                // selected and (selected + hover) states
                '&& .Mui-selected, && .Mui-selected:hover': {
                  bgcolor: 'rgb(148 163 184)',
                },
                // hover states
                '& .MuiListItemButton-root:hover': {
                  bgcolor: 'rgb(203 213 225)',
                },
              }}
              className="mx-4 py-4"
            >
              <StandardListItems
                selectedTabId={selectedTabId}
                handleListItemClick={handleListItemClick}
              />
            </List>
            <Divider />
            <List
              sx={{
                // selected and (selected + hover) states
                '&& .Mui-selected, && .Mui-selected:hover': {
                  bgcolor: 'rgb(148 163 184)',
                },
                // hover states
                '& .MuiListItemButton-root:hover': {
                  bgcolor: 'rgb(203 213 225)',
                },
              }}
              className="mx-4 py-4"
            >
              <ListItem key={'project-list-item'}>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText primary="Project" />
                <IconButton
                  aria-label="addProject"
                  onClick={() => {
                    createProject({
                      variables: {
                        createProjectInput: {
                          ...emptyProject,
                        },
                      },
                    })
                  }}
                >
                  <AddIcon />
                </IconButton>
                <IconButton onClick={handleClick}>
                  {openProject ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </IconButton>
              </ListItem>
              <Collapse in={openProject} timeout="auto" unmountOnExit>
                <List sx={{ width: '100%' }} component="div" disablePadding>
                  {filteredProjectsByUserId(data.projects, user?.sub).map(
                    (project: Project) => (
                      <ProjectListItem
                        key={project.id}
                        project={project}
                        selectedTabId={selectedTabId}
                        selectedProjectId={selectedProjectId}
                        handleListItemClick={handleListItemClick}
                      />
                    )
                  )}
                </List>
              </Collapse>
            </List>
          </Box>
        </Drawer>
      </Box>
      <AddToDoModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export interface ProjectListItemProps {
  selectedTabId: string
  selectedProjectId: string
  project: Project
  handleListItemClick: (_event: any, id: React.SetStateAction<string>) => void
}
