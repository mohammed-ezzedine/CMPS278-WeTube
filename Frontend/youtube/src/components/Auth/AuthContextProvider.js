import React, { createContext, useEffect, useState } from 'react'


export const AuthContext = createContext();

export const AuthContextProvider = (props) =>{
  const [auth, setAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState(JSON.parse(window.localStorage.getItem("CurrentUser")));
  
  useEffect(() => {
    if (currentUser) {
        setAuth(true);
    }
    else {
        setAuth(false);
    }
}, [currentUser])
    
    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {props.children}
        </AuthContext.Provider>
    )
}



