import './style.css';
import { useUserContext } from '../../context';
import Message from '../message';

const Chat = () => {
    const {user, messages, sendMessage, chatBox, editMode, sendDelete, editMessageText} = useUserContext();
    const handleSubmit =(e) => {
        e.preventDefault();
        const message = e.target.message.value.trim();
        if(message){
            e.target.message.value = '';
            sendMessage(message);
        }
    }
    return (
        <section class="mx-auto max-w-lg text-center px-2 py-4">
        <p  class="py-2 text-2xl">{ user.room ? `Room ~ ${user.room}` : 'No Room Joined' }</p>
        <div class="chat-wrapper bg-gray-100 my-4 mx-4 p-2 rounded-md">
            <div id="chatbox" ref={chatBox} class="min-h-250px max-h-250px overflow-y-auto chatbox" tabIndex="0" >
                {messages.length > 0 ? 
                    messages.map(message => {
                        const {user, id, text} = message;
                        return (
                            <Message  key={id} mKey={id} author={user} text={text} />
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
                <div class="flex flex-wrap">
                    <input name="message" id="inputmessage"  value={editMessageText ? editMessageText : ''} class="flex-grow text-xl pl-3 w-auto max-w-full" autoComplete='off'></input>
                    <button type="submit" id="send" class='button ml-auto' >{editMode === true ? 'EDIT' : 'SEND'}</button>
                    {editMode === true ? (
                       <button type="button" id="send" class='button' onClick={sendDelete} >Del</button>
                    ) : null}
                </div>
            </form>
        </div>
    </section>
    )
}

export default Chat;