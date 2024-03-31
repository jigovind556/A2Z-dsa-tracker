import React, { useEffect, useState } from 'react';
import DiffChecker from './components/common/DiffChecker.js'
import ultimateData from './components/common/ultimateData.js'
import { UserProvider } from './context/userContext.js'
import App from './App.jsx';
import { db } from './firebase.jsx';
import { doc, getDoc } from 'firebase/firestore';
import { set } from 'husky';

const Home = () => {
    // let fetchData = localStorage.getItem('A2Z_Archive')
    // fetchData = fetchData === null ? ultimateData : JSON.parse(fetchData)
    // fetchData = DiffChecker(ultimateData, fetchData)
    const [fetchData, setFetchData] = useState()
    const [user, setUser] = useState("")

    useEffect(()=>{
        if(user===""){
            checkUser();
        }
        else {
            checkData();
        }
    },[user])

    const checkUser= async ()=>{
        const udata= localStorage.getItem('user');
        if(udata!=null && udata!==""){
            setUser(JSON.parse(udata));
        }else{
            checkData();
        }
    }

    const checkData = async ()=>{
        let fetchData = ultimateData
        console.log("hello");
        try {
            if(user!=null &&  user!=="") {
                //fetch data from firebase cloud firestore
                const docRef = doc(db, 'data', user?.uid)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    fetchData = docSnap.data()
                    fetchData = DiffChecker(ultimateData, fetchData)
                    localStorage.setItem('A2Z_Archive', JSON.stringify(fetchData))
                    setFetchData(fetchData)
                }
                else{
                    fetchData = localStorage.getItem('A2Z_Archive')
                    fetchData = fetchData === null ? ultimateData : JSON.parse(fetchData)
                    fetchData = DiffChecker(ultimateData, fetchData)
                    setFetchData(fetchData)
                }
    
            }
            else{
                fetchData = localStorage.getItem('A2Z_Archive')
                fetchData = fetchData === null ? ultimateData : JSON.parse(fetchData)
                fetchData = DiffChecker(ultimateData, fetchData)
                setFetchData(fetchData)
            }
        } catch (error) {
            console.log("error fetching data from firebase");
            console.log(error);
            let fetchData = ultimateData
            fetchData = localStorage.getItem('A2Z_Archive')
            fetchData =
                fetchData === null ? ultimateData : JSON.parse(fetchData)
            fetchData = DiffChecker(ultimateData, fetchData)
            setFetchData(fetchData)
        }
        
    }


  return (
      <UserProvider value={{user,setUser}}>
          {fetchData? <App fetchData={fetchData} /> : <div>Loading...</div>}
      </UserProvider>
  )
}

export default Home;
