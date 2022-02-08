import { Link } from 'preact-router/match';
import { useAuthContext } from '../../authContext';
import logo from '../../favicon.svg';

const Header = () => {
    const { user } = useAuthContext();

return (
    <header className="bg-purple-700 text-white flex md:flex-row flex-col flex-wrap items-center justify-between px-4 py-3">
        <div class="brand text-3xl flex px-2">
            <img src={logo} alt="" height="30" width="30"  />    
            <span className='ml-2'>Chat App</span>
        </div>
        <nav>
            <ul className="flex px-4 md:text-xl text-lg md:my-0 my-2">
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