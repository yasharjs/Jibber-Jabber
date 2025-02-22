import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink
} from '@apollo/client';

// for auth to create middleware
import { setContext } from '@apollo/client/link/context';

// Components and Pages
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import WelcomePage from './components/WelcomePage';
import NotFound from './pages/notFound';
import PC from './pages/PC';

// CSS
import './App.css';
import Channel from './pages/Channel';
import ChannelSocket from './pages/Channel-socket';

// Sign up and Login
import Signup from './components/Signup/signup';
import Login from './components/Login/login';
import Auth from './utils/auth';

// Socket IO
// import { SocketContext, socket } from './context/socket';
import { SocketProvider } from './contexts/socket';
import { NotifyProvider } from './contexts/notifContext';

import Chats from './pages/Chats';

let e_string = '';
if (process.env.NODE_ENV === 'development') {
  e_string = 'http://localhost:3001/graphql';
} else {
  e_string = '/graphql';
}

// Apollo client stuff
const httpLink = createHttpLink({ uri: e_string });
// dont need to use first argument of setContext (request)
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div id="page-container" className="mainSection">
          <div id="content-wrap">
            <SocketProvider>
              <NotifyProvider>
                <Header />
                <Routes>
                  <Route
                    exact
                    path="/"
                    element={<WelcomePage></WelcomePage>}
                  ></Route>
                  <Route exact path="/" element={<Home></Home>} />
                  {Auth.loggedIn() ? (
                    <>
                      <Route
                        exact
                        path="/dashboard"
                        element={<Chats></Chats>}
                      />
                      <Route
                        exact
                        path="/channel"
                        element={<Channel></Channel>}
                      />
                    </>
                  ) : (
                    <>
                      <Route exact path="/signup" element={<Signup></Signup>} />
                      <Route exact path="/login" element={<Login></Login>} />
                    </>
                  )}
                  <Route exact path="*" element={<NotFound></NotFound>} />
                  <Route
                    exact
                    path="/chat/:channelId"
                    element={<ChannelSocket></ChannelSocket>}
                  ></Route>
                </Routes>
              </NotifyProvider>
            </SocketProvider>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
