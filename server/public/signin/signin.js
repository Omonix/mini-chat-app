import axios from "axios";
import dotenv from "dotenv";

const userInput = document.querySelector('#signUser');
const emailInput = document.querySelector("#signEmail");
const passwordInput = document.querySelector("#signPassword");
dotenv.config();

document.querySelector('#signSubmit').addEventListener('submit', () => {
    const emailPass = /^[a-zA-Z0-9]+@[a-z]+\.[a-z]{2,3}$/;

    if (emailPass.test(emailInput.value)) {
        const response = axios.post(`${process.env.URL_SERVER}/signup`, { username: userInput.value, password: passwordInput.value, email: emailInput.value});
        console.log(response);
    }
});
