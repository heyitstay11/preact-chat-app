import { Link } from 'preact-router/match';

const Header = () => {
return (
    <header className="bg-purple-700 text-white flex flex-wrap items-center justify-between px-4 py-2">
        <div class="brand text-2xl">Chat App</div>
        <nav>
            <ul className="flex px-4 text-lg">
                <li ><Link className="text-white no-underline hover:opacity-90" href="/">Home</Link></li>
                <li className="pl-6"><Link className="text-white no-underline hover:opacity-90" href="/join">Join</Link></li>
                <li className="pl-6"><Link className="text-white no-underline hover:opacity-90" href="/chat">Chat</Link></li>
            </ul>
        </nav>
    </header>
)
}

export default Header;