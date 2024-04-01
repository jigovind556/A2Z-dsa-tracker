import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import DSA from './components/index.jsx'
import { Flex } from '@chakra-ui/react'
import { Reacteroids } from './components/NotFound/Reacteroids.jsx'
import useUser from './context/userContext.js'
import { doc, setDoc } from 'firebase/firestore'
import { db } from './firebase.jsx'

function App({ data, setData }) {
    
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <DSA
                        data={data}
                        setData={setData}
                        isHomeScreen={true}
                        selectedContentIndex={0}
                    />
                }
            />
            {data.data.content.map((contentData, index) => {
                return (
                    <Route
                        key={index}
                        path={contentData.contentPath}
                        element={
                            <DSA
                                data={data}
                                setData={setData}
                                isHomeScreen={false}
                                selectedContentIndex={index}
                            />
                        }
                    />
                )
            })}
            <Route
                path={'/play'}
                element={
                    <Flex w={'100vw'} h={'100vh'}>
                        <Reacteroids />
                    </Flex>
                }
            />
        </Routes>
    )
}

export default App
