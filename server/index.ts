import express, { type Express } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";

const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

app.use(cors());

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("send_message", (data: { message: string }) => {
        io.emit("recieve_message", data);
    });
});

server.listen(process.env.SERVER_PORT || 8080, () => {
    console.log("server is running at port 8080");
});
