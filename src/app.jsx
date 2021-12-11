import { Suspense, lazy } from 'preact/compat';
import Header from "./components/header";
import { Router} from 'preact-router';
import Home from "./components/home";
import Channel from './components/channel';
import Login from './components/login';
import Join from './components/form';
import { UserProvider } from './context';
import Loader from './components/loading';
import Toast from './components/toast';
import { AlertProvider } from './alertContext';
import { useAuthContext } from './authContext';
import { useCallback, useEffect } from 'preact/hooks';


const Chat = lazy(() => import('./components/chat'));
const Signup = lazy(() => import("./components/signup"));


const App = () => {
const { setUser } = useAuthContext();

const verifyUser = useCallback(async () => {
  // refresh
 try {
   const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, {
     method: 'POST',
     credentials: 'include',
     headers: {'Content-Type': "apllication/json"}
   })
   const data = await res.json();
   if(data.token && data.email){
     setUser({token: data.token, email: data.email, id: data.id, name : data.name});
   }else{
     console.log(data);
   }
 } catch (error) {
   console.log(error);
 }
})

useEffect(() => {
  const timer = setInterval(() => {
    verifyUser()
  }, 5*60*1000);
  verifyUser();
  return () => clearInterval(timer);
}, []);

return (
    <div>
        <AlertProvider>
          <UserProvider>
            <Header />
            <Toast />
            <Suspense fallback={<Loader />}>
              <Router>
                <Home path="/" />
                <Signup path="/signup" />
                <Login path="/login" />
                <Join path="/join" />
                <Chat path="/chat" />
                <Channel path="/channel/:id" />
              </Router>
            </Suspense>
          </UserProvider>
        </AlertProvider>
    </div>
)
}

export default App;