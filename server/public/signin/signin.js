import axios from 'https://cdn.skypack.dev/axios';

const socket = io("localhost:3500");
const userInput = document.querySelector('#signUser');
const emailInput = document.querySelector("#signEmail");
const passwordInput = document.querySelector("#signPassword");

const verifyToken = () => {
  const expiry = localStorage.getItem("exp");
  if (Date.now() - expiry >= 86400000) {
    localStorage.clear();
    window.location.href = '../login';
    alert("You are not connected");
  }
  document.querySelector(":root").style.setProperty("--random-color-one", localStorage.getItem("colorA") ? localStorage.getItem("colorA") : "#93EC9C");
  document.querySelector(":root").style.setProperty("--random-color-two", localStorage.getItem("colorB") ? localStorage.getItem("colorB") : "#2CA254");
}
verifyToken();

document.querySelector('.signinForm').addEventListener('submit', async(e) => {
    e.preventDefault();
    const emailPass = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;

    if (userInput.value !== "") {
        if (passwordInput.value !== "") {
            if (emailPass.test(emailInput.value)) {
                const response = await axios.post(`http://localhost:3500/signin/`, { username: userInput.value, password: passwordInput.value, email: emailInput.value});

                if (response.status === 200) {
                    userInput.value = "";
                    emailInput.value = "";
                    passwordInput.value = "";
                    window.location.href = '../login';
                } else {
                    alert(response.data.message);
                }
                console.log(response.data.message);
            } else {
                console.log("Error 422 : Bad email");
                alert("Bad email");
            }
        } else {
            console.log("Error 400: Missing password");
            alert("Missing password");
        }
    } else {
        console.log("Error 400: Missing username");
        alert("Missing username");
    }
});
