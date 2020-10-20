const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const _PORT = process.env.PORT || 3000;


// static
app.use(express.static("public"))

app.get("/", (req, resp) => {
	// resp.json({status:"ok"});

	resp.sendFile(__dirname+"/views/index.html");


})
// showroom update
const showroom = require("./showroom.js");

// console.log(showroom.caching)
setInterval(do_update,30000)
async function do_update(){
	const sh = showroom;
	const data = await sh.execute();
	io.emit("update",data);
}

// io setup
io.on("connection", async clientSocket => {
	// conection to do
	const sh = showroom;
	console.log("new client")
	var data = await showroom.get_data();
	clientSocket.emit("init-vis", data.caching)

	clientSocket.on("roomProfile", async data =>{
		if(!data.id) return {};
		const dat = await sh.getInfo(data.id);
		clientSocket.emit("roomProfile",dat);
	})
})




server.listen(_PORT, async ()=>{
	// console.log(await showroom.get_data())
	console.log("APP Listening to port: "+_PORT);
})

