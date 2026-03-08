import express from "express";
import {createServer} from "node:http";
import { Server } from "socket.io";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/users.route.js";


const app = express();//this is the express app .
const server = createServer(app);//Now we wrap Express inside a Node HTTP server
                                // 👉 Why?
                                // Because Socket.IO cannot directly run on Express
                                // It needs the actual HTTP server.
                                // So this becomes:
                                // Express App → runs inside → HTTP Server


const io = connectToSocket(server);//Now Socket.IO connects to the same HTTP server

app.set("port" , (process.env.PORT || 8000))

app.use(cors());
app.use(express.json({ limit: "40kb" }));//Allows server to read JSON data from request body.
app.use(express.urlencoded({ limit: "40kb", extended: true } ) );//Reads form data

app.use("/api/v1/users" , userRoutes)


const start = async()=>{
    const connectionDb = await mongoose.connect("mongodb+srv://Pruthviraj:YSfrbPJU5ncxjCs1@cluster0.xdenh5u.mongodb.net/");

    console.log(`MONGO Connected Db Host : ${connectionDb.connection.host}`)
    server.listen(app.get("port") , ()=>{
        console.log("listening on port 8000")
    })
};

start();