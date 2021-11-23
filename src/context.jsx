import { useContext, useState, useEffect, useRef } from 'preact/hooks';
import { createContext } from 'preact';
import { io } from 'socket.io-client';

const UserContext = createContext();

const UserProvider = ({ children }) => {
   const [user, setUser] = useState({name: '', room: ''});
   const [messages, setMessages] = useState([]);
   const chatBox = useRef(null);

   const socket = io('http://localhost:5000/');

    useEffect(() => {
        if(user.name && user.room){
            joinRoom();
        }
    }, [user]);

    useEffect(() => {
        if(chatBox.current){
            chatBox.current.scrollTop = chatBox.current.scrollHeight;
        }
    }, [messages])

   socket.on('message', ({ user, text, id = (Math.random() * 1000).toString() }) => {
        setMessages((prevMessages) => [...prevMessages, {user, text, id}]);
   })

   const joinRoom = () => {
     socket.emit('join', {name : user.name, room: user.room}, (cb) => {
       if(cb.error){
          return console.log(cb.error);
       }
       if(cb.status === 'joined'){
          console.log('Joined Successfully');
       } 
     });
   }

   const sendMessage = (message) => {
        socket.emit('newMessage', {username: user.name, room: user.room, text: message}, (cb) => {
            if(cb && cb.error){
                return console.log(cb.error);
            }
        })
   };
   

    return <UserContext.Provider value={{
            user,
            messages,
            chatBox,
            setUser,
            sendMessage,
    }} >
        { children }
    </UserContext.Provider>
}

const useUserContext = () => {
    return useContext(UserContext);
}

export {UserProvider, useUserContext}