function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
      rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
      rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
      rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
  }
  
  function determineWinner({ jugador, enemigo, contadorId }) {
    clearTimeout(contadorId)
    document.querySelector('#pantallaTexto').style.display = 'flex'
    if (jugador.salud === enemigo.salud) {
      document.querySelector('#pantallaTexto').innerHTML = 'Empate'
    } else if (jugador.salud > enemigo.salud) {
      document.querySelector('#pantallaTexto').innerHTML = 'Jugador 1 Gana'
    } else if (jugador.salud < enemigo.salud) {
      document.querySelector('#pantallaTexto').innerHTML = 'Jugador 2 Gana'
    }
  }
  
  let contador = 60
  let contadorId
  function decreaseTimer() {
    if (contador > 0) {
      contadorId = setTimeout(decreaseTimer, 1000)
      contador--
      document.querySelector('#contador').innerHTML = contador
    }
  
    if (contador === 0) {
      determineWinner({ jugador, enemigo, contadorId })
    }
  }