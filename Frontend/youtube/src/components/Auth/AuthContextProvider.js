import React, { createContext, useEffect, useState } from 'react'


export const AuthContext = createContext(false);

export const AuthContextProvider = (props) =>{
  const [auth, setAuth] = useState();

  useEffect(() => {
    const currentUser = window.localStorage.getItem("CurrentUser");
    if (currentUser) {
        setAuth(true);
    }
    else {
        setAuth(false);
    }
}, [])
    
    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {props.children}
        </AuthContext.Provider>
    )
}



