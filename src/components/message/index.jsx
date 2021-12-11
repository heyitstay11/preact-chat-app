import { useUserContext } from '../../context';

const Message = ({author, text, mKey}) => {
    const { user, setEditKey , setEditMode, setEditMessageText} = useUserContext();

    const handleSelect = () => {
        setEditKey(mKey);
        setEditMode(true);
        setEditMessageText(() => text);
    }

    const handleSelectKey = (e) => {
        if(e.code === 'Space' || e.code === 'Enter'){
            e.preventDefault();
            handleSelect()
        }
    }
    const myMessage =  author === user.name;
    return (
        <div tabIndex={`${ myMessage ? '0' : '-1' }`}
         class={`flex flex-col ${author === user.name ? 'items-end cursor-pointer' : 'items-start' } items-start p-2`} 
         onKeyDown={(e) => {myMessage ? handleSelectKey(e) : null}} onClick={myMessage ? handleSelect : null} >

            <span class="author">{author}</span>
            <span class="text-lg max-w-90 overflow-x-hidden break-word">{text}</span>
        </div>
    )
}

export default Message;