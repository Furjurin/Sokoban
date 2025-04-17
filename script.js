// const map = [
//   [0, 0, 0, 1, 1, 11, 1, 1, 0, 0, 0, 0, 0, 0, 0, 7],
//   [0, 0, 0, 1, 5, 5, 5, 1, 7, 0, 0, 0, 0, 0, 0, 0],
//   [0, 7, 0, 1, 5, 2, 2, 1, 1, 1, 1, 0, 7, 0, 0, 0],
//   [0, 0, 0, 1, 5, 5, 2, 5, 2, 5, 1, 0, 0, 7, 0, 0],
//   [7, 0, 0, 1, 5, 5, 1, 5, 5, 5, 1, 0, 0, 0, 0, 0],
//   [1, 1, 9, 1, 5, 5, 1, 8, 2, 5, 1, 1, 1, 1, 1, 1],
//   [1, 5, 5, 5, 5, 5, 1, 1, 5, 5, 5, 5, 5, 3, 3, 1],
//   [1, 1, 5, 5, 5, 2, 5, 5, 5, 5, 5, 5, 5, 3, 3, 1],
//   [7, 1, 8, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 3, 3, 1],
//   [0, 7, 0, 0, 0, 0, 0, 0, 7, 0, 1, 1, 8, 1, 1, 1],
// ];

const map = [
  [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 11, 1, 1, 0, 0, 0, 0, 0, 0, 0, 7],
  [0, 0, 0, 1, 5, 5, 5, 1, 7, 0, 0, 0, 0, 0, 0, 0],
  [0, 7, 0, 1, 5, 5, 5, 1, 1, 1, 1, 0, 7, 0, 0, 0],
  [0, 0, 0, 1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 7, 0, 0],
  [7, 0, 0, 1, 5, 5, 1, 5, 5, 5, 1, 0, 0, 0, 0, 0],
  [1, 1, 9, 1, 5, 5, 1, 8, 5, 5, 1, 1, 1, 1, 1, 1],
  [1, 5, 5, 5, 5, 5, 1, 1, 5, 5, 5, 5, 5, 3, 3, 1],
  [1, 1, 5, 5, 5, 2, 5, 5, 5, 5, 5, 5, 5, 3, 3, 1],
  [7, 1, 8, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 3, 3, 1],
  [0, 7, 0, 0, 0, 0, 0, 0, 7, 0, 1, 1, 8, 1, 1, 1],
];

const level2 = [
  [0, 1, 1, 1, 0, 0, 0, 0],
  [0, 1, 11, 1, 1, 1, 1, 1],
  [0, 1, 5, 5, 3, 3, 3, 1],
  [0, 1, 1, 5, 5, 5, 5, 1],
  [0, 0, 1, 1, 5, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 0, 0],
  [0, 0, 0, 1, 5, 1, 0, 0],
  [1, 9, 1, 1, 5, 1, 0, 0],
  [1, 5, 2, 5, 5, 1, 1, 0],
  [1, 5, 1, 2, 5, 5, 1, 0],
  [1, 5, 5, 5, 1, 5, 1, 0],
  [1, 1, 1, 5, 5, 5, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 0],
];

const level3 = [[], [], [], [], [], [], [], [], [], [], [], []];

const man = {
  y: 7,
  x: 2,
  value: 5,
};

const tileClasses = {
  7: "emptiness",
  0: "emptiness2",
  1: "wall",
  2: "box",
  3: "checkPoint",
  5: "floor",
  8: "door2",
  9: "door",
  11: "closeDoor",
  12: "door",
  23: "boxAtCheckpoint",
};

const gameContainer = document.getElementById("game");

function drawMap() {
  gameContainer.style.gridTemplateColumns = `repeat(${map[0].length}, 40px)`;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const cell = document.createElement("div");
      cell.className = `cell ${tileClasses[map[y][x]]}`;
      cell.id = `cell-${y}-${x}`;
      gameContainer.appendChild(cell);
    }
  }
}

drawMap();

function updateCell(y, x, type) {
  document.querySelector(`#cell-${y}-${x}`).className = `cell ${type}`;
}

updateCell(man.y, man.x, "man");

function updateManPosition(oldY, oldX, newY, newX, fromType, newValue) {
  Steps();
  updateCell(oldY, oldX, fromType);
  updateCell(newY, newX, "man");
  man.y = newY;
  man.x = newX;
  man.value = newValue;
}

function updateManPositionOutBox(oldY, oldX, newY, newX, fromType, newValue) {
  updateManPosition(oldY, oldX, newY, newX, fromType, newValue);
  updateCell(newY, newX, "man");
}

function pushBox(fromTypeC, toY, toX, boxType) {
  map[man.y][man.x] = fromTypeC;
  map[toY][toX] = boxType;
  updateCell(man.y, man.x, "man");
  updateCell(toY, toX, tileClasses[boxType]);
  checkWin();
}

document.addEventListener("keydown", (event) => {
  let y = 0;
  let x = 0;

  switch (event.code) {
    case "ArrowUp":
      y = -1;
      break;
    case "ArrowDown":
      y = 1;
      break;
    case "ArrowLeft":
      x = -1;
      break;
    case "ArrowRight":
      x = 1;
      break;
  }

  const newManY = man.y + y;
  const newManX = man.x + x;
  const nextCell = map[newManY][newManX];
  const oldValue = man.value;
  const boxNewY = newManY + y;
  const boxNewX = newManX + x;
  const afterBox = map[boxNewY][boxNewX];

  if (nextCell === 1) {
    return;
  } else if (nextCell === 3 && (oldValue === 5 || oldValue === 34)) {
    const fromType = oldValue === 5 ? "floor" : "checkPoint";
    updateManPositionOutBox(man.y, man.x, newManY, newManX, fromType, 34);
  } else if (nextCell === 5 && (oldValue === 34 || oldValue === 5)) {
    const fromType = oldValue === 5 ? "floor" : "checkPoint";
    updateManPositionOutBox(man.y, man.x, newManY, newManX, fromType, 5);
  } else if (nextCell === 2 || nextCell === 23) {
    if (afterBox === 5 && (man.value === 5 || man.value === 15)) {
      const fromTypeC = man.value === 5 ? 5 : 3;
      const fromType = man.value === 5 ? "floor" : "checkPoint";
      updateManPosition(man.y, man.x, newManY, newManX, fromType, 5);
      pushBox(fromTypeC, boxNewY, boxNewX, 2);
    } else if (
      afterBox === 3 &&
      man.value === 5 &&
      map[newManY][newManX] === 2
    ) {
      updateManPosition(man.y, man.x, newManY, newManX, "floor", 15);
      pushBox(5, boxNewY, boxNewX, 23);
    } else if (
      afterBox === 3 &&
      ((man.value === 5 && map[newManY][newManX] === 23) || man.value === 15)
    ) {
      updateManPosition(man.y, man.x, newManY, newManX, "floor", 34);
      pushBox(3, boxNewY, boxNewX, 23);
    } else if ((afterBox === 3 || afterBox === 5) && man.value === 34) {
      const newValue = afterBox === 3 ? 34 : 15;
      const boxType = afterBox === 3 ? 23 : 2;
      updateManPosition(man.y, man.x, newManY, newManX, "checkPoint", newValue);
      pushBox(3, boxNewY, boxNewX, boxType);
    }
  } else if ((nextCell === 5 || nextCell === 3) && oldValue === 15) {
    const fromType = nextCell === 5 ? "floor" : "checkPoint";
    const newValue = nextCell === 5 ? 5 : 34;
    updateManPositionOutBox(man.y, man.x, newManY, newManX, fromType, newValue);
  } else if (nextCell === 12) {
    loadLevel(level2, 8, 1);
  }
  console.log(nextCell);
  console.log(`x = ${man.x}, y = ${man.y}`);
  console.log(`cell = ${map[man.y][man.x]}`);
  console.log(` value = ${man.value}`);
});

const stepsElement = document.getElementById("steps");
const timeElement = document.getElementById("time");

const StepCounter = () => {
  let steps = 0;
  return () => {
    steps++;
    stepsElement.textContent = `Steps: ${steps}`;
  };
};

const Steps = StepCounter();

let seconds = 0;

function startTimer() {
  setInterval(() => {
    seconds++;
    timeElement.textContent = `Time: ${seconds} sec`;
  }, 1000);
}

function checkWin() {
  for (let row of map) {
    if (row.includes(2)) return false;
  }
  document.getElementById("winModal").classList.remove("hidden");
  music.pause();
  return true;
}

const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const music = document.getElementById("bg-music");

startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  startTimer();
  music.play();
});

document.getElementById("ok-btn").addEventListener("click", () => {
  document.getElementById("winModal").classList.add("hidden");
  let opened = false;
  let closed = false;

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 11 && !opened) {
        map[y][x] = 12;
        updateCell(y, x, tileClasses[9]);
        opened = true;
      } else if (map[y][x] === 9 && !closed) {
        map[y][x] = 11;
        updateCell(y, x, tileClasses[11]);
        closed = true;
      }
      if (opened && closed) break;
    }
    if (opened && closed) break;
  }
});

function loadLevel(newMap, startY, startX) {
  map.length = 0;
  for (let row of newMap) {
    map.push([...row]);
  }
  gameContainer.innerHTML = "";
  drawMap();
  man.y = startY;
  man.x = startX;
  man.value = 5;
  updateCell(man.y, man.x, "man");
}
