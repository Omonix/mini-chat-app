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
