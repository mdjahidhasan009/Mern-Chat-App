import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import DashboardPage from "./Pages/DashboardPage";
import IndexPage from "./Pages/indexPage";
import ChatroomPage from "./Pages/ChatroomPage";
import io from "socket.io-client";
import makeToast from "./Toaster";

function App() {
    const [ socket, setSocket ] = useState(null);
    const setupSocket = () => {
        const token = localStorage.getItem('CC_Token');
        if(token && !socket) {
            const newSocket = io('http://localhost:5000', {
                query: {
                    token: localStorage.getItem('CC_Token')
                }
            });

            newSocket.on('disconnect', ()=> {
                setSocket(null);
                setTimeout(setupSocket, 3000);
                makeToast('error', 'Socket Disconnected!!');
            });

            newSocket.on('connect', ()=> {
                makeToast('success', 'Socket Connected!!');
            });

            setSocket(newSocket);
        }
    };

    useEffect(() => {
        setupSocket();
        // eslint-disable-next-line
    }, []);


  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route
            path="/login"
            render={()=>
                <LoginPage setupSocket={setupSocket}/>
            }
        />
        <Route path="/register" component={RegisterPage} />
        <Route
            path="/dashboard"
            render={() =>
                <DashboardPage socket={socket} />
            }
        />
        <Route
            path="/chatroom/:id"
            render={() =>
                <ChatroomPage socket={socket} />
            }
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
