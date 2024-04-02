import React from 'react'
import {
    CircularProgress,
    CircularProgressLabel,
    Flex,
    Img,
    Text,
} from '@chakra-ui/react'
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import useUser from '../../context/userContext'
import ultimateData from '../common/ultimateData'
import useLoading from '../../context/loadingContext'

const Auth = ({ data, setData }) => {
    const isDarkMode = data.data.header.darkMode
    const { user, setUser } = useUser()

    const {loading, setLoading} = useLoading();
    async function onGoogleClick() {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const tempUser = result.user

            const docRef = doc(db, 'users', tempUser.uid)
            const docSnap = await getDoc(docRef)
            const currUser = {
                name: tempUser.displayName,
                email: tempUser.email,
                timestamp: serverTimestamp(),
                image: tempUser.photoURL,
                uid: tempUser.uid,
            }

            if (!docSnap.exists()) {
                await setDoc(docRef, currUser)
            }
            setLoading(true)
            localStorage.setItem('user', JSON.stringify(currUser))
            setUser(currUser)
        } catch (error) {
            console.log('Google authentication failed!')
            console.log(error)
        }
    }

    function onLogOut() {
        const auth = getAuth()

        if (user) {
            signOut(auth)
                .then(() => {
                    setLoading(true)
                    localStorage.removeItem('user')
                    localStorage.removeItem('A2Z_Archive')
                    setUser(null)
                    setData(ultimateData)
                })
                .catch(error => {
                    console.error('Sign out failed:', error)
                })
        }
    }

    return (
        <div>
            {user ? (
                <Flex
                    px={6}
                    mt={4}
                    flexDirection={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <div>
                        <Img
                            mr={5}
                            src={user.image}
                            ml={6}
                            w={10}
                            h={10}
                            borderRadius={'50%'}
                        />
                    </div>

                    <Text
                        w={'fit-content'}
                        h={'fit-content'}
                        ml={6}
                        px={4}
                        py={1}
                        bg={isDarkMode ? 'startNowBg_dark' : 'startNowBg'}
                        borderRadius={'16px'}
                        fontWeight={'md'}
                        fontSize={'xs'}
                        fontFamily={'customFamily'}
                        fontStyle={'normal'}
                        color={'secondaryColor'}
                        cursor={'pointer'}
                        whiteSpace={'nowrap'}
                        onClick={onLogOut}
                    >
                        Sign out
                    </Text>
                </Flex>
            ) : (
                <Text
                    w={'fit-content'}
                    h={'fit-content'}
                    ml={6}
                    px={4}
                    py={1}
                    bg={isDarkMode ? 'startNowBg_dark' : 'startNowBg'}
                    borderRadius={'16px'}
                    fontWeight={'md'}
                    fontSize={'xs'}
                    fontFamily={'customFamily'}
                    fontStyle={'normal'}
                    color={'secondaryColor'}
                    cursor={'pointer'}
                    whiteSpace={'nowrap'}
                    onClick={onGoogleClick}
                >
                    Login
                </Text>
            )}
        </div>
    )
}

export default Auth
