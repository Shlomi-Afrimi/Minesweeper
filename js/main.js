'set strict'

const MINE = 'MINE'
const MINE_IMAGE = '💣'
const FLAG_IMAGE = '🚩'
const LIFE = '💜'
const LIFE_LOST = '🖤'
var gLevel = [{size: 4, mines: 2, lives: 1},
    {size: 8, mines: 14, lives: 2},
    {size: 12, mines: 32, lives:3}
]

var startTime 
var gChoice
var gLevelChosen
var gTimerInterval
gLevelChosen = gLevel[0]
var gBoard = []
var gMat = []
var livesArray = [LIFE]

var gGame = { isOn: true, shownCount: 0, markedCount: 0, secsPassed: 0 }
var gLivesLostCount = 0
var clicksCount = 0

function onLevelChosen(choice){
    const elSmiley = document.querySelector('.game-result')
    elSmiley.innerHTML = '😐'
    gChoice =choice
    gLevelChosen = gLevel[choice]
    onShowLives()
    clearInterval(gTimerInterval)
    gGame.secsPassed = 0
    const elTimer = document.querySelector('.seconds')
    elTimer.innerText = (Math.round(gGame.secsPassed) + '').padStart(2, '0')
    gGame.isOn = true
    gLivesLostCount = 0
    onInit()
}

function onInit(){
    gBoard =[]
    gMat = []
    clicksCount = 0
    gGame = { isOn: true, shownCount: 0, markedCount: 0, secsPassed: 0 }
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard(){
    for (var i = 0; i < gLevelChosen.size; i++) {
        gMat.push([])
        for (var j = 0; j < gLevelChosen.size; j++) {
            gMat[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
        }
    }
    return gMat
}

function buildBoard2(gBoard,cellI,cellJ){
    var minesDrawCount = 0
    while (minesDrawCount < gLevelChosen.mines){
        const drawI = [getRandomInt(0, gLevelChosen.size)]
        const drawJ = [getRandomInt(0, gLevelChosen.size)]
        if (gBoard[drawI][drawJ].isMine === false && (+[drawI] !== cellI || +[drawJ] !== cellJ)){
            gBoard[drawI][drawJ].isMine = true
            minesDrawCount++
        }
    }
    const boardNegs = []
    for (var i = 0; i < gLevelChosen.size; i++) {
        boardNegs.push([])

        for (var j = 0; j < gLevelChosen.size; j++) {
            const negsCount1 = setMinesNegsCount(i ,j)
            boardNegs[i][j] = { minesAroundCount: negsCount1, isShown: gBoard[i][j].isShown , isMine: gBoard[i][j].isMine, isMarked: gBoard[i][j].isMarked }
        }
    }
    gBoard =  boardNegs
    return gBoard
}

function renderBoard(gBoard){
    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            cell = ''
            const className = `cell cell-${i}-${j}`
            strHTML += `<td data-i=${i} data-j=${j} onmouseup="onCellRightClicked(${i}, ${j}, event)" onclick="onCellClicked(this, ${i}, ${j})" class="cell ${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

function onCellClicked(elCell, cellI, cellJ){
    if(clicksCount === 0){
        gBoard = buildBoard2(gBoard,cellI,cellJ)
        clicksCount = 1
        gGame.secsPassed = 0
        startTime = Date.now()
        gTimerInterval = setInterval(onTime ,500)
    }
    if(!gGame.isOn)return
    if(elCell.style.backgroundColor === 'yellow') return
    else if(gBoard[cellI][cellJ].isMine === true) {
        elCell.style.backgroundColor = 'red'
        elCell.innerHTML = '💣'
        onLiveLost()
        gLivesLostCount++
        checkGameOver()
        return
        }
        else if(elCell.style.backgroundColor !== 'white'){
            gBoard[cellI][cellJ].isShown = true
            elCell.style.backgroundColor = 'white'
            gGame.shownCount++
            } 

    checkGameOver()
    if (gBoard[cellI][cellJ].minesAroundCount > 0) {
        elCell.innerHTML = gBoard[cellI][cellJ].minesAroundCount
    }
    if((gBoard[cellI][cellJ].isMine === false) && gBoard[cellI][cellJ].minesAroundCount === 0) expandShown(cellI, cellJ)
}

function onCellRightClicked(i ,j , event){
    if (!gGame.isOn) return
    // console.log(checkGameOver())
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    if(event.button === 2 && elCell.innerHTML === '' && elCell.style.backgroundColor !== 'red' && elCell.style.backgroundColor !== 'white') {
        gBoard[i][j].isMarked =true
        elCell.innerHTML = FLAG_IMAGE
        gGame.markedCount++
        elCell.style.backgroundColor ='yellow'
        checkGameOver()
        // console.log(gGame.markedCount)
        //elCell.classList.add('.flagged')
    } else if(event.button === 2 && elCell.innerHTML === FLAG_IMAGE){
        gBoard[i][j].isMarked = false
        // elCell.innerHTML = MINE_IMAGE
        elCell.innerHTML = ''
        gGame.markedCount--
        // console.log(gGame.markedCount)
        elCell.style.backgroundColor = 'pink'
    }
    
}

function setMinesNegsCount(k ,l){
    var negsCount = 0;
    for (var i = k - 1; i <= k + 1; i++) {
        if (i < 0 || i >= gLevelChosen.size) continue;
        for (var j = l - 1; j <= l + 1; j++) {
            if (j < 0 || j >= gLevelChosen.size) continue;
            if (i === k && j === l) continue;
            const currCell = gBoard[i][j]
            if (currCell.isMine === true) negsCount++;
        }
    }
    return negsCount
}

// function expandShown(gMat, elCell, k, l){
function expandShown(k, l){
    for (var i = k - 1; i <= k + 1; i++) {
        if (i < 0 || i >= gLevelChosen.size) continue;
        for (var j = l - 1; j <= l + 1; j++) {
            //var negsCount = 0
            if (j < 0 || j >= gLevelChosen.size) continue;
            if (i === k && j === l) continue;
            const currCell = gBoard[i][j]
            const elCellNeg = document.querySelector(`.cell-${i}-${j}`)

            if (currCell.isMine === true || elCellNeg.style.backgroundColor === 'yellow') continue
            else if(elCellNeg.style.backgroundColor !== 'white'){ //if(elCellNeg.style.backgroundColor === 'lightgrey'){
                elCellNeg.style.backgroundColor = 'white'
                gBoard[k][l].isShown = true
                gGame.shownCount++
                if(currCell.minesAroundCount !== 0) elCellNeg.innerHTML = currCell.minesAroundCount
                }   
        }
    }
    checkGameOver()
}

//fine without it
function onCellMarked(elCell){

}

function checkGameOver(){
    if(gLivesLostCount >= gLevelChosen.lives){
        console.log('lost' , gLivesLostCount , gLevelChosen.lives)
        clearInterval(gTimerInterval)
        // var elBoard = document.querySelector('.board-container')
        // elBoard.classList.add = ('.endGame')
        gGame.isOn = false
        const elFinalResult = document.querySelector('.game-result')
        elFinalResult.innerHTML = ' You 😫lost!'
        return gGame.isOn
        }
    if( gLivesLostCount < gLevelChosen.lives && gGame.markedCount <= gLevelChosen.mines &&
        gGame.shownCount + gGame.markedCount + gLivesLostCount === gLevelChosen.size**2){
        console.log(gGame.markedCount , gLivesLostCount)
        console.log(gGame.shownCount + gGame.markedCount + gLivesLostCount)
        clearInterval(gTimerInterval)
        gGame.isOn = false
        const elFinalResult = document.querySelector('.game-result')
        elFinalResult.innerHTML = 'You 😎won!'
    } return gGame.isOn

}
//optional
function onGameOver() {
    clearInterval(gTimerInterval)
    
}

function onTime(){
    gGame.secsPassed = (Date.now() - startTime)/1000
    // console.log(gGame.secsPassed)

    const elTimer = document.querySelector('.seconds')
    elTimer.innerText = (Math.round(gGame.secsPassed) + '').padStart(2, '0')
    
    // const elShownCount = document.querySelector('.shownCount')
    // elShownCount.innerHTML = gGame.shownCount

    // const elMarkedCount = document.querySelector('.markedCount')
    // elMarkedCount.innerHTML = gGame.markedCount
}

function onShowLives(){
    livesArray = []
    while(livesArray.length < gLevelChosen.lives){
        livesArray.push(LIFE + ' ')
    }
    const elLives = document.querySelector('.lives')
    elLives.innerHTML = 'Lives left: ' + livesArray.join(" ")
}

function onLiveLost(){
    livesArray.shift()
    livesArray.push(LIFE_LOST)
    const elLives = document.querySelector('.lives')
    elLives.innerHTML = 'Lives left: ' + livesArray.join(" ")
}

function onSmiley(){
    const elSmiley = document.querySelector('.game-result')
    elSmiley.innerHTML = '😐'
    onLevelChosen(gChoice)
}