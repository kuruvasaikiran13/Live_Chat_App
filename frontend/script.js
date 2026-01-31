const socket = io("http://localhost:5000");

const joinScreen = document.getElementById("joinScreen");
const chatScreen = document.getElementById("chatScreen");
const chatBox = document.getElementById("chatBox");

let username = "";
let room = "";

function joinChat() {
  username = document.getElementById("username").value;
  room = document.getElementById("room").value;

  if (username === "" || room === "") {
    alert("Enter username and room");
    return;
  }

  socket.emit("joinRoom", { username, room });

  joinScreen.style.display = "none";
  chatScreen.style.display = "block";
}

function sendMessage() {
  const message = document.getElementById("messageInput").value;

  if (message !== "") {
    socket.emit("sendMessage", message);
    document.getElementById("messageInput").value = "";
  }
}

socket.on("message", (data) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerText = `${data.user}: ${data.text}`;
  chatBox.appendChild(div);

  chatBox.scrollTop = chatBox.scrollHeight;
});