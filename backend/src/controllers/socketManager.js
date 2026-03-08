// import { connection } from "mongoose"
// import { match } from "node:assert"
// import { send } from "node:process"
// import { PassThrough } from "node:stream"
import { Server } from "socket.io"

let connections = {}//This is an object storing rooms.
let messages = {}
let timeOnline = {}

export const connectToSocket = (server)=>{
    const io = new Server(server , {
        cors :{
            origin : "*",
            methods : ["GET" ,"POST"],
            allowedHeaders : ["*"],
            credentials : true
        }
    });

    io.on("connection",(socket)=>{

        console.log("SOMETHING CONNECTED")
        //this is triggered when user joins the room 
        socket.on("join-call" , (path)=>{
            // path is basically your room identifier.
            // It can be:
            // /room1
            // any unique string
            // It represents a video call room ID.
            // So when frontend does:
            // socket.emit("join-call", "room1")
            // That "room1" becomes path.

           // If room doesn’t exist → create empty array.
            if(connections[path] ==  undefined){
                connections[path] = [];
            }
            connections[path].push(socket.id);

            timeOnline[socket.id] = new Date();

            //It loops over all users inside the room.
            //io is the main Socket.IO server instance.it can send messages to all users or one specific user 
            for(let a= 0 ; a < connections[path].length ; a++){
                io.to(connections[path][a]).emit("user-joined" , socket.id ,connections[path]);
                                                //Send an event to the client
            }

            //New user sees old chat
            if(messages[path ]!== undefined){
                for (let a = 0; a < messages [path].length; ++a) {
                    io.to(socket.id).emit("chat-message", messages[path][a]['data'],
                    messages[path] [a]['sender' ], messages[path][a]['socket-id-sender' ])
                }
            }
        })

        socket.on("signal" , (toId , meaasge)=>{
            io.to(toId).emit("signal" , socket.id , meaasge);
        })


        //Triggered when someone sends chat.
        socket.on("chat-message" , (data , sender)=>{
            const [matchingRoom , found] = Object.entries(connections)
                .reduce(([room , isFound] , [roomKey , roomValue])=>{

                    if(!isFound && roomValue.includes(socket.id)){
                        return [roomKey , true]
                    }
                    return [room , isFound];

                }, [' ', false]);


            if(found == true){
                if(messages[matchingRoom] == undefined){
                    messages[matchingRoom] = []
                }

                //Now chat is stored in memory.
                messages[matchingRoom].push({'sender': sender , "data" : data , "socket-id-sender":socket.id})
                console. log("message", matchingRoom, ":", sender, data)

                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message", data, sender, socket.id)
                })
            }
        })


        //Triggered automatically when:
        // User closes tab , Internet disconnects,  Browser crashes
        socket.on("disconnect" , ()=>{
            var diffTime = Math.abs(timeOnline[socket.id] - new Date( ))

            var key

            for(const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))){

                for(let a = 0 ; a < v.length ; ++a){
                    if(v[a] == socket.id){
                        key = k 

                        for(let a = 0 ; a < connections[key].length ; ++a){
                            io.to(connections[key][a]).emit('user-left' , socket.id)
                        }

                        var index = connections[key].indexOf(socket.id)

                        connections[key].splice(index , 1)

                        if(connections[key].length == 0){
                            delete connections[key]
                        }
                    }
                }
            }


        })
    })
      
    return io;
}
