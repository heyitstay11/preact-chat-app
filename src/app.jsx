import { Suspense, lazy } from 'preact/compat';
import Header from "./components/header";
import { Router} from 'preact-router';
import Home from "./components/home";
import { UserProvider } from './context';
import Loader from './components/loading';

const Join = lazy(() => import("./components/form"));
const  Chat = lazy(() => import('./components/chat'));

const App = () => {

  return (
      <div>
      <UserProvider>
       <Header />
       <Suspense fallback={<Loader />}>
         <Router>
            <Home path="/" />
            <Join path="/join" />
            <Chat path="/chat" />
          </Router>
       </Suspense>
      </UserProvider>
      </div>
  )
}

export default App;