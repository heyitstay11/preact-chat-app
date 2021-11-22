import { useState } from 'preact/hooks';
import Header from "./components/header";
import { Router } from 'preact-router';
import Home from "./components/home";
import Join from "./components/form";
import Chat from './components/chat';

const App = () => {
  const [user, setUser] = useState({name: '', room: ''});
 
  return (
      <div>
       <Header />
       <Router>
         <Home path="/" />
         <Join path="/join" user={user} setUser={setUser} />
         <Chat path="/chat" user={user}/>
       </Router>
      </div>
  )
}

export default App;