function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const changeMessageBoard = (msg, timeout) => {
    const msgDiv = document.querySelector(".inner-msg")
    if (msg) {      
        const p = document.createElement("p")
        p.innerText = msg
        setTimeout(() => {       
            msgDiv.appendChild(p)
        }, timeout || 20)
    } else if (!msg && !timeout) {
        setTimeout(() => {          
            msgDiv.innerHTML =""
        },0)
    }
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
                // at times the coordinates are null as it may npt select a valid value.
                shipDom2.classList.add("ship")
                shipArr.push(nextShip)
            }
            if (shipDom3) {
                // at times the coordinates are null as it may not select a valid value.
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
                position.domObject = yDiv
                xDiv.appendChild(yDiv)
            })
            mainDiv.appendChild(xDiv)
        })
    } else {
        throw new Error("Sorry, the game board has not been initialized")
    }
}

// initializes the array for board items and then calls the init board on the page.
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

// handles the details and methods for each ship. 
const playerShipDetails = (shipCoordinates) => {
    return {
        allHitValues:[],
        ships: [...shipCoordinates.map(ship => { return { ship, isHit: [], isSunk: false, sLength: ship.length} })],
        damageShip(coord, gameConfig) {
            const allShips = this.ships.map(ships => ships.ship)
            // rewrite this logic.  Can be very hard to read.
            const hitShip = allShips.map((ship, i) => {
                const currentShip = this.ships[i]
                const shipLength = ship.length;
                ship = ship.filter(shipCoord => shipCoord !== coord)
                if (this.beenSelected(coord)) {
                    gameConfig.sameValue = true
                    return "been already hit"
                } 
                if (shipLength > ship.length) {
                    if (ship.length === currentShip.isHit.length) currentShip.isSunk = true
                    currentShip.isHit.push(coord)
                    return { currentShip, coord }
                }
                else {
                    return false
                }
            })
 
            return hitShip
        },
        handleHitShip(currentShip, playerDom, gamesConfig, coord) {
            const { shipNames, currentPlayer } = gamesConfig
            const timeoutVal = currentPlayer === 0 ? 600 : 1000
            const ship = currentShip.filter(i => typeof i === "object")[0]
            if (ship) {
                const mainShip = ship.currentShip
                if (mainShip.ship.length === mainShip.isHit.length) {
                    changeMessageBoard()
                    changeMessageBoard(`${shipNames[currentPlayer]} 
                    has KNOCKED OUT ${currentPlayer === 0 ? shipNames[1] : shipNames[0]}'S ship AT ${mainShip.ship.join(" ").toUpperCase()}`, timeoutVal)
                } else {
                    changeMessageBoard(`${shipNames[currentPlayer]} HIT ${currentPlayer === 0 ? shipNames[1] : shipNames[0]} at ${coord}`,timeoutVal)
                }
                playerDom.querySelector(`#${coord}`).classList.add("green")
            } else if (currentShip.filter(i => typeof i === "string").length >= 1) {
                changeMessageBoard(`Sorry cannot hit the same spot again !`)
            } else {
                changeMessageBoard(`${shipNames[currentPlayer]} has MISSED at ${coord}`, timeoutVal)
                playerDom.querySelector(`#${coord}`).classList.add("red")
            }
            this.allHitValues.push(coord)
        },
        beenSelected(coord) {
            // function to make sure that you dont select a value twice. 
            const isBeenSelected = this.allHitValues.filter(hitCoord => hitCoord === coord)
            if (isBeenSelected.length >= 1) return true 
            else false 
        }
        ,
        isAllShipsSunk(currentPlayer) {
            const isShipSunk = this.ships.map(ship => ship.isSunk)
            if (isShipSunk.includes(false)) return null
            else {
                changeMessageBoard(`${currentPlayer} has WON!`, 1100)
                return true
            }
        }
    }
    
}

// NEEDS WORK. ALLOWS COMP TO MAKE SMART SELECTIONS.
const smartSelectCoord = (selectedValue) => {
    return selectedValue
}

// Makes sure conditions are met so that player can change to the next. 
const canChangeCurrentPlayer = (gameConfig, val) => {
    if (!gameConfig.sameValue) gameConfig.currentPlayer = val
}
const GameBoard = (shipsLength) => {
    const gameConfig = {
        player1: 0,
        computer: 1,
        currentPlayer: 0,
        shipNames: ["playerShip", "computerShip"],
        gameOver: false,
        gameStarted: null,
        sameValue: false, 
    }
    let {player1, computer, shipNames} = gameConfig
    const { playerBoard, shipCoordinates, allCoordinates } = makeBoard(shipNames[0])
    const { playerBoard: compBoad,
        shipCoordinates: compShipCoord,
        allCoordinates: compCoord } = makeBoard(shipNames[1])
    const playerShipsCoord = createShips(shipsLength, shipCoordinates, allCoordinates, shipNames[0])
    const computerShipsCoord = createShips(shipsLength, compShipCoord, compCoord, shipNames[1])
    const player1ShipDets = playerShipDetails(playerShipsCoord)
    const computerShipsDets = playerShipDetails(computerShipsCoord)
    // const p = document.createElement("h1")
    // const b = document.querySelector("body")
    // b.appendChild(p)
    const GameLoop = () => {
        gameConfig.sameValue = false
        const { currentPlayer } = gameConfig
        const player1Dom =  document.querySelector(`.${shipNames[player1]}`)
        const computerDom = document.querySelector(`.${shipNames[computer]}`)
        const inputattack = document.querySelector(".inputAttack")
        changeMessageBoard()  
        if (currentPlayer === computer && !gameConfig.gameOver) { 
            gameConfig.gameStarted = true
            const selectedValue = randomIntFromInterval(0, allCoordinates.length - 1)
            const compSelectedCoord = allCoordinates[smartSelectCoord(selectedValue)] 
            player1Dom.querySelector(`#${compSelectedCoord}`)    
            const hitShips = player1ShipDets.damageShip(compSelectedCoord, gameConfig)
            player1ShipDets.handleHitShip(hitShips, player1Dom, gameConfig, compSelectedCoord)
            gameConfig.gameOver = player1ShipDets.isAllShipsSunk(shipNames[currentPlayer])
            canChangeCurrentPlayer(gameConfig,0)
            GameLoop()
        } else if (currentPlayer === player1 && !gameConfig.gameOver) {
            const attackComp = (e) => {
                const value = e.target.value.toLowerCase()
                if (e.code === "Enter" && !gameConfig.gameOver) {             
                    if (e.target.value.trim().length && allCoordinates.includes(value)) { 
                        const hitShips = computerShipsDets.damageShip(value, gameConfig)
                        computerShipsDets.handleHitShip(hitShips, computerDom, gameConfig, value)
                        gameConfig.gameOver = computerShipsDets.isAllShipsSunk(shipNames[currentPlayer])
                        canChangeCurrentPlayer(gameConfig,1)
                        GameLoop()
                    } else if (!value.length || !allCoordinates.includes(value)) {
                        changeMessageBoard()
                        changeMessageBoard("please input the correct coordinates",500)
                    } 
                }
            }
            if (!gameConfig.gameStarted) { 
                //allows the event listener to be added only once.
                inputattack.addEventListener("keydown", attackComp)
                gameConfig.gameStarted = true
            }
            if (gameConfig.gameOver) {
                inputattack.removeEventListener("keydown", attackComp)
            }
        }
    }
    GameLoop()
}

GameBoard(4)