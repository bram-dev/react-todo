import * as React from 'react'
import { createRoot } from 'react-dom/client'
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Auth0Provider } from '@auth0/auth0-react'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDD9F8rRZZlHqniDuXWpobz4ZJjwDxqeOw",
  authDomain: "todo-app-ab54d.firebaseapp.com",
  projectId: "todo-app-ab54d",
  storageBucket: "todo-app-ab54d.appspot.com",
  messagingSenderId: "864788718892",
  appId: "1:864788718892:web:dc79189e34370908a87889",
  measurementId: "G-089VQ7469M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const rootElement = document.getElementById('root')
const root = createRoot(rootElement!)

// All `Portal`-related components need to have the the main app wrapper element as a container
// so that the are in the subtree under the element used in the `important` option of the Tailwind's config.
const theme = createTheme({
  components: {
    MuiPopover: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiPopper: {
      defaultProps: {
        container: rootElement,
      },
    },
  },
})

root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Auth0Provider
          domain="dev-06yve6iho8mtkmrl.us.auth0.com"
          clientId="v9t0BJ7EOWXWZy24qkVMdOr0RewMeSTg"
          redirectUri={window.location.origin}
          audience="https://starfish-app-f7eub.ondigitalocean.app/graphql"
        >
          <App />
        </Auth0Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
