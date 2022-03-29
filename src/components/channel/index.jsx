import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { useAuthContext } from "../../authContext";
import { nanoid } from "nanoid";
import { useUserContext } from "../../context";
import Peer from 'vite-compatible-simple-peer';

const Channel = ({ id }) => {
    const { socket, setCall, call } = useUserContext();
    const { user } = useAuthContext();
    const [channelData, setChannelData] = useState('');
    const [messages, setMessages] = useState([]);
    const [isOnline, setIsOnline]= useState(false);
    const chatBox = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stream, setStream] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const myVideo = useRef(null);
    const userVideo = useRef(null); 
    const connectionRef = useRef(null);

    const joinRoom = useCallback(() => {
        socket.emit('p-join', {id, user : user.name}, cb => {});
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

    const callUser = () => {

        // create peer connection
        const peer = new Peer({ initiator: true, trickle: false, stream});

        // on recieving signal
        peer.on('signal', (data) => {
            socket.emit('call-user', {id, signalData: data, sender : user.name});
        });

        // on recieving stream
        peer.on('stream', (currentStream) => {
            console.log('recieving stream');
            userVideo.current.srcObject = currentStream;
        });

        socket.on('call-accepted', ({signal}) => {
            console.log('call-accepted', signal);
            setCallAccepted(true); 
 
            peer.signal(signal);
        });

        connectionRef.current = peer;
        console.log('inside-call', socket);
        setIsModalOpen(true);
    }

    const answerCall = () => {
        setCallAccepted(true);
        setIsModalOpen(true);

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit('answer-call', {signal: data, id, senderId : call.senderId});
        });

        peer.on('stream', (currentStream) => {
            console.log('recieving stream');
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal);
        console.log(call.signal);

        connectionRef.current = peer;
    }

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
        window.location.reload();
    }

    const handleCall = () => {
        if(call?.isReceivingCall){
            return answerCall();
        }
        callUser();
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

            socket.on('is-online', ({ user }) => {
                if(user){
                    setIsOnline(true); 
                    socket.emit('ack', {id, user}, cb => {});
                }
            });

            socket.on('is-online-ack', ({ user }) => {
                if(user){
                    setIsOnline(true);
                }

            });

            socket.on('call-user', ({signal, sender, senderId }) => {
                console.log(sender, senderId);
                setCall({ isReceivingCall: true, sender, signal, senderId });
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

    useEffect(() => {
      
            navigator.mediaDevices.getUserMedia(
                {video: true, audio: true}
            ).then((myStream) => {
                setStream(myStream);
                myVideo.current.srcObject = myStream;
                console.log('Video streaming', myStream);
            }).catch((err) => console.log('Video Failed'));
       
    }, [isModalOpen]);


    return (
        <>
        <h1 class="text-center my-4 text-2xl">{channelData} {isOnline ? 'Online' : null}</h1>
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
    {isOnline ?
    <div className="flex align-center">
        <button onClick={handleCall} class="inline-flex m-auto text-white bg-purple-700 border-0 py-3 px-7 focus:outline-none hover:bg-purple-600 rounded text-lg button">
            {call?.isReceivingCall ? 'Answer Call' : 'Start a video call'}
        </button>
    </div>
    : null}

    {
        isModalOpen ? 
        (<div className="container mx-auto flex gap-10 px-5 py-20 md:flex-row justify-between flex-col items-center w-7/9">
       
            <video playsInline muted ref={myVideo} autoPlay height={300} width={300}  />
            {callAccepted && ( <video playsInline ref={userVideo} autoPlay height={300} width={300} />)}

        </div>)
        : 
        null
    }
       
    </>
    )
}

export default Channel;