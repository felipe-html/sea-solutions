import React from 'react'
import ReactDOM from 'react-dom/client'
import './global.scss'
import { Sections } from './pages/sections'
import { ChakraProvider } from '@chakra-ui/react'
import { SectorsProvider } from './hooks/useSectors'
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux'
import store from './redux/store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SectorsProvider>
      <ChakraProvider>
        <BrowserRouter>
          <Provider store={store}>
            <Sections />
          </Provider>
        </BrowserRouter>
      </ChakraProvider>
    </SectorsProvider>
  </React.StrictMode>
)
