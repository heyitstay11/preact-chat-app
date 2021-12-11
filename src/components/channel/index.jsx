import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { useAuthContext } from "../../authContext";
import { nanoid } from "nanoid";
import { useUserContext } from "../../context";

const Channel = ({ id }) => {
    const { socket } = useUserContext();
    const { user } = useAuthContext();
    const [channelData, setChannelData] = useState('');
    const [messages, setMessages] = useState([]);
    const chatBox = useRef(null);

    const joinRoom = useCallback(() => {
        socket.emit('p-join', {id}, cb => {
            console.log('joined');
        });
    });


    const fetchMessages = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/message/${id}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': user.token
                }
            });
            const data = await res.json();
            if(res.status === 200){
                setMessages(data.messages);
                joinRoom();
            }
        } catch (error) {
            console.log(error);
        }
    }
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const msg = e.target.message.value.trim();
        if(!msg) return
        e.target.message.value = '';
        const  msg_id = 'id-' + nanoid(10);
        socket.emit('p-newMessage', 
          {roomId: id, sender: user.name, text: msg, msg_id},
          (cb) => {
            console.log(msg, 'sent');
          });
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/message`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': user.token
                },
                body: JSON.stringify({
                    channelId: id, 
                    sender: user.name, 
                    text: msg,
                    msg_id,
                })
            });
            const data = await res.json();
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/channel/${id}`);
            const data = await res.json();
            const title = data.channel.title.replace(user.name,'');
            setChannelData(title);
        } catch (error) {
            console.log(error);
        }
    },[user, id]);


    useEffect(() => {
        fetchMessages();
        if(socket){
            socket.on('p-message', ({sender, text, msg_id}) => {
                setMessages(prevMessages => [...prevMessages, {sender, text, msg_id}]);
            });
        }
        return () => {
            if(socket){
                socket.emit('p-leave', {id}, cb => {});
            }
        }
    }, [user]);

    useEffect(() => {
        if(chatBox.current){
            chatBox.current.scrollTop = chatBox.current.scrollHeight;
        }
    }, [messages]);

    return (
        <>
        <h1 class="text-center my-4 text-2xl">{channelData}</h1>
        <div class="chat-wrapper w-min-92/100 sm:w-max-xl  mx-auto bg-gray-100 my-4 p-2 rounded-md">
        <div id="chatbox" ref={chatBox} 
         class="min-h-250px max-h-250px overflow-y-auto scrollbar scrollbar-thumb-purple-700 hover:scrollbar-thumb-purple-900 chatbox" tabIndex="0" >
           {messages.length > 0 ? 
            messages.map((message) => {
                const {sender, text, msg_id} = message;
                const myMessage = user.name === sender;
                return <div key={msg_id} tabIndex={`${ myMessage ? '0' : '-1' }`}
                class={`flex flex-col ${myMessage ? 'items-end cursor-pointer' : 'items-start' } items-start p-2`} >
                   <span class="author">{sender}</span>
                   <span class="text-lg max-w-90 overflow-x-hidden break-word">{text}</span>
               </div>
            })
            : 
            (<div class="flex flex-col items-start p-2">
                <span class="author">admin</span>
                <span class="text-lg">No messages</span>
            </div>)}
        </div>
        <form id="message-form" onSubmit={handleSubmit} class="flex flex-col">
            <label for="message" class="text-left text-lg mb-1">Message:</label>
            <div class="flex flex-wrap">
                <input name="message" id="message" class="flex-grow text-xl pl-3 w-auto max-w-full" autoComplete='off'></input>
                <button type="submit" id="send" class='button ml-auto' > SEND</button>
                {/* {editMode === true ? (
                   <button type="button" id="send" class='button'  >Del</button>
                ) : null} */}
            </div>
        </form>
    </div>
    </>
    )
}

export default Channel;