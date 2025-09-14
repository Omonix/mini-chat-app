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
                const response = await axios.post(`https://mini-chat-app-xeeh.onrender.com/login/`, { username: userInput.value, password: passwordInput.value }).then(response => {
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
                }).catch(err => {
                    if (err.response) {
                        console.log(err.response.data.message);
                        alert(err.response.data.message);
                    }
                });
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
