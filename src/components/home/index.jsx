import { Link } from 'preact-router/match'

const Home = () => {
    return (
      <div class="mx-auto max-w-xl text-center px-2">
        <h1 class="text-4xl my-4">Chat App</h1>
        <p class="my-2 text-xl" >Create a chat session using a username and room name</p>
        <Link href="/join" class="inline-block no-underline text-lg my-2 text-white bg-purple-700 hover:bg-purple-900 px-4 py-2 rounded-sm hover:bg-purple-900 "  aria-label="Visit the Join/Chat page of site" >Create/Join</Link>
      </div>
    )
}


export default Home;