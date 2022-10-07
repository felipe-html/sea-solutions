import React from 'react'
import ReactDOM from 'react-dom/client'
import './global.scss'
import { Sections } from './pages/sections'
import { ChakraProvider } from '@chakra-ui/react'
import { SectorsProvider } from './hooks/useSectors'
import store from './redux/store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SectorsProvider>
      <ChakraProvider>
        <Sections />
      </ChakraProvider>
    </SectorsProvider>
  </React.StrictMode>
)
