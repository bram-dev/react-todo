import * as React from 'react'
import NavBar from './components/navbar/NavBar'
import { useAuth0 } from '@auth0/auth0-react'
import { Box, Button, Container, Typography } from '@mui/material'
import { mdiFormatListChecks } from '@mdi/js'
import Icon from '@mdi/react'
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0()

  return (
    <Button size="large" onClick={() => loginWithRedirect()}>
      Log In
    </Button>
  )
}

const Login = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()

  if (isLoading) {
    return <div>Loading ...</div>
  }

  if (isAuthenticated) {
    const authLink = setContext(async (_, { headers }) => {
      const token = await getAccessTokenSilently()
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
        },
      }
    })

    const httpLink = createHttpLink({
      uri: 'https://starfish-app-f7eub.ondigitalocean.app/graphql',
    })

    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    })

    return (
      isAuthenticated && (
        <>
          <ApolloProvider client={client}>
            <NavBar />
          </ApolloProvider>
        </>
      )
    )
  } else {
    return (
      <Container className="flex h-screen w-screen flex-col items-center justify-center">
        <Box>
          <Typography className="text-5xl font-semibold">Todo</Typography>
          <Icon path={mdiFormatListChecks} size={5} />
        </Box>
        <Box>
          <LoginButton />
        </Box>
      </Container>
    )
  }
}

export default function App() {
  return (
    <>
      <Login />
    </>
  )
}
