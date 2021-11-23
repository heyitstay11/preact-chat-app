import { useContext, useState } from 'preact/hooks';
import { createContext } from 'preact';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({name: '', room: ''});


    return <UserContext.Provider value={{
            user,
            setUser
    }} >
        { children }
    </UserContext.Provider>
}

const useUserContext = () => {
    return useContext(UserContext);
}

export {UserProvider, useUserContext}