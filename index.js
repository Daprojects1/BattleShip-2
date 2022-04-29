

// class GameBoard {
//     constructor(shipsLength) {
//         this.shipsLength = shipsLength
//         this.board =[]
//     }
//     initBoardArr() {
//         const letters= ["a","b","c","d","e","f","g"]
//         const length =7
//         for (let i = 0; i < length; i++){
//             const mainObj = {}
//             mainObj.positions =[]
//             for (let j = 0; j < length; j++){
//                 const obj = {}
//                 obj.coordinates = `${letters[i]}${j}` 
//                 mainObj.positions.push(obj)
//             }
//             this.board.push(mainObj)
//         }
//         this.initBoardOnPage()
//     }
//     initBoardOnPage() {
//         const body = document.querySelector("body")

//     }

// }

// const game = new GameBoard()
// game.initBoardArr()
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const changeMessageBoard = (msg) => {
    setTimeout(() => {       
        document.querySelector(".msg").innerText = msg
    }, 1000)
}
const createShips = (shipsLength, shipCoordinates, allCoordinates, shipName) => {
    const ships = []
    for (let i = 0; i < shipsLength; i++) {
        for (let j = 0; j < shipsLength; j++) {
            const shipArr = []
            const negCoordinate = allCoordinates[shipCoordinates[j] - 1]
            const ship = allCoordinates[shipCoordinates[j]] || negCoordinate
            const nextShip = allCoordinates[shipCoordinates[j] + 1] || negCoordinate - 1
            const nextShip1 = allCoordinates[shipCoordinates[j] + 2] || negCoordinate - 2
            const currentPlayer = document.querySelector(`.${shipName}`)
            const shipDom = currentPlayer.querySelector(`#${ship}`)
            const shipDom2 = currentPlayer.querySelector(`#${nextShip}`)
            const shipDom3 = currentPlayer.querySelector(`#${nextShip1}`)
            shipDom.classList.add("ship")
            shipArr.push(ship)
            if (shipDom2) {
                // at times the coordinates are null as it doesnt have a follow up value.
                shipDom2.classList.add("ship")
                shipArr.push(nextShip)
            }
            if (shipDom3) {
                // at times the coordinates are null as it doesnt have a follow up value.
                shipDom3.classList.add("ship")
                shipArr.push(nextShip1)
            }
            ships.push(shipArr)
        }
        return ships
    }
}
const generateRandomShips = (coordinatesLength) => {
    const first = 0
    const last = coordinatesLength
    const shipsLength = 4
    const setValues = () => {
        const values = []
        const randomVals = () => {
            for (let i = 0; i < shipsLength; i++) {
                let randomVal = randomIntFromInterval(first, last)
                values.push(randomVal)
            }
            return values
        }
        const vals = randomVals()
        return vals.map((item, index) => {
            for (let i = 0; i < vals.length; i++) {
                if (i !== index && (item === vals[i] || item === vals[i] + 1 || item === vals[i] + 2 || item === vals[i] + 3
                    || item === vals[i] - 1 || item === vals[i] - 2 || item === vals[i] - 3)) {
                    return null
                }
            }
            return vals
        })
    }
    const checkValue = () => {
        const allValues = setValues()
        if (allValues.includes(null)) return checkValue()
        else return allValues[0]
    }
    return checkValue()
    // return [ship1, ship2,ship3,ship4]
}

const getAllCoordinates = (board) => {
    const allCoodinates = []
    if (typeof board === "object" && board.length) {
        board.forEach(boardX => boardX.positions.forEach(position => allCoodinates.push(position.coordinate)))
    }
    return allCoodinates
}

const initBoardOnPage = (board, shipName) => {
    const body = document.querySelector("body")
    const mainDiv = document.createElement("div")
    mainDiv.classList.add("grid")
    mainDiv.classList.add(shipName)
    body.appendChild(mainDiv)
    if (board.length && board[0].positions[0].coordinate) {
        board.forEach(boardX => {
            const xDiv = document.createElement("div")
            boardX.positions.forEach(position => {
                const yDiv = document.createElement("div")
                yDiv.classList.add("coordStyle")
                yDiv.setAttribute("id", `${position.coordinate}`)
                // yDiv.innerHTML = position.coordinate
                position.domObject = yDiv
                xDiv.appendChild(yDiv)
            })
            mainDiv.appendChild(xDiv)
        })
    } else {
        throw new Error("Sorry, the game board has not been initialized")
    }
}

const initBoardArr = (board, name) => {
    if (!board.length && typeof board === "object") {
        const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]
        const length = 10
        for (let i = 0; i < length; i++) {
            const mainObj = {}
            mainObj.positions = []
            for (let j = 0; j < length; j++) {
                const obj = {}
                obj.coordinate = `${letters[i]}${j}`
                mainObj.positions.push(obj)
            }
            board.push(mainObj)
        }
        initBoardOnPage(board, name)
    }
}

const makeBoard = (name) => {
    const playerBoard = []
    initBoardArr(playerBoard, name)
    const allCoordinates = getAllCoordinates(playerBoard)
    const shipCoordinates = generateRandomShips(allCoordinates.length)

    return { playerBoard, shipCoordinates, allCoordinates }
}

const playerShipDetails = (shipCoordinates) => {
    return {
        ships: [...shipCoordinates.map(ship => { return { ship, isHit: [], isSunk: ship.length === 0 } })],
        damageShip(coord) {
          
            const allShips = this.ships
            const hitShip = allShips.map(ships => {
                const shipLength = ships.ship.length;
                ships.ship = ships.ship.filter(shipCoord => shipCoord !== coord)
                if (shipLength > ships.ship.length) {
                    ships.isHit.push(coord)
                  
                    return { ship: ships, coord}
                }
                 else return false
            })
            return hitShip
        },
        handleHitShip(arr, playerDom, gamesConfig,coord) {
            const { shipNames, currentPlayer } = gamesConfig
            if (arr.filter(item => typeof item === "object").length >= 1) {
                  setTimeout(() => {
                        playerDom.querySelector(`#${coord}`).classList.add("green")
                        // alert(`${shipNames[currentPlayer]} HIT ${currentPlayer === 0 ? shipNames[1] : shipNames[0]} at ${coord}`)
                    }, 600)
            } else {
                setTimeout(() => {
                    // alert(shipNames[currentPlayer] + " Miss")
                    playerDom.querySelector(`#${coord}`).classList.add("red")
                },700)
            }
        }
    }
    
}

const GameBoard = (shipsLength) => {
    const gameConfig = {
        player1:0,
        computer:1,
        currentPlayer: 0,
        shipNames: ["playerShip", "computerShip"],
        gameOver:false
    }
    const {player1, computer, shipNames, currentPlayer, gameOver} = gameConfig
    const { playerBoard, shipCoordinates, allCoordinates } = makeBoard(shipNames[0])
    const { playerBoard: compBoad,
        shipCoordinates: compShipCoord,
        allCoordinates: compCoord } = makeBoard(shipNames[1])
    const playerShipsCoord = createShips(shipsLength, shipCoordinates, allCoordinates, shipNames[0])
    const computerShipsCoord = createShips(shipsLength, compShipCoord, compCoord, shipNames[1])
    const player1ShipDets = playerShipDetails(playerShipsCoord)
    const computerShipsDets = playerShipDetails(computerShipsCoord)
    const p = document.createElement("h1")
    const b = document.querySelector("body")
    p.innerText = `CURRENT PLAYER: ${shipNames[currentPlayer]}`
    b.appendChild(p)
    const GameLoop =()=>{
        const {player1, computer, shipNames, currentPlayer, gameOver} = gameConfig
        p.innerText = `CURRENT PLAYER: ${shipNames[currentPlayer]}`
        const player1Dom =  document.querySelector(`.${shipNames[player1]}`)
        const computerDom = document.querySelector(`.${shipNames[computer]}`)
        // computerDom.classList.add("none")
        const inputattack = document.querySelector(".inputAttack")
        if (currentPlayer === computer && !gameOver) { 
            const selectedValue = randomIntFromInterval(0, allCoordinates.length - 1)
            const compSelectedCoord = allCoordinates[selectedValue]
            changeMessageBoard(`computer choose ${compSelectedCoord}`)
            player1Dom.querySelector(`#${compSelectedCoord}`)    
            const hitShips =  player1ShipDets.damageShip(compSelectedCoord)
            player1ShipDets.handleHitShip(hitShips, player1Dom, gameConfig,compSelectedCoord)
            gameConfig.currentPlayer = 0
            GameLoop()
        } else if (currentPlayer === player1 && !gameOver) {
            inputattack.addEventListener("keydown", (e) => {
                e.stopImmediatePropagation()
                e.stopPropagation()
                const value = e.target.value.toLowerCase()
                if (e.code === "Enter") {             
                    if (e.target.value.length && allCoordinates.includes(value)) { 
                        const hitShips = computerShipsDets.damageShip(value)
                        computerShipsDets.handleHitShip(hitShips, computerDom, gameConfig, value)
                        changeMessageBoard(`you choose ${value}`)
                        gameConfig.currentPlayer = 1
                        GameLoop()
                    } else if (!value.length || !allCoordinates.includes(value)) {
                        changeMessageBoard("please input the correct coordinates")
                        
                    } 
                }
            })
            // computerDom.classList.add("none")
            // console.log(attack.c)
            // player1Dom.classList.remove("none")
        }
    }
    GameLoop()
}

GameBoard(4)