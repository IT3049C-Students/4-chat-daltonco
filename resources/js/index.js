const nameInput = document.getElementById("my-name-input");
const myMessage = document.getElementById("my-message");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat");
const saveButton = document.getElementById("save-button");

async function updateMessages(){
  const messages = await fetchMessages();

  let formattedMessages = "";
  messages.forEach(message => {
    formattedMessages += formatMessage(message, nameInput.value)
  });
  chatBox.innerHTML = formattedMessages;
}

const MILLISECONDS_IN_ONE_SECOND = 1000;
setInterval(updateMessages, MILLISECONDS_IN_ONE_SECOND);

const serverURL = "https://it3049c-chat-application.herokuapp.com/messages";

function fetchMessages(){
  return fetch(serverURL)
    .then(response => response.json())
}

function formatMessage(message, myNameInput) {
  const time = new Date(message.timestamp);
  const formattedTime = `${time.getHours()}:${time.getMinutes()}`;

  if (myNameInput === message.sender) {
      return `
      <div class="mine messages">
          <div class="message">
              ${message.text}
          </div>
          <div class="sender-info">
              ${formattedTime}
          </div>
      </div>
      `
  } else {
      return `
          <div class="yours messages">
              <div class="message">
                  ${message.text}
              </div>
              <div class="sender-info">
                  ${message.sender} ${formattedTime}
              </div>
          </div>
      `
  }
}

function sendMessages(username, text){
  const newMessage = {
    sender: username,
    text: text,
    timestamp: new Date()
  }

  fetch (serverURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newMessage)
  });
}

sendButton.addEventListener("click", function(sendButtonClickEvent){
  sendButtonClickEvent.preventDefault();
  const sender = nameInput.value;
  const message = myMessage.value;

  sendMessages(sender,message);
  myMessage.value = "";
});

//Lab - Chatting App Storage
saveButton.addEventListener("click", function(saveButtonClickEvent){
  localStorage.setItem("username", nameInput.value);
});

// Use these to create a new instance with a "blank" local storage
//myMessage.disabled = false;
//localStorage.setItem("username", "");

function checkUsernameSaved(){
  if(localStorage.getItem("username") == ""){
    myMessage.disabled = true;
  } else{
    myMessage.disabled = false;
  }
}

setInterval(checkUsernameSaved, MILLISECONDS_IN_ONE_SECOND);