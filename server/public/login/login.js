import axios from 'https://cdn.skypack.dev/axios';

const socket = io("localhost:3500");
const userInput = document.querySelector('#logUser');
const passwordInput = document.querySelector("#logPassword");

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
