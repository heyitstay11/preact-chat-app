import { useState } from 'preact/hooks';
import Header from "./components/header";
import { Router } from 'preact-router';
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
            <Join path="/join" />
            <Chat path="/chat" />
          </Router>
      </UserProvider>
      </div>
  )
}

export default App;