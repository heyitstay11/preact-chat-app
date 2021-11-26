import { useUserContext } from "../../context";

const List = () => {
    const {participants} = useUserContext();

    return (
        <>
        { participants.length > 0 ?
         (
            <section class="mx-auto max-w-sm text-center px-2 py-6" >
                <p class="text-2xl"> Participants: {participants.length}</p>
                <ul class="py-4 text-left" >
                    {participants.map((user , index) => {
                        return (
                            <li key={user} class={ `${index % 2 === 0 ? 'bg-purple-200': ''} py-1 px-3 text-lg my-1`} >{user}</li>
                        )
                    })}
                </ul>
           </section>
         ) : ( 
             null
         )}
        </>
    )
}

export default List;