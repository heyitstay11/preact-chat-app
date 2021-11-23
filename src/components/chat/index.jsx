import './style.css';
import { useUserContext } from '../../context';

const Chat = () => {
    const {user, messages, sendMessage, chatBox} = useUserContext();
    const handleSubmit =(e) => {
        e.preventDefault();
        const message = e.target.message.value;
        if(message){
            e.target.message.value = '';
            sendMessage(message);
        }
    }
    return (
        <div class="mx-auto max-w-lg text-center px-2 py-4">
        <p  class="py-2 text-2xl">{ user.room ? `Room ~ ${user.room}` : 'No Room Joined' }</p>
        <div class="chat-wrapper bg-gray-100 my-4 mx-4 p-2 rounded-md">
            <div id="chatbox" ref={chatBox} class="min-h-250px max-h-250px overflow-y-auto">
                {messages.length > 0 ? 
                    messages.map(message => {
                        const {user: author, id, text} = message;
                        return (
                        <div class={`flex flex-col ${author === user.name ? 'items-end cursor-pointer' : 'items-start' } items-start p-2`} key={id} >
                            <span class="author">{author}</span>
                            <span class="text-lg max-w-90 overflow-x-hidden break-word">{text}</span>
                        </div>
                        )
                    })
                 : (
                <>
                  <div class="flex flex-col items-start p-2">
                        <span class="author">admin</span>
                        <span class="text-lg">You are connected</span>
                  </div>
                  <div class="flex flex-col items-end p-2">
                        <span class="author">mike444</span>
                        <span class="text-lg">Hey</span>
                  </div>
                  <div class="flex flex-col items-start p-2">
                        <span class="author">john123</span>
                        <span class="text-lg">Lorem ipsum dolor sit</span>
                  </div>
                </>
                )
                }
            </div>
            <form id="message-form" onSubmit={handleSubmit} class="flex flex-col">
                <label for="message" class="text-left text-lg mb-1">Message:</label>
                <div class="flex">
                    <input name="message" id="inputmessage" class="flex-1 text-xl pl-3" autoComplete='off'></input>
                    <button type="submit" id="send" class='button' >Send</button>
                </div>
            </form>
        </div>
    </div>
    )
}

export default Chat;