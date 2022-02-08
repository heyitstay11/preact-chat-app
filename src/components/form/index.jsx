import { route } from 'preact-router';
import { useUserContext } from '../../context';

const Join = () => {
    const {setUser} = useUserContext();

   const handleSubmit = (e) => {
       e.preventDefault()
       const [name , room] = [e.target.name.value,  e.target.room.value];
       if(name && room){
           console.log('submit');
        setUser( {name: name, room: room});
       }
          
   }

    return (
        <div class="mx-auto lg:max-w-4xl text-center px-2 py-20 flex">
            <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 md:pr-15 lg:block hidden">
                <img class="object-cover object-center rounded" alt="hero" src="./chatapp.png" />
            </div>
            <div className="flex flex-col lg:w-1/2 w-5/7 mx-auto">
                <p class="py-2 text-3xl">Join a Room </p>
                <form onSubmit={handleSubmit} class="flex flex-col justify-center px-4 py-2 mx-4 w-full">
                
                    <label for="name" class="text-left text-lg py-2">Username</label>
                    <input placeholder="John123"  type="text" class="border-gray-500 text-lg"
                    pattern="[a-zA-Z0-9]{4,12}" title="no special characters allowed, length between 4 to 12 characters" 
                    required id="name" name="name" minlength="4" maxlength="12" />
                    
                    <label for="room" class="text-left text-lg py-2">Room</label>
                    <input placeholder="Football" type="text" class="border-gray-500 text-lg"
                    pattern="[a-zA-Z0-9]{4,12}"  title="no special characters allowed, length between 4 to 12 characters" required id="room" name="room" maxlength="12" />
                    
                    <button class="button block w-auto mt-4 py-2 text-xl" aria-label="submit join form" >Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Join;