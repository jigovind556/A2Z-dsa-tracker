import React from 'react';
import {
    CircularProgress,
    CircularProgressLabel,
    Flex,
    Img,
    Text,
} from '@chakra-ui/react'

// import {FcGoogle} from 'react-icons/fc'
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { toast } from 'react-toastify';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
// import { db } from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import useUser from '../../context/userContext';
import { set } from 'husky';

const Auth = ({data}) => {
    const isDarkMode = data.data.header.darkMode;
    const navigate = useNavigate()
    const { user, setUser } = useUser()
    async function onGoogleClick() {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const tempUser = result.user
            console.log(tempUser)
            //cheak if user already existed or not
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
                await setDoc(docRef,currUser)
            }
            setUser(currUser)
            localStorage.setItem('user', JSON.stringify(currUser));

            //home page navigation after authencticaitn
            // navigate('/')
        } catch (error) {
            // toast.error('Google authentication failed!')
            console.log('Google authentication failed!');
            console.log(error)
        }
    }
  return (
      <div>
          {(user!=null && user!="" )?
          <div>
            <Img src={user.image} ml={6} w={10} h={10} borderRadius={'50%'} />
          </div>
          :<Text
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
          </Text>}
      </div>
  )
}

export default Auth;



//  function Oauth() {
//   const navigate = useNavigate();
//   async function onGoogleClick(){
//     try {
      
//       const auth = getAuth();
//       const provider  = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth , provider);
//       const user  = result.user;
//       console.log(user);
//       //cheak if user already existed or not
//       const docRef = doc(db , "users" , user.uid);
//       const docSnap = await getDoc(docRef);

//       if(!docSnap.exists()){
//         await setDoc(docRef , {
//           name : user.displayName,
//           email : user.email,
//           timestamp : serverTimestamp()
//         })
//       }
//       //home page navigation after authencticaitn
//       navigate("/")

//     } 
//     catch (error) {
//       toast.error('Google authentication failed!');
//       console.log(error);
//     }
//   }
//   return (
    

//     <div>
//       <button type="button"
//       onClick={onGoogleClick} className='flex items-center 
//       justify-center w-full
//       bg-red-700 text-white
//       px-7 py-3 uppercase
//       hover:bg-red-800 
//       active:bg-red-900
//       hover:shadow-lg
//       active:shadow-lg
//       transition duration-150
//       ease-in-out rounded'>
//         <FcGoogle className='text-2xl
//         bg-white
//         rounded-full mr-2'/>
//         Continue with Google
//       </button>
//     </div>
//   )
// }