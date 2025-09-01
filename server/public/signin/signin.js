import axios from 'https://cdn.skypack.dev/axios';

const userInput = document.querySelector('#signUser');
const emailInput = document.querySelector("#signEmail");
const passwordInput = document.querySelector("#signPassword");

document.querySelector('.signinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const emailPass = /^[a-zA-Z0-9]+@[a-z]+\.[a-z]{2,3}$/;

    if (emailPass.test(emailInput.value) && userInput.value !== "" && passwordInput.value !== "") {
        const infos = { username: userInput.value, password: passwordInput.value, email: emailInput.value};
        axios.post(`http://localhost:3500/signin`, infos);
    } else {
        console.log("invalid");
    }
});
