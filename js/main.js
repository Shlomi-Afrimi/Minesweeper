'set strict'

// gBoard – A Matrix containing cell objects: Each cell:
//  { minesAroundCount: 4, isShown: false, isMine: false, isMarked: false } V

var gGame = { isOn: true, shownCount: 0, markedCount: 0, secsPassed: 0 }
var startTime 
const MINE = 'MINE'
const MINE_IMAGE = '💣'
const FLAG_IMAGE = '🚩'
const LIFE = '💜'
var gLivesLostCount = 0
//var gLivesLeft =[LIFE, LIFE, LIFE]
var gBoard = []
var gMat = []
var gLevelChosen
var gTimerInterval
// var shownCount = 0 /////////////////////////////////////////////////////////////
var clicksCount = 0
var gLevel = [{size: 4, mines: 2, lives: 1},
              {size: 8, mines: 14, lives: 2},
              {size: 12, mines: 32, lives:3}
]

gLevelChosen = gLevel[0]

function onLevelChosen(choice){
    gLevelChosen = gLevel[choice]
    clearInterval(gTimerInterval)
    gGame.secsPassed = 0
    const elTimer = document.querySelector('.seconds')
    elTimer.innerText = (Math.round(gGame.secsPassed) + '').padStart(2, '0')
    gGame.isOn = true
    gLivesLostCount = 0
    onInit()
}

function onInit(){
    //gGame.isOn = true
    gBoard =[]
    gMat = []
    clicksCount = 0
    //gLifeLeftCount = 3
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
    //gMat[1][1].isMine = gMat[2][2].isMine = true
    var minesDrawCount = 0
    while (minesDrawCount < gLevelChosen.mines){
        const drawI = [getRandomInt(0, gLevelChosen.size)]
        const drawJ = [getRandomInt(0, gLevelChosen.size)]
        if (gMat[drawI][drawJ].isMine === false){
            gMat[drawI][drawJ].isMine = true
            minesDrawCount++
        }
    }
    return gMat
}

function buildBoard2(gMat){
    const boardNegs = []
    //var isMine2 = false
    for (var i = 0; i < gLevelChosen.size; i++) {
        boardNegs.push([])

        for (var j = 0; j < gLevelChosen.size; j++) {
            const negsCount1 = setMinesNegsCount(gMat ,i ,j)
            boardNegs[i][j] = { minesAroundCount: negsCount1, isShown: gBoard[i][j].isShown , isMine: gBoard[i][j].isMine, isMarked: false }
        }
    }
    gMat = boardNegs
    return gMat
}

function renderBoard(gMat){
    var strHTML = ''
    for (var i = 0; i < gMat.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gMat[0].length; j++) {
            var cell = gMat[i][j]
            // if(cell.isMine === true) cell = MINE_IMAGE 
            // else cell = ''
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
        gBoard = buildBoard2(gMat)
        clicksCount = 1
        gGame.secsPassed = 0
        startTime = Date.now()
        gTimerInterval = setInterval(onTime ,500)
    }
    if(!gGame.isOn)return
    if(elCell.style.backgroundColor === 'yellow') return
    else if(gBoard[cellI][cellJ].isMine === true) {
        elCell.style.backgroundColor = 'red'
        gLivesLostCount++
        checkGameOver()
        return
        }
        else if(elCell.style.backgroundColor !== 'white'){
        elCell.style.backgroundColor = 'white'
        gBoard[cellI][cellJ].isShown = true
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
    console.log(checkGameOver())
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    if(event.button === 2 && elCell.innerHTML === '' && elCell.style.backgroundColor !== 'red' && elCell.style.backgroundColor !== 'white') {
        gBoard[i][j].isMarked =true
        elCell.innerHTML = FLAG_IMAGE
        gGame.markedCount++
        elCell.style.backgroundColor ='yellow'
        const elMarkedCount = document.querySelector('.markedCount')
        elMarkedCount.innerHTML = gGame.markedCount
        checkGameOver()
        console.log(gGame.markedCount)
        //elCell.classList.add('.flagged')
    } else if(event.button === 2 && elCell.innerHTML === FLAG_IMAGE){
        gBoard[i][j].isMarked = false
        // elCell.innerHTML = MINE_IMAGE
        elCell.innerHTML = ''
        gGame.markedCount--
        console.log(gGame.markedCount)
        elCell.style.backgroundColor = 'pink'
   }
    
}

function setMinesNegsCount(gMat ,k ,l){
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
                elCellNeg.innerHTML = currCell.minesAroundCount
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
        elFinalResult.innerHTML = 'You lost!!!😫'
        return gGame.isOn
        }
    if( gLivesLostCount < gLevelChosen.lives && gGame.markedCount <= gLevelChosen.mines &&
        gGame.shownCount + gGame.markedCount + gLivesLostCount === gLevelChosen.size**2){
        console.log(gGame.markedCount , gLivesLostCount)
        console.log(gGame.shownCount + gGame.markedCount + gLivesLostCount)
        clearInterval(gTimerInterval)
        gGame.isOn = false
        const elFinalResult = document.querySelector('.game-result')
        elFinalResult.innerHTML = 'You won!!!😎'
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
    
    const elShownCount = document.querySelector('.shownCount')
    elShownCount.innerHTML = gGame.shownCount

    // const elMarkedCount = document.querySelector('.markedCount')
    // elMarkedCount.innerHTML = gGame.markedCount
}




