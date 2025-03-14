let prompt = document.querySelector("#prompt")
let submitbtn = document.querySelector("#submit")

let chatContainer = document.querySelector(".chat-container")

let imagebtn = document.querySelector("#image")
let image = document.querySelector("#image img")
let imageinput = document.querySelector("#image input")

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBNZ3YJo1gd68lPkhLSjUAK7IzUE8Hm3b4"

let user = {
  message: null,
  file:{
    mime_type:null,
    data: null
  }

}

function scrollToBottom() {
  setTimeout(() => {
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
  }, 100); // Small delay to allow the chat update
}


async function generateResponse(aiChatBox) {

  let text = aiChatBox.querySelector(".ai-chatarea");

  let RequestOption = {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({

      "contents": [
        {
          "parts": [{ "text": user.message },(user.file.data?[{"inline_data":user.file}]:[])]
        }]

    })
  }
  try {
    let response = await fetch(Api_Url, RequestOption)
    let data = await response.json();
    let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim()
    text.innerHTML = apiResponse
  }
  catch (error) {
    console.log(error);
  }
  finally {
    scrollToBottom(); // Ensure chat scrolls down
    image.src=`imagefinal.svg`
    image.classList.remove("choose")
    user.file.mime_type = null;
    user.file.data = null;
  }
}

function createChatBox(html, classes) {
  let div = document.createElement("div")
  div.innerHTML = html
  div.classList.add(classes)
  return div
}

function handlechatResponse(message) {
  user.message = message
  let html = `<div class="user-chatarea">
                ${user.message}
                ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user .file.data}" class="chooseimg"/>`:""}
            </div>
            <img src="usericon.png" alt="" id="usericon">
           
        </div>`
  prompt.value = ""
  let userChatBox = createChatBox(html, "user-chatbox")
  chatContainer.appendChild(userChatBox)

  scrollToBottom(); // Call the function here

  setTimeout(() => {
    let html = `<div class="ai-chatarea"> 
                <p><span class="thinking">Thinking...</span></p>
            </div>
            <img src="ai.png" alt="" id="aiicon">`

    let aiChatBox = createChatBox(html, "ai-chatbox")
    chatContainer.appendChild(aiChatBox)
    generateResponse(aiChatBox)
  }, 1000)
}

prompt.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    handlechatResponse(prompt.value)
  }
})
submitbtn.addEventListener("click",()=>{
  handlechatResponse(prompt.value)
})
imageinput.addEventListener("change",()=>{
  const file=imageinput.files[0]
  if(!file) return

  let reader = new FileReader()
  reader.onload=(e)=>{
    let base64string = e.target.result.split(",")[1]
    user.file={
      mime_type:file.type,
      data : base64string
    }
    image.src=`data:${user.file.mime_type};base64,${user.file.data}`
    image.classList.add("choose")
  }
  
  reader.readAsDataURL(file)
})

imagebtn.addEventListener("click", () => {
  imagebtn.querySelector("input").click()
})