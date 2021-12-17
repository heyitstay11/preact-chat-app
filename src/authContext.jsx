import { createContext } from 'preact';
import { useState, useEffect, useContext, useCallback} from 'preact/hooks';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({token: '', email: '', name: ''});
    const [channels, setChannels] = useState([]);


    const fetchChannels = useCallback(async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_BASE_URL}/channel/user/${user.id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-Auth-Token': user.token
            }
          });
          const data = await res.json();
          if(res.status === 200){
            setChannels([...data.channels]);
          }else{
            console.log(data);
          }
        } catch (error) {
          console.log(error);
        }
      });


      useEffect(async () => {
        if(user.id){
          fetchChannels();
        } 
      }, [user]);
    

    return(
        <AuthContext.Provider value={{
            user,
            setUser,
            channels,
            fetchChannels,
        }}>
            { children }
        </AuthContext.Provider>
    )
}

const useAuthContext = () => {
    return useContext(AuthContext);
}

export { useAuthContext, AuthProvider }