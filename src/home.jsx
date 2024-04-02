import React, { useEffect, useState } from 'react'
import DiffChecker from './components/common/DiffChecker.js'
import ultimateData from './components/common/ultimateData.js'
import { UserProvider } from './context/userContext.js'
import App from './App.jsx'
import { db } from './firebase.jsx'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { LoadingProvider } from './context/loadingContext.js'
import { useToast } from '@chakra-ui/react'

const Home = () => {
    const [data, setData] = useState(null)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true) // New loading state
    const toast = useToast()

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('one')
                const localData = localStorage.getItem('A2Z_Archive')
                var tempUser = user;
                if (localData && !tempUser) {
                    console.log('two')
                    setUser(JSON.parse(localStorage.getItem('user')))
                    tempUser = JSON.parse(localStorage.getItem('user'))
                    // console.log(tempUser);
                }
                if (tempUser) {
                    console.log('three')
                    const docRef = doc(db, 'data', tempUser.uid)
                    const docSnap = await getDoc(docRef)
                    if (docSnap.exists()) {
                        console.log('four: data exists in firebase')
                        var tempData =  docSnap.data()
                        setData(tempData)
                    } else {
                        console.log('five: data does not exist in firebase')
                        if (localData) {
                            console.log('six: using local data')
                            setData(JSON.parse(localData))
                        }
                        else {
                            console.log('six: using ultimate data')
                            setData(ultimateData)
                        }
                    }
                }
                else{
                    console.log('seven: no user')
                    if (localData) {
                        console.log('eight: using local data')
                        setData(JSON.parse(localData))
                    }
                    else {
                        console.log('eight: using ultimate data')
                        setData(ultimateData)
                    }
                }
            } catch (error) {
                console.log('Error fetching data:', error)
            } finally {
                setLoading(false) // Set loading to false when fetch is complete
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
                toast({
                    title: 'Data Saved to firebase.',
                    // description: "We've created your account for you.",
                    status: 'success',
                    duration: 1200,
                    isClosable: true,
                })
            }
        }

        if (!loading) {
            // Only save to Firebase if loading is false
            const timeoutId = setTimeout(() => {
                // Call the API after a delay, only if there's been no change for 500ms
                saveToFirebase();
            }, 500)
            return () => clearTimeout(timeoutId)
        }
    }, [user, data, loading])

    return (
        <LoadingProvider value={{ loading, setLoading }}>
            <UserProvider value={{ user, setUser }}>
                {loading ? ( // Render loading message while fetching and setting data
                    <div>Loading...</div>
                ) : data ? (
                    <App data={data} setData={setData} />
                ) : (
                    <div>No data available</div>
                )}
            </UserProvider>
        </LoadingProvider>
    )
}

export default Home
