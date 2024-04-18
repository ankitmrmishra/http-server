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
    
    const [request, ...headers] = data.toString().split("\r\n");
  
   const [method, path, httpVersion] = startline.split(" ");
    const stringpassed = path.split("/echo/")[1]

     if (path === "/") {
       socket.write("HTTP/1.1 200 OK\r\n\r\n");
     }
     else if (path.startsWith("/echo/")) {
       let ans = "";
       ans += "HTTP/1.1 200 OK\r\n";
       ans += "Content-Type:text/plain\r\n";
       ans += `content-Length:${stringpassed.length}\r\n\r\n`;
       ans += stringpassed;
       socket.write(ans);
     }
     else if(path === "/user-agent"){
         const useragentHeader = headers.find((s) =>
           s.startsWith("User-Agent:")
         );
         const header = useragentHeader.split("User-Agent: ")[1];
         let ans = "";
         ans += "HTTP/1.1 200 OK\r\n";
         ans += "Content-Type:text/plain\r\n";
         ans += `content-Length:${header.length}\r\n\r\n`;
         ans += header;
         socket.write(ans);
     }
     
     else {
       socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
     }
     socket.end();
  })
  
});

server.listen(4221, "localhost");
