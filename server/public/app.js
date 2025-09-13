const imageLogo = document.querySelector(".imgLogo");
const canvasLogo = document.querySelector(".canvasLogo");
const ctx = canvasLogo.getContext("2d");

const verifyToken = () => {
  const expiry = localStorage.getItem("token");
  if (expiry) {
    document.querySelector('.userParam').innerHTML = localStorage.getItem("username");
    document.querySelector('.userParam').href = "/";
    if (localStorage.getItem("colorA") === "#93EC9C" && localStorage.getItem("colorB") === "#2CA254") {
      imageLogo.style.display = "auto";
      canvasLogo.style.display = "none";
    } else {
      imageLogo.style.display = "none";
      canvasLogo.style.display = "auto";
      handleColorImg(hexaToRGB(localStorage.getItem("colorA")), hexaToRGB(localStorage.getItem("colorB")));
    }
  } else {
    imageLogo.style.display = "auto";
    canvasLogo.style.display = "none";
    document.querySelector('.userParam').innerHTML = "Log in";
    document.querySelector('.userParam').href = "/login";
  }
  document.querySelector(":root").style.setProperty("--random-color-one", localStorage.getItem("colorA") ? localStorage.getItem("colorA") : "#93EC9C");
  document.querySelector(":root").style.setProperty("--random-color-two", localStorage.getItem("colorB") ? localStorage.getItem("colorB") : "#2CA254");
}
const colorDistance = (c1, c2, tolerance=50) => {
  return Math.abs(c1[0] - c2[0]) < tolerance &&
        Math.abs(c1[1] - c2[1]) < tolerance &&
        Math.abs(c1[2] - c2[2]) < tolerance;
}
const hexaToRGB = (hexa) => {
  hexa = hexa.substring(1, hexa.length);
  return [parseInt(hexa.substring(0, 2), 16), parseInt(hexa.substring(2, 4), 16), parseInt(hexa.substring(4, 6), 16)];
}
const handleColorImg = (colora, colorb) => {
  canvasLogo.width = 539;
  canvasLogo.height = 107;
  ctx.drawImage(imageLogo, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvasLogo.width, canvasLogo.height);
  const data = imageData.data;
  const oldColors = [
    [147, 236, 156],
    [44, 162, 84]
  ];
  const newColors = [colora, colorb];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    for (let j = 0; j < oldColors.length; j++) {
      if (colorDistance([r, g, b], oldColors[j], 65)) {
        data[i] = newColors[j][0];
        data[i + 1] = newColors[j][1];
        data[i + 2] = newColors[j][2];
        break;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}
verifyToken();
