document.querySelector(".formVerify").addEventListener("submit", async (e) => {
    e.preventDefault()
    if (document.querySelector(".emailInput").value !== "") {
        if (document.querySelector(".codeInput").value !== "") {
            try {
                const response = await axios.patch("https://mini-chat-app-xeeh.onrender.com/verify", { email: document.querySelector(".emailInput").value, code: document.querySelector(".codeInput").value });
                if (response.status === 200) {
                    console.log(response.data.message);
                    document.querySelector(".emailInput").value = "";
                    document.querySelector(".codeInput").value = "";
                    alert("Your account has been valided successfully !")
                    window.location.href = '../login';
                }
            } catch (err) {
                console.log("Error : " + err);
                alert("Invalid email or code");
            }
        }
    }
})
