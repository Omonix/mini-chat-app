document.querySelector(".formVerify").addEventListener("submit", async (e) => {
    e.preventDefault()
    if (document.querySelector(".emailInput").value !== "") {
        if (document.querySelector(".codeInput").value !== "") {
            const response = await axios.patch("https://mini-chat-app-xeeh.onrender.com/verify", { email: document.querySelector(".emailInput").value, code: document.querySelector(".codeInput").value })
            if (response.status === 200) {
                console.log(response.data.message);
                document.querySelector(".emailInput").value = "";
                document.querySelector(".codeInput").value = "";
                window.location.href = '../login';
            }
        }
    }
})
