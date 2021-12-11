import { Link } from 'preact-router/match'
import { useCallback, useEffect, useState } from 'preact/hooks';
import { useAuthContext } from '../../authContext';
import { useAlertContext } from '../../alertContext';


const Home = () => {
  const { user, setUser } = useAuthContext();
  const { setAlertMessage } = useAlertContext();
  const [channels, setChannels] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState({});


  const fetchChannels = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/channel/user/${user.id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': user.token
        }
      });
      const data = await res.json();
      if(res.status === 200){
        console.log(channels.length , channels)
        setChannels(() => data.channels);
      }else{
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  });


  const handleLogout = useCallback(async () => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}`+'/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': user.token
      }
    });
    const data = await res.json();
    setUser({email: '', token: '', id: ''});
  });

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    setSearchResult({});
    if(!search) return;
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${search}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': user.token
      }
    });
    const data = await res.json();
    if(res.status === 200){
      setSearchResult(data.user);
    }else{
      setAlertMessage(data.error);
    }
  });

  const handleAdd = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/channel`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': user.token
        },
        body: JSON.stringify({ user1: {id : user.id, name: user.name }, user2: {id : searchResult._id, name: searchResult.username }})
      });
      const data = await res.json();
      fetchChannels()
      if(res.status !== 201){
        setAlertMessage(data.error);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(async () => {
    if(user.id){
      fetchChannels();
    } 
  }, [user]);

return (
  <div class="mx-auto max-w-2xl text-center px-2">
    <h1 class="text-4xl font-400 my-4">Chat App</h1>
    {user.email ? (
      <>
      <div class="flex items-center justify-between my-5">
        <p class="text-lg">You are logged in as {user.email}</p>
        <button class="text-lg button" onClick={handleLogout}>Logout</button>
      </div>
      <form onSubmit={handleSearch} class="flex items-center">
        <label class="text-xl" htmlFor="search">Search friend</label>
        <input class="ml-4" value={search} onInput={(e) => setSearch(e.target.value)} placeholder="john@doe.com" type="email" name="search" id="search" />
      </form>
      {(searchResult.email && searchResult.email !== user.email)? (
        <div class="flex my-4 mx-4 items-center justify-around text-left">
        <p class="mx-4 text-lg" >Username: {searchResult.username}</p>
        <p class="font-bold">Email: {searchResult.email}</p>
        <button class="button" onClick={handleAdd} >Add</button>
      </div>
      ) : null}
      <div class=" flex flex-col text-left my-2 ml-2">
      {channels.length > 0 && (<h2 class="text-2xl">Chats</h2>)}
      {channels.length > 0 &&
          channels.map((channel) => {
            return <a class="button mt-2 w-min" href={`/channel/${channel._id}`}>
                      {channel.title.replace(user.name, '')}
                   </a>
      })}
      </div>
      </>
      ) :
      <>
        <p class="my-2 text-2xl max-w-40ch mx-auto" >Create a quick chat session using a username, room name</p>
        <Link href="/join" class="inline-block no-underline text-lg my-2 text-white bg-purple-700 hover:bg-purple-900 px-4 py-2 rounded-sm hover:bg-purple-900 "  aria-label="Visit the Join/Chat page of site" >Create/Join</Link>
      </>}
  </div>
);
}


export default Home;