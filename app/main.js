const { error } = require("console");
const net = require("net");
const pathe = require("path");

const filePath = process.argv[3];

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");


// Uncomment this to pass the first stage
const  server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  
  });
   socket.on("error", console.error);
  socket.on("data" , async (data) => {
    
    const request = data.toString().split("\r\n");
     let pathRequest = request[0].split(" ");
    const path = request[0].split(" ")[1];
    const header = request[2].split("User-Agent: ")[1];
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
         let ans = "";
         ans += "HTTP/1.1 200 OK\r\n";
         ans += "Content-Type:text/plain\r\n";
         ans += `content-Length:${header.length}\r\n\r\n`;
         ans += header;
         socket.write(ans);
     }
    else if (pathRequest[1].includes("/files/")) {
      const fileName = pathRequest[1].replace("/files/", "");
      const file = pathe.join(filePath, fileName);
      if (fs.existsSync(file)) {
        const content = await fs.promises.readFile(file);
        socket.write(
          `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}`
        );
      } else {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        socket.end();
      }
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
     socket.end();
  })
  
});

server.listen(4221, "localhost");
