import React, { useEffect, useState } from 'react'
import DiffChecker from './components/common/DiffChecker.js'
import ultimateData from './components/common/ultimateData.js'
import { UserProvider } from './context/userContext.js'
import App from './App.jsx'
import { db } from './firebase.jsx'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const Home = () => {
    const [data, setData] = useState(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('one')
                const localData = localStorage.getItem('A2Z_Archive')
                if (localData && !user) {
                    console.log('two')
                    setUser(JSON.parse(localStorage.getItem('user')))
                }
                if (user) {
                    console.log('three')
                    const docRef = doc(db, 'data', user.uid)
                    const docSnap = await getDoc(docRef)
                    if (docSnap.exists()) {
                        console.log('four: data exists in firebase')
                        setData(docSnap.data())
                    } else {
                        console.log('five: data does not exist in firebase')
                        if (localData) {
                            console.log('six: using local data')
                            setData(JSON.parse(localData))
                        }
                    }
                }
            } catch (error) {
                console.log('Error fetching data:', error)
            }
        }

        fetchData()
    }, [user])

    useEffect(() => {
        const saveToLocalStorage = () => {
            if (data) {
                console.log('seven: saving data to local storage')
                localStorage.setItem('A2Z_Archive', JSON.stringify(data))
            }
        }

        saveToLocalStorage()
    }, [data])

    useEffect(() => {
        const saveToFirebase = async () => {
            if (user && data) {
                console.log('eight: saving data to firebase')
                const docRef = doc(db, 'data', user.uid)
                await setDoc(docRef, data)
            }
        }

        saveToFirebase()
    }, [user, data])

    return (
        <UserProvider value={{ user, setUser }}>
            {data ? (
                <App data={data} setData={setData} />
            ) : (
                <div>Loading...</div>
            )}
        </UserProvider>
    )
}

export default Home
