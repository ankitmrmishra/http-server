const { error } = require("console");
const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");


// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
    server.close();
  });
   socket.on("error", console.error);
  socket.on("data" , (data) => {
    
    const request = data.toString().split("\r\n");
    const path = request[0].split(" ")[1];
    const stringpassed = path.split("/")[1]

     if (path === "/") {
       socket.write("HTTP/1.1 200 OK\r\n\r\n");
     }
     else if (path.startsWith("/echo/")) {
       let ans = "";
       ans += "HTTP/1.1 200 OK\r\n\r\n";
       ans += "Content-Type:text/plain\n\r\n";
       ans += `content.length:${stringpassed.length}\n\r\n`;
       ans += `\n\r\n${stringpassed}\n\r\n`;
       socket.write(ans);
     } else {
       socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
     }
     socket.end();
  })
  
});

server.listen(4221, "localhost");
