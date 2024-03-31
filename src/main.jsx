import { ChakraProvider } from '@chakra-ui/react'
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import chakraTheme from './chakraTheme.js'

import Home from './home.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
            <ChakraProvider theme={chakraTheme}>
                <BrowserRouter>
                    <Home/>
                </BrowserRouter>
            </ChakraProvider>
    </React.StrictMode>
)
