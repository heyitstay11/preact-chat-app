import { Link } from 'preact-router/match';
import { useAuthContext } from '../../authContext';

const Header = () => {
    const { user } = useAuthContext();

return (
    <header className="bg-purple-700 text-white flex flex-wrap items-center justify-between px-4 py-2">
        <div class="brand text-2xl">Chat App</div>
        <nav>
            <ul className="flex px-4 text-lg">
                <li ><Link className="text-white no-underline hover:opacity-90" href="/">Home</Link></li>
                <li className="pl-6"><Link className="text-white no-underline hover:opacity-90" href="/join">Quick Room</Link></li>
                {(user.email && user.token) ? null : (
                <>
                  <li className="pl-6"><Link className="text-white no-underline hover:opacity-90" href="/login">Login</Link></li>  
                </>
                )}
            </ul>
        </nav>
    </header>
)
}

export default Header;