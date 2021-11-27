import { createContext } from "preact";
import { useContext, useEffect, useRef, useState } from "preact/hooks";

const AlertContext = createContext();

const AlertProvider = ({ children }) => {
    const [alertMessage, setAlertMessage] = useState('');
    const alertRef = useRef();
    useEffect(() => {
        if(alertMessage !== '' && alertMessage){
            alertRef.current.focus();
        }
    }, [alertMessage])

    return (
        <AlertContext.Provider value={{
            alertMessage,
            alertRef,
            setAlertMessage,
        }}>
            { children }
        </AlertContext.Provider>
    )
}

const useAlertContext = () => {
    return useContext(AlertContext);
}

export { useAlertContext, AlertProvider }