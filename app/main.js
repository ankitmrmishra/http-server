const { error } = require("console");
const net = require("net");
const fs = require("fs");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
let directory;
const args = process.argv.slice(2);
if (args.length === 2 && args[0] === "--directory") {
  directory = args[1]; 
} else {
  console.error(
    "Error: Missing or invalid directory flag. Usage: --directory <directory>"
  );
  process.exit(1); 
}

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  
  });
   socket.on("error", console.error);
  socket.on("data" , (data) => {
    
    const request = data.toString().split("\r\n");
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
       else if (path.startsWith("/files/")) {
         const filename = path.slice(7); // Extract filename from the path
         const filePath = `${directory}/${filename}`; // Construct the full file path

        
           // Check if file exists
            fs.access(filePath, fs.constants.F_OK, (err) => {
              if (err) {
                socket.write("HTTP/1.1 404 Not Found\r\n\r\n"); // Send 404 for non-existent file
              } else {
                fs.readFile(filePath, (err, data) => {
                  // Read file contents
                  if (err) {
                    socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n"); // Send 500 for read error
                  } else {
                    const response = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${data.length}\r\n\r\n`;
                    socket.write(response + data); // Send successful response with file contents
                  }
                });
              }
              socket.end(); // End the connection after sending the response
            });
       } else {
         socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
       }
     socket.end();
  })
  
});

server.listen(4221, "localhost");
