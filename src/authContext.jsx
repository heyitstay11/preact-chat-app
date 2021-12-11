import { createContext } from 'preact';
import { useState, useContext} from 'preact/hooks';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({token: '', email: '', name: ''});
    
    return(
        <AuthContext.Provider value={{
            user,
            setUser,
        }}>
            { children }
        </AuthContext.Provider>
    )
}

const useAuthContext = () => {
    return useContext(AuthContext);
}

export { useAuthContext, AuthProvider }