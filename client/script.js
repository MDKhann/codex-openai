import bot from './bot.svg';
import user from './user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;


function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if(element.textContent === '....') {
      element.textContent = '';
    }
  },300)
}

function typeText (element, text) { 
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval)
    }
  }, 20);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexaDecmialString = randomNumber.toString(16);

  return `id-${timestamp}-${hexaDecmialString}`;
}

function chatStripe (isAI, value, uniqueId) {
  return (
    `
      <div class="wrapper ${isAI && 'ai'}">
        <div class="chat">
          <img
            src="${isAI ? bot : user}
            alt = "${isAI ? 'bot': 'user'}"
          />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  //user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  // attempt to fetch what the bot thinks and display it

  const response = await fetch("http://localhost:5000", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
  },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  });

  clearInterval(loadInterval)
  messageDiv.innerHTML = '';
  if (response.ok) {

    const data = await response.json();
    const parsedData = data.bot.trim();

    console.log("Parsed data:",parsedData)

    typeText(messageDiv, parsedData)

  } else {
    const err = await response.text();
    messageDiv.innerHtml = "An error occured"
    alert(err)
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})