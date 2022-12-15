import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import TextField from '@mui/material/TextField'
import AddIcon from '@mui/icons-material/Add'
import SortIcon from '@mui/icons-material/Sort'
import Icon from '@mdi/react'
import Typography from '@mui/material/Typography'
import { mdiFormatListChecks } from '@mdi/js'
import Box from '@mui/material/Box'
import {
  AppBar,
  Avatar,
  Button,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material'
import { useState } from 'react'
import SideBar from '../sidebar/SideBar'
import { Tabs } from '../../types/Tabs'
import { useAuth0 } from '@auth0/auth0-react'
import Popover from '@mui/material/Popover'

export default function NavBar() {
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [open, setOpenDrawer] = useState(true)
  const [search, setSearch] = useState<string | null>('')
  const [selectedTabId, setSelectedTabId] = useState(Tabs.HOME.toString())
  const [sortBy, setSortBy] = useState('priority')
  const [sort, setSort] = useState(true)
  const { logout, user } = useAuth0()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const openPopOver = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const id = openPopOver ? 'logout-popover' : undefined

  const handleDrawer = () => {
    setOpenDrawer(!open)
  }

  const handleTabs = (id: string) => {
    setSelectedTabId(id)
  }

  const handleChange = (event: SelectChangeEvent) => {
    setSort(true)
    setSortBy(event.target.value)
  }

  return (
    <>
      <AppBar
        sx={{ color: 'rgb(71 85 105)', zIndex: 1250 }}
        className="flex h-[72px] w-screen flex-row items-center bg-slate-500 pl-4 shadow-lg shadow-slate-600/40"
      >
        <Box className="flex flex-row gap-2">
          <IconButton aria-label="menu" onClick={handleDrawer}>
            <MenuIcon />
          </IconButton>
          <IconButton
            aria-label="home"
            onClick={() => handleTabs(Tabs.HOME.toString())}
          >
            <HomeOutlinedIcon />
          </IconButton>
          <TextField
            value={search}
            onChange={(e) => {
              let newSearch = e.target.value
              setSearch(newSearch)
            }}
            placeholder="Search..."
            size="small"
            className="mx-2 rounded bg-slate-100"
            id="search-todo"
            sx={{ width: 300 }}
          />
        </Box>
        <Box className="flex flex-1"></Box>
        <Box className="flex flex-row items-center gap-2">
          <IconButton onClick={() => setSort(true)}>
            <SortIcon />
          </IconButton>
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <Select
              size="small"
              className="mx-2 rounded bg-slate-100"
              value={sortBy}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'sortBy' }}
            >
              <MenuItem value={'priority'}>Priority</MenuItem>
              <MenuItem value={'todos-a-z'}>Todos A-Z</MenuItem>
              <MenuItem value={'todos-z-a'}>Todos Z-A</MenuItem>
              <MenuItem value={'due-date-soonest'}>Due date soonest</MenuItem>
              <MenuItem value={'due-date-latest'}>Due date latest</MenuItem>
              <MenuItem value={'projects-a-z'}>Projects A-Z</MenuItem>
              <MenuItem value={'projects-z-a'}>Projects Z-A</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Add todo">
            <IconButton
              aria-label="addToDo"
              onClick={() => setIsOpenDialog(true)}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <IconButton aria-label="user" onClick={handleClick}>
            <Avatar
              sx={{ width: 24, height: 24 }}
              src={user?.picture}
              alt={user?.name}
            />
          </IconButton>
          <Popover
            id={id}
            open={openPopOver}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Button
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Log out
            </Button>
          </Popover>
          <Box className="color flex h-[72px] w-[200px] flex-row items-center justify-center gap-2 bg-slate-300 px-4">
            <Icon path={mdiFormatListChecks} size={1.5} />
            <Typography className="text-2xl font-semibold">Todo</Typography>
          </Box>
        </Box>
      </AppBar>
      <SideBar
        setSort={setSort}
        sort={sort}
        sortBy={sortBy}
        selectedTabId={selectedTabId}
        setSelectedTabId={setSelectedTabId}
        search={search}
        open={open}
        isOpen={isOpenDialog}
        onClose={() => setIsOpenDialog(false)}
      />
    </>
  )
}
