import Header from "./components/header";
import { Router } from 'preact-router';
import AsyncRoute from 'preact-async-route';
import Home from "./components/home";
import Join from "./components/form";
import Chat from './components/chat';
import { UserProvider } from './context';

const App = () => {

  return (
      <div>
      <UserProvider>
       <Header />
          <Router>
            <Home path="/" />
            <AsyncRoute path="/join" component={Join} loading={() => {return <p class="text-3xl mx-auto my-4">Loading ...</p> }} />
            <AsyncRoute path="/chat" component={Chat} loading={() => {return <p class="text-3xl mx-auto my-4">Loading ...</p> }} />
          </Router>
      </UserProvider>
      </div>
  )
}

export default App;