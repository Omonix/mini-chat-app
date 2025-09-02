import axios from 'https://cdn.skypack.dev/axios';

const socket = io("https://mini-chat-app-xeeh.onrender.com/"); //localhost:3500
const userInput = document.querySelector('#signUser');
const emailInput = document.querySelector("#signEmail");
const passwordInput = document.querySelector("#signPassword");

const verifyToken = () => {
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
                const response = await axios.post(`https://mini-chat-app-xeeh.onrender.com/signin/`, { username: userInput.value, password: passwordInput.value, email: emailInput.value});

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
