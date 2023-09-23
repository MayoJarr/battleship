class Ship {
    constructor(lenght, key, hits = 0, sunkState = false){
        this.length = lenght;
        this.hits = hits;
        this.sunkState = sunkState;
        this.key = key;
    }
    hit() {
        this.hits++;
    }
    isSunk(){
      if (this.hits == this.length) {
        this.sunkState = !this.sunkState;
        return true;
      }
      return false;
    }
}
class Gameboard {
  constructor(name) {
    this.name = name;
  }
  coordsTable = [];
  ships = [];
  getName() {
    return this.name
  }
  makeBoard() {
    for(let x = 0; x < 10; x++) {
      this.coordsTable[x] = []
      for(let y = 0; y < 10; y++){
        this.coordsTable[x][y] = 0;
      }
    }
  }
  placeShip(ship, x, y, orient = 0) {
    let l = ship.length;
    if (orient == 0) {
      if (y + l > 10) return 1;
      for(let i = 0; i < l; i++) if(this.coordsTable[y+i][x] != 0) return 1;
      for (let i = 0; i < l; i++) this.coordsTable[y+i][x] = ship.key;
    }
    else if (orient == 1) {
      if (x + l > 10) return 1;
      for(let i = 0; i < l; i++) if(this.coordsTable[y][x+i] != 0) return 1;
      for (let i = 0; i < l; i++) this.coordsTable[y][x+i] = ship.key;
    }
    this.ships.push(ship)
    return 0;
  }
  receiveAttack(x,y) {
    if(this.coordsTable[y][x] == 'm' || this.coordsTable[y][x] == 'h' || this.coordsTable[y][x] == 's') return 1;
    let attackedShip = this.ships.find(ship => ship.key == this.coordsTable[y][x])
    if (attackedShip == undefined) {
      this.coordsTable[y][x] = 'm'
      return
    }
    this.coordsTable[y][x] = 'h'
    attackedShip.hit();
    if (attackedShip.isSunk()) this.coordsTable[y][x] = 's'
  }
  getTable() {
    return this.coordsTable;
  }
  areAllSunked() {
    if (this.ships.find(ship => ship.isSunk() == false) == undefined) return true;
    return false;
  }
  randomAtt(gb) {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    const isOk = this.receiveAttack(x, y);
    if(isOk == 1) this.randomAtt(gb)
  }
}

// get the html nodes
const gbs = document.querySelector('.game');
const welcomeMenu = document.querySelector('.welcomeMenu');
const gameoverMenu = document.querySelector('.gameoverMenu');
const winnerText = document.querySelector('.winner')
const ships = document.querySelector('.ships')
const orientBtn = document.querySelector('.orient')
const leftgb = document.querySelector('.leftGB');
const rightGB = document.querySelector('.rightGB')

const vsC = document.querySelector('.vsC');
const vsP = document.querySelector('.vsP');

const btns = document.querySelectorAll('.btn');
btns.forEach(btn => {
  btn.addEventListener('click', handleBtnClick)
})

orientBtn.addEventListener('click', () => switchOrient())

//create gameboard objects and 10x10 grid
let gameboard1;
let gameboard2;

// indicate that player starts
let playerTurn;

// create arrays and populate them
let ships1;
let ships2;

// get the grids from gb objects and render them on screen
//const gb1 = gameboard1.getTable()
//const gb2 = gameboard2.getTable()
//renderrr(leftgb, gameboard1.getName())
//renderrr(rightGB, gameboard2.getName())

// render the menu with ships for placement




// pseudo code
// show welcome
// choose mode
// if vs ai 
// player places ships and ai randomize their ships
// game
// if vs player
// let players place ships
// game
// gameOver

init()
function init() {
  gbs.classList.add('unvisible');
  gameoverMenu.classList.add('unvisible');
  welcomeMenu.classList.remove('unvisible');
  gameboard1 = new Gameboard(1);
  gameboard2 = new Gameboard(2)
  gameboard1.makeBoard()
  gameboard2.makeBoard()
  playerTurn = true;
  ships1 = []
  ships2 = []
  createShips(ships1)
  createShips(ships2)
  ships.textContent = ''
}
function startGame() {
  leftgb.textContent = ''
  rightGB.textContent = ''
  const gb1 = gameboard1.getTable()
  const gb2 = gameboard2.getTable()
  placeShips(ships2, gameboard2)
  renderGB(leftgb, gb1, gameboard1)
  renderGB(rightGB, gb2, gameboard2)
}
function placingShips() {
  leftgb.textContent = ''
  rightGB.textContent = ''
  renderrr(leftgb, gameboard1.getName())
  renderrr(rightGB, gameboard2.getName())
  renderShipChooseMenu(ships1)
}

// welcome menu

function handleBtnClick(e) {
  if(e.target.dataset.func == 'c') launchSingleplayer()
  else if(e.target.dataset.func == 'p') launchVsPlayer()
  else if(e.target.dataset.func == 'r') restartGame()
}
function showGbs() {
  gameoverMenu.classList.add('unvisible')
  welcomeMenu.classList.add('unvisible')
  gbs.classList.remove('unvisible')
}

function launchSingleplayer() {
  showGbs()
  placingShips()
}

// Shared functions
function createShips(ships) {
  let j = 1;
  for (let i = 0; i < 4; i++) ships.push(new Ship(2, j++));
  //for (let i = 0; i < 4; i++) ships.push(new Ship(3));
  for (let i = 0; i < 3; i++) ships.push(new Ship(3, j++));
  for (let i = 0; i < 2; i++) ships.push(new Ship(4, j++));
  ships.push(new Ship(5, j++));
}

const renderGB = (gbSide, table, gb) => {
  table.forEach((item, index) => {
    item.forEach((element, ind) => {
      const thing = document.createElement('div');
      thing.classList.add(`cell-${gb.name}`)
      thing.textContent = element
      if (element >= 1) thing.style.cssText = 'background-color: green;'
      gbSide.appendChild(thing)
      thing.addEventListener('click', () => handleClick(ind, index), {once: true})
    })
  })
}

function reRender(table, gbNum) {
  const cells = document.querySelectorAll(`.cell-${gbNum}`)
  let i = 0;
  table.forEach(item => {
    item.forEach(element => {
      if (element == 'h') cells[i].style.cssText = 'background-color: orange;'
      if (element == 's') cells[i].style.cssText = 'background-color: red;'
      if (element == 'm') cells[i].style.cssText = 'background-color: black;'
      if (element >= 1) cells[i].style.cssText = 'background-color: green;'
      cells[i].textContent = element
      i++;
    })
  })
  let whichGB = gbNum == 1 ? gameboard1 : gameboard2
  if(whichGB.areAllSunked() == true) showGameoverMenu(playerTurn);
}

// Single player mode functions
// Single player mode functions
// Single player mode functions

function placeShips(ships, gb) {
  ships.forEach(ship => placeShip(ship, gb))
}
function placeShip(ship, gb) {
  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);
  const orient = Math.floor(Math.random() * 2);
  const isOk = gb.placeShip(ship, x, y, orient);
  if (isOk == 1) placeShip(ship, gb)
  return 0;
}
function handleClick(x,y) {
  gameboard2.receiveAttack(x,y)
  gameboard1.randomAtt()
  reRender(gameboard1.getTable(), gameboard1.getName())
  reRender(gameboard2.getTable(), gameboard2.getName())
}

// Two Players mode functions


// game over menu

const restartGame = () => init()

function showGameoverMenu(winner) {
  gameoverMenu.classList.remove('unvisible');
  gbs.classList.add('unvisible')
  winnerText.textContent = winner ? 'Player wins' : 'Computer wins';
}

// placing ships functions
// placing ships functions
// placing ships functions

let selectedShip
let selectedOrientation = 0;

function renderrr(gbSide, gbName) {
  for(let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const thing = document.createElement('div');
      thing.classList.add(`cell-${gbName}`)
      gbSide.appendChild(thing)
      thing.addEventListener('click', () => placeOnBoard(j, i), {once: true})
    }
  }
}
function placeOnBoard(x, y) {
  if(gameboard1.placeShip(selectedShip, x, y, selectedOrientation) == 1) return 1;
  const ind = ships1.findIndex(ship => ship.key == selectedShip.key)
  ships1.splice(ind, 1)
  if (ships1.length == 0) startGame()
  selectedShip = ''
  reRender(gameboard1.getTable(), 1)
  shipGoDark();
}
function shipGoDark() {
  const selectedShipNode = document.querySelector('.selectedShip')
  selectedShipNode.classList.remove('selectedShip');
  selectedShipNode.classList.add('placedShip')
}
function chooseShip(ship) {
  selectedShip = ship
}
function renderShipChooseMenu() {
  ships1.forEach(ship => {
    const shipDiv = document.createElement('div');
    shipDiv.classList.add('ship')
    shipDiv.style.cssText = `width: ${ship.length*10}px;`
    shipDiv.textContent = `length: ${ship.length}`
    ships.appendChild(shipDiv)
    shipDiv.addEventListener('click', () => {
      const shipss = document.querySelectorAll('.selectedShip')
      shipss.forEach(selShip => selShip.classList.remove('selectedShip'))
      chooseShip(ship)
      shipDiv.classList.add('selectedShip')
    })
  })
}
function switchOrient() {
  if (selectedOrientation == 1) {
    selectedOrientation = 0
    orientBtn.textContent = 'y'
  }
  else if (selectedOrientation == 0) {
    selectedOrientation = 1
    orientBtn.textContent = 'x'
  }
}