const http=require('http');
const express=require('express');
const path=require('path');
const socketio=require('socket.io');
const {formatMessage}=require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utils/users');
const app=express();
const server=http.createServer(app);
// const mongoose=require('mongoose');
// const db_link="mongodb+srv://harry_123:flyingbeast@cluster0.zxoymhd.mongodb.net/?retryWrites=true&w=majority";
const io=socketio(server,{cors:
{
    origin:'*',
    method:['GET','POST']
}});


//set static folder
app.use(express.static(path.join(__dirname,'public')));

const botName='IIITV Bot';

//run when client connects
io.on('connection',(socket)=>{

    socket.on('joinRoom',({username,room})=>{
        const user=userJoin(socket.id,username,room);
        
        socket.join(user.room);

        // console.log("new ws connection");
    
   //Welcome current user
    socket.emit('message',formatMessage(botName,'Welcome to ClubChat'));

    //broadcast when a user connects
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`));


     //send users and room info
     io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room)
    });

    });

    //listen for chatMessage
    socket.on('chatMessage',(msg)=>{
        let user=getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
        //console.log(msg);
    });

     //runs when client disconnects
     socket.on('disconnect',()=>{
        const user=userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
//send users and room info
io.to(user.room).emit('roomUsers',{
    room:user.room,
    users:getRoomUsers(user.room)
});


}
        
    });


});
const PORT=3000||process.env.PORT;
server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});


