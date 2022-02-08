import { Link } from 'preact-router/match'
import { useCallback, useEffect, useState } from 'preact/hooks';
import { useAuthContext } from '../../authContext';
import { useAlertContext } from '../../alertContext';


const Home = () => {
  const { user, setUser, channels, fetchChannels } = useAuthContext();
  const { setAlertMessage } = useAlertContext();
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState({});

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
        body: JSON.stringify({ user1: { id : user.id, name: user.name }, user2: {id : searchResult._id, name: searchResult.username }})
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

return (
  <div class="px-2" >
    {user.email ? (
      <div class={`lg:w-4/5 mx-auto text-center px-2`} >
          <div class="flex items-center justify-between my-5">
            <p class="text-lg">You are logged in as {user.email}</p>
            <button class="text-lg py-2 px-6 font-500 button" onClick={handleLogout}>Logout</button>
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
          <div class="h-3px w-full bg-purple-700 mt-6 mb-2"></div>
          <div class=" flex flex-col text-left my-2 ml-2">
          {(channels && channels.length > 0 )&& (<h2 class="text-2xl font-500 mt-2 mb-1">Chats</h2>)}
          {(channels && channels.length) > 0 &&
              channels.map((channel) => {
                return <a class="button mt-2 w-min text-lg px-6 py-2" href={`/channel/${channel._id}`}>
                          {channel.title.replace(user.name, '')}
                      </a>
          })}
          </div>
      </div>
      ) :
      <section >
        <div class="container mx-auto flex md:px-10 px-5 py-20 md:flex-row flex-col items-center">
          <div class="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 class="lg:text-6xl text-4xl mb-4 font-medium text-gray-900">Connect with your
              <br class="hidden lg:inline-block" /> friends
            </h1>
            <p class="mb-8 md:text-gray-600 text-black leading-relaxed">Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia sunt similique magnam quo quae nesciunt dolor, optio culpa dolore amet </p>
            <div class="flex justify-center">
              <a href='/signup' class="inline-flex text-white bg-purple-700 border-0 py-3 px-7 focus:outline-none hover:bg-purple-600 rounded text-lg button">Sign up</a>
              <a href='/join' class="ml-4 inline-flex text-purple-700 bg-gray-100 py-3 px-7 focus:outline-none hover:bg-gray-200 rounded text-lg border-2 border-purple-700">Join</a>
            </div>
          </div>
          <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <img class="object-cover object-center rounded" alt="hero" src="./phone.png" />
          </div>
        </div>
      </section>
  }
  </div>
);
}


export default Home;