import axios from 'https://cdn.skypack.dev/axios';

const socket = io("localhost:3500");
const userInput = document.querySelector('#logUser');
const passwordInput = document.querySelector("#logPassword");

const verifyToken = () => {
  document.querySelector(":root").style.setProperty("--random-color-one", localStorage.getItem("colorA") ? localStorage.getItem("colorA") : "#93EC9C");
  document.querySelector(":root").style.setProperty("--random-color-two", localStorage.getItem("colorB") ? localStorage.getItem("colorB") : "#2CA254");
}
verifyToken();

document.querySelector('.loginForm').addEventListener('submit', async(e) => {
    e.preventDefault();
    try {
        if (userInput.value !== "") {
            if (passwordInput.value !== "") {
                const response = await axios.post(`http://localhost:3500/login/`, { username: userInput.value, password: passwordInput.value });

                if (response.status === 200) {
                    userInput.value = "";
                    passwordInput.value = "";
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("exp", Date.now());
                    localStorage.setItem("username", response.data.username);
                    localStorage.setItem("colorA", response.data.colorA);
                    localStorage.setItem("colorB", response.data.colorB);
                    document.querySelector(":root").style.setProperty("--random-color-one", response.data.colorA);
                    document.querySelector(":root").style.setProperty("--random-color-two", response.data.colorB);
                    window.location.href = '../chat';
                } else {
                    alert(response.data.message);
                }
                console.log(response.data.message);
            } else {
                console.log("Error 400: Missing password");
                alert("Missing password");
            }
        } else {
            console.log("Error 400: Missing username/email");
            alert("Missing username/email");
        }
    } catch (err) {
        console.log("Error 401: Invalid username or password");
        alert("Invalid username or password");
    }
});
