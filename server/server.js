require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jwt-then');

const ChatRoom = require('./models/Chatroom');
const User = require('./models/User');
const Message = require('./models/Message');
const app = require('./app');

const PORT = process.env.port || 5000;

//Database connection
mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
mongoose.connection.on('error', err => {
    console.err('Mongoose Connection Error: ' + err.message);
});
mongoose.connection.once('open', ()=> {
   console.log('MongoDB connected');
});

const server = app.listen(PORT, ()=> {
    console.log('Server Listening at port ' + PORT)
});

const io = require('socket.io')(server);
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.query.token;
        const payload = await jwt.verify(token, process.env.SECRET);
        socket.userId = payload.id;
        next();
    } catch (error) {
        console.log(error);
    }
});

io.on('connection', (socket) => {
    console.log('Connected:' + socket.userId);

    socket.on('disconnect', () => {
        console.log('Disconnect: ' + socket.userId);
    });

    socket.on('joinRoom', ({ chatroomId }) => {
        socket.join(chatroomId);
        console.log('A user joined chatroom: ' + chatroomId);
    });

    socket.on('leaveRoom', ({ chatroomId }) => {
        socket.leave('chatroomId');
        console.log('A user left chatroom: ' + chatroomId);
    });

    socket.on("chatroomMessage", async ({ chatroomId, message }) => {
        if (message.trim().length > 0) {
            const user = await User.findOne({ _id: socket.userId });
            const newMessage = new Message({
                chatroom: chatroomId,
                user: socket.userId,
                message
            });
            io.to(chatroomId).emit("newMessage", {
                message,
                name: user.name,
                userId: socket.userId
            });
            await newMessage.save();
        }
    });
});
