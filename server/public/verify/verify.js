document.querySelector(".formVerify").addEventListener("submit", async (e) => {
    e.preventDefault()
    if (document.querySelector(".emailInput").value !== "") {
        if (document.querySelector(".codeInput").value !== "") {
            await axios.patch("https://mini-chat-app-xeeh.onrender.com/verify", { email: document.querySelector(".emailInput").value, code: document.querySelector(".codeInput").value }).then(response => {
                console.log(response.data.message);
                document.querySelector(".emailInput").value = "";
                document.querySelector(".codeInput").value = "";
                alert("Your account has been valided successfully !")
                window.location.href = '../login';
            }).catch(err => {
                if (err.response) {
                    console.log("Error : " + err.response.data.message);
                    alert(err.response.data.message);
                }
            });
        } else {
            console.log("Error 401 : Missing code");
            alert("Missing code");
        }
    } else {
        console.log("Error 401 : Missing email");
        alert("Missing email");
    }
})
