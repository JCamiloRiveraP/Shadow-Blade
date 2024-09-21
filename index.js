const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravedad = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/background.png'
})

const tienda = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6,
})

const jugador = new Peleador({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },

    attack2: {
      imageSrc: "./img/samuraiMack/Attack2.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: { 
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
})

const enemigo = new Peleador({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./img/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    attack2: {
      imageSrc: "./img/kenji/Attack2.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
})

console.log(jugador);

const llaves = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

function animar() {
  window.requestAnimationFrame(animar);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  tienda.update();
  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  jugador.update();
  enemigo.update();

  jugador.velocity.x = 0;
  enemigo.velocity.x = 0;

  // jugador movimiento

  if (llaves.a.pressed && jugador.lastKey === "a") {
    jugador.velocity.x = -5;
    jugador.switchSprite("run");
  } else if (llaves.d.pressed && jugador.lastKey === "d") {
    jugador.velocity.x = 5;
    jugador.switchSprite("run");
  } else {
    jugador.switchSprite("idle");
  }

  // saltar
  if (jugador.velocity.y < 0) {
    jugador.switchSprite("jump");
  } else if (jugador.velocity.y > 0) {
    jugador.switchSprite("fall");
  }

  // enemigo movimiento
  if (llaves.ArrowLeft.pressed && enemigo.lastKey === "ArrowLeft") {
    enemigo.velocity.x = -5;
    enemigo.switchSprite("run");
  } else if (llaves.ArrowRight.pressed && enemigo.lastKey === "ArrowRight") {
    enemigo.velocity.x = 5;
    enemigo.switchSprite("run");
  } else {
    enemigo.switchSprite("idle");
  }

  // saltar
  if (enemigo.velocity.y < 0) {
    enemigo.switchSprite("jump");
  } else if (enemigo.velocity.y > 0) {
    enemigo.switchSprite("fall");
  }

  // colisiones y hits
  if (
    rectangularCollision({
      rectangle1: jugador,
      rectangle2: enemigo,
    }) &&
    jugador.isAttacking &&
    jugador.framesCurrent === 4
  ) {
    enemigo.takeHit();
    jugador.isAttacking = false;

    gsap.to("#enemigoSalud", {
      width: enemigo.salud + "%",
    });
  }

  // si el jugador falla
  if (jugador.isAttacking && jugador.framesCurrent === 4) {
    jugador.isAttacking = false;
  }

  // jugador 1 ataca y hace hit
  if (
    rectangularCollision({
      rectangle1: enemigo,
      rectangle2: jugador,
    }) &&
    enemigo.isAttacking &&
    enemigo.framesCurrent === 2
  ) {
    jugador.takeHit();
    enemigo.isAttacking = false;

    gsap.to("#jugadorSalud", {
      width: jugador.salud + "%",
    });
  }

  // si el enemigo falla
  if (enemigo.isAttacking && enemigo.framesCurrent === 2) {
    enemigo.isAttacking = false;
  }

  // fin del juego basado en la vida
  if (enemigo.salud <= 0 || jugador.salud <= 0) {
    determineWinner({ jugador, enemigo, contadorId });
  }
}

animar();

window.addEventListener("keydown", (event) => {
  if (!jugador.dead) {
    switch (event.key) {
      case "d":
        llaves.d.pressed = true;
        jugador.lastKey = "d";
        break;
      case "a":
        llaves.a.pressed = true;
        jugador.lastKey = "a";
        break;
      case "w":
        jugador.velocity.y = -20;
        break;
      case "c":
        jugador.attack();
        break;
      case "v":
        jugador.attack2();
        break;
    }
  }

  if (!enemigo.dead) {
    switch (event.key) {
      case "ArrowRight":
        llaves.ArrowRight.pressed = true;
        enemigo.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        llaves.ArrowLeft.pressed = true;
        enemigo.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemigo.velocity.y = -20;
        break;
      case "ArrowDown":
        enemigo.attack();
        break;
      case "1":
        enemigo.attack2();
      break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      llaves.d.pressed = false;
      break;
    case "a":
      llaves.a.pressed = false;
      break;
  }

  // enemigo llaves
  switch (event.key) {
    case "ArrowRight":
      llaves.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      llaves.ArrowLeft.pressed = false;
      break;
  }
});
