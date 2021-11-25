import { useContext, useState, useEffect, useRef } from 'preact/hooks';
import { createContext } from 'preact';
import { io } from 'socket.io-client';
const UserContext = createContext();
let socket;

const UserProvider = ({ children }) => {
   const [user, setUser] = useState({name: '', room: ''});
   const [editMode, setEditMode] = useState(false);
   const [editKey, setEditKey] = useState(false);
   const [editMessageText, setEditMessageText] = useState('');
   const [messages, setMessages] = useState([]);
   const chatBox = useRef(null);

   useEffect(() => {
     socket = io('https://abchatt.herokuapp.com/');

     socket.on('message', ({ user, text, id = (Math.random() * 1000).toString()}) => {
        setMessages((prevMessages) => [...prevMessages, {user, text, id}]);
     })

    socket.on('deleteMessage', ({id}) => {
        deleteMessage(id);
    });
     
    socket.on('editMessage', ({user, text, id}) => {
        editMessage(user, text, id);
    });

    socket.on('chatHistory', ({ messages }) => {
        setMessages((prevMessages) => [
        ...messages, 
        {user: '---   CHAT HISTORY   ---', text: '', id: 'chat-history' },
        ...prevMessages
    ]);});
   },[])

    useEffect(() => {
        if(user.name && user.room && socket){
            joinRoom();
        }
    }, [user.room]);

    useEffect(() => {
        if(chatBox.current){
            chatBox.current.scrollTop = chatBox.current.scrollHeight;
        }
    }, [messages]);

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

   const resetMode = () => {
    setEditKey(false);
    setEditMode(false);
    setEditMessageText('');
   }

   const sendMessage = (message) => {
       if(editKey && editMode){
            socket.emit('newEditMessage', 
            {username: user.name, room: user.room, text: message, id: editKey},
             (cb) => {
                if(cb && cb.error){
                    return console.log(cb.error);
                }});
                return resetMode();
       }
        socket.emit('newMessage', {username: user.name, room: user.room, text: message}, (cb) => {
            if(cb && cb.error){
                return console.log(cb.error);
            }
        })
   };

   const editMessage = (user, text, id) => {
       return setMessages((prevMessages) => {
           return prevMessages.map((message) => {
               if(message.id === id){
                   return {user, text, id};
               }
               return message;
           });
       });
   }

   const deleteMessage = (id) => {
       setMessages((prevMessages) => {
           return prevMessages.filter(message => message.id !== id)
       });
   }

   const sendDelete = () => {
    if(!editKey || !editMode ) return
    socket.emit('sendDelete', {id: editKey, room: user.room }, (cb) => {
        if(cb && cb.error){
            return console.log(cb.error);
        }
        resetMode();
    });
   }
   

    return <UserContext.Provider value={{
            user,
            messages,
            chatBox,
            editMode,
            editMessageText,
            setUser,
            sendMessage,
            setEditKey,
            setEditMode,
            sendDelete,
            setEditMessageText
    }} >
        { children }
    </UserContext.Provider>
}

const useUserContext = () => {
    return useContext(UserContext);
}

export {UserProvider, useUserContext}