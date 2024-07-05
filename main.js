let preguntas = [];
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
const cells = document.querySelectorAll("td");

// Obtener preguntas de la API
function obtenerPreguntas() {
  const url = 'http://localhost:3001/preguntas';

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al hacer la solicitud: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      preguntas = data;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
obtenerPreguntas();

function mostrarPreguntaAleatoria(callback) {
  if (preguntas.length > 0) {
    const pregunta = preguntas[Math.floor(Math.random() * preguntas.length)];
    const respuesta = prompt(
      `${pregunta.Pregunta}\n1: ${pregunta.Respuesta1}\n2: ${pregunta.Respuesta2}\n3: ${pregunta.Respuesta3}`
    );
    if (parseInt(respuesta) === pregunta.Verdadera) {
      callback();
    } else {
      alert("Respuesta incorrecta, intenta nuevamente.");
    }
  } else {
    alert("No hay preguntas disponibles.");
  }
}

cells.forEach((cell) => {
  cell.addEventListener("click", handleClick);
});

function handleClick(event) {
  const cellIndex = Array.from(cells).indexOf(event.target);
  if (board[cellIndex] != "") {
    return;
  }

  mostrarPreguntaAleatoria(() => {
    board[cellIndex] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (checkWin()) {
      audioGanador();
      alert(`¡${currentPlayer} ha ganado!`);
    } else {
      currentPlayer = currentPlayer == "X" ? "O" : "X";
    }
  });
}
function audioGanador(){
  let audio = new Audio('./sonidos/Efecto de Sonido Victoria.mp3');
  audio.play();
}
function checkWin() {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // horizontales
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // verticales
    [0, 4, 8],
    [2, 4, 6], // diagonales
  ];

  return winConditions.some(condition => {
    return condition.every(index => board[index] === currentPlayer);
  });
}

function reiniciarJuego() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.style.backgroundColor = "";
  });
}
document.getElementById('reiniciar').addEventListener('click', reiniciarJuego);

// Menu toggle
document.getElementById('menu-icon').addEventListener('click', function() {
  var menu = document.getElementById('menu');
  menu.classList.toggle('show');
});