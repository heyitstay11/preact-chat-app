import './style.css';

const Chat = ({user}) => {
    
    console.log(user);

    return (
        <div class="mx-auto max-w-lg text-center px-2 py-4">
        <p  class="py-2 text-2xl">No Room Joined</p>
        <div class="chat-wrapper bg-gray-100 my-4 mx-4 p-2 rounded-md">
            <div id="chatbox" class="min-h-250px max-h-250px overflow-y-auto">
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
            </div>
            <form id="message-form" class="flex flex-col">
                <label for="message" class="text-left text-lg mb-1">Message:</label>
                <div class="flex">
                    <textarea name="message" id="inputmessage" rows="1" class="flex-1 text-xl resize-none"></textarea>
                    <button type="submit" id="send" class='button' >Send</button>
                </div>
            </form>
        </div>
    </div>
    )
}

export default Chat;