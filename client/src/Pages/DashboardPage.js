import React, { useState, useEffect } from "react";
import axios from 'axios';
import  { Link ,withRouter } from "react-router-dom";

const DashboardPage = (props) => {
    const [ chatRooms, setChatRooms ] = useState([]);
    const getChatRooms = () => {
        axios

            .get('http://localhost:5000/chatroom', {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("CC_Token")
                }
            })
            .then(response => {
                setChatRooms(response.data);
            })
            .catch(err => {
                setTimeout(getChatRooms, 3000);
            });
    };

    useEffect(() => {
       getChatRooms();
       console.log('dashboard')
       // eslint-disable-next-line
    }, []);

    return (
        <div className="card">
            <div className="cardHeader">Chatrooms</div>
            <div className="cardBody">
                <div className="inputGroup">
                    <label htmlFor="chatroomName">Chatroom Name</label>
                    <input
                        type="text"
                        name="chatroomName"
                        id="chatroomName"
                        placeholder="JavaScript"
                    />
                </div>
            </div>
            <button>Create Chatroom</button>
            <div className="chatrooms">
                {chatRooms.map(chatRoom => (
                    <div key={chatRoom._id} className="chatroom">
                        <div>{chatRoom.name}</div>
                        <Link to={`/chatroom/${chatRoom._id}`}>
                            <div className="join">Join</div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default withRouter(DashboardPage);
