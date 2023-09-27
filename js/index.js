class Ship {
    constructor(lenght, key, hits = 0, sunkState = false, coords = []){
        this.length = lenght;
        this.hits = hits;
        this.sunkState = sunkState;
        this.key = key;
        this.coords = coords
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
    setCoords(setOfCoords) {
      this.coords.push(setOfCoords)
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
      for (let i = 0; i < l; i++) {
        this.coordsTable[y+i][x] = ship.key;
        ship.setCoords([x, y+i])
      }
    }
    else if (orient == 1) {
      if (x + l > 10) return 1;
      for(let i = 0; i < l; i++) if(this.coordsTable[y][x+i] != 0) return 1;
      for (let i = 0; i < l; i++) {
        this.coordsTable[y][x+i] = ship.key;
        ship.setCoords([x+i, y])
      }
    }
    this.ships.push(ship)
    return 0;
  }
  receiveAttack(x,y) {
    if(this.coordsTable[y][x] == 'm' || this.coordsTable[y][x] == 'h' || this.coordsTable[y][x] == 's') return 1;
    let attackedShip = this.ships.find(ship => ship.key == this.coordsTable[y][x])
    if (attackedShip == undefined) {
      this.coordsTable[y][x] = 'm'
      return {hit: 'm', x, y}
    }
    this.coordsTable[y][x] = 'h'
    attackedShip.hit();
    if (attackedShip.isSunk()) {
      this.coordsTable[y][x] = 's'
      this.markSunked()
      return {hit: 's', x, y}
    }
    return {hit:'h', x, y}
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
    return isOk
  }
  markSunked() {
    const sunkedShips = this.ships.filter(ship => ship.sunkState == true)
    sunkedShips.forEach(sunkedShip => {
      for(let i = 0; i < sunkedShip.length; i++) {
        this.coordsTable[sunkedShip.coords[i][1]][sunkedShip.coords[i][0]] = 's'
      }
    })    
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

const leftOl = document.querySelector('.left-overlay')
const rightOl = document.querySelector('.right-overlay')

const vsC = document.querySelector('.vsC');
const vsP = document.querySelector('.vsP');

const btns = document.querySelectorAll('.btn');
btns.forEach(btn => {
  btn.addEventListener('click', handleBtnClick)
})

orientBtn.addEventListener('click', () => switchOrient())

let gameboard1;
let gameboard2;

let playerTurn;

let ships1;
let ships2;

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
function launchVsPlayer() {
  alert('not available yet')

}

// Shared functions
function createShips(ships) {
  let j = 1;
  //for (let i = 0; i < 4; i++) ships.push(new Ship(2, j++));
  //for (let i = 0; i < 4; i++) ships.push(new Ship(3));
  //for (let i = 0; i < 3; i++) ships.push(new Ship(3, j++));
  for (let i = 0; i < 2; i++) ships.push(new Ship(4, j++));
  ships.push(new Ship(5, j++));
}

const renderGB = (gbSide, table, gb) => {
  table.forEach((item, index) => {
    item.forEach((element, ind) => {
      const thing = document.createElement('div');
      thing.classList.add(`cell-${gb.name}`)
      //thing.textContent = element
      //if (element >= 1) thing.style.cssText = 'background-color: green;'
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
      if (gbNum == 1) if (element >= 1) cells[i].style.cssText = 'background-color: green;'
      //cells[i].textContent = element
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
//  random ai shot
let firstHit = 'r'
let lastHit = {hit: 'm'}
let axis
let proposedAttack = 'r'
let rAttack
let hit
function handleClick(x,y) {
  gameboard2.receiveAttack(x,y)
  handleAiAttack();
  reRender(gameboard1.getTable(), gameboard1.getName())
  reRender(gameboard2.getTable(), gameboard2.getName())
}
function handleAiAttack() {
  if (proposedAttack == 'r') {
    rAttack = gameboard1.randomAtt()
    console.log(rAttack)
    if (rAttack.hit == 'h') proposedAttack = 'findAxis'
  }
  else if (proposedAttack == 'findAxis') {
    const whereTohit = Math.floor(Math.random() * 4);
    switch(whereTohit) {
      case 0:
        hit = gameboard1.receiveAttack(rAttack.x+1, rAttack.y) 
        break;
      case 1:
        hit = gameboard1.receiveAttack(rAttack.x-1, rAttack.y)
        break;
      case 2:
        hit = gameboard1.receiveAttack(rAttack.x, rAttack.y + 1)
        break;
      case 3:
        hit = gameboard1.receiveAttack(rAttack.x, rAttack.y -1 )
        break;
    }
    if (hit.hit == 'h') {
      console.log({hit, rAttack})
      if (hit.x == rAttack.x) {
        proposedAttack = 'hitAxis'
        axis = 'y'
      }
      else if (hit.y == rAttack.y) {
        proposedAttack = 'hitAxis'
        axis = 'x'
      }
    }
    if (hit == 1) console.log('error')
  }
  else if (proposedAttack == 'hitAxis') {
    const whereToHit = Math.floor(Math.random() * 2);

  }
}
let recCounter = 0

// Two Players mode functions


// game over menu

const restartGame = () => init()

function showGameoverMenu(winner) {
  gameoverMenu.classList.remove('unvisible');
  //gbs.classList.add('unvisible')
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
      thing.addEventListener('click', () => placeOnBoard(j, i))
    }
  }
}
function placeOnBoard(x, y) {
  if(gameboard1.placeShip(selectedShip, x, y, selectedOrientation) == 1) return 1;
  else if(selectedShip == '') return 1;
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
    shipDiv.style.cssText = `width: ${ship.length*40}px; grid-template-columns: repeat(${ship.length}, auto);`
    ships.appendChild(shipDiv)
    for(let i = 0; i < ship.length; i++) {
      const grid = document.createElement('div');
      grid.classList.add('shipElement')
      shipDiv.appendChild(grid)
    }
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
    switchShipsTo('y')
  }
  else if (selectedOrientation == 0) {
    selectedOrientation = 1
    orientBtn.textContent = 'x'
    switchShipsTo('x')
  }
}
let shipsss
function switchShipsTo(orient) {
  shipsss = document.querySelectorAll('.ship')
  if (orient == 'y') shipsss.forEach(ship => {
    ship.classList.remove('x')
    ship.classList.add('y')
  })
  else if (orient == 'x') shipsss.forEach(ship => {
    ship.classList.remove('y')
    ship.classList.add('x')
  })
}
