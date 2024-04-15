//crea elemento
const video = document.createElement("video");
//nuestro camvas
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

//div donde llegara nuestro canvas
const btnScanQR = document.getElementById("btn-scan-qr");

//lectura desactivada
let scanning = false;

//funcion para encender la camara
const encenderCamara = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      scanning = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = true;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();

    });
};

//funciones para levantar las funiones de encendido de la camara
function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}

//apagara la camara
const cerrarCamara = () => {
  video.srcObject.getTracks().forEach((track) => {
    track.stop();
  });
  canvasElement.hidden = true;
  btnScanQR.hidden = true;
};

const activarSonido = () => {
  var audio = document.getElementById('audioScaner');
  audio.play();
}

//callback cuando termina de leer el codigo QR
qrcode.callback = (respuesta) => {
  if (respuesta) {
    activarSonido();
    cerrarCamara();
    const videoElement = document.createElement('video');

    videoElement.setAttribute('src', `${respuesta}`);
    videoElement.setAttribute('autoplay',"");
    videoElement.setAttribute('muted',"");

    videoElement.classList.add('video')
    const muestraDiv = document.getElementById('muestra');
    const titulo = document.querySelector('.titulo');
    titulo.style.display = 'none';
    muestraDiv.appendChild(videoElement);
    videoElement.addEventListener('ended', (event) => {
      location.reload(event);
    });

    videoElement.onplaying = function(){
      videoElement.muted = false;
    }
  }
};
window.addEventListener('load', (e) => {
  encenderCamara();
})






