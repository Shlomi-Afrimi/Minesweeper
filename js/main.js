'set strict'

// gBoard – A Matrix containing cell objects: Each cell:
//  { minesAroundCount: 4, isShown: false, isMine: false, isMarked: false } VV

// gLevel = { SIZE: 4, MINES: 2 }VV


var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }
var startTime 
const MINE = 'MINE'
const MINE_IMAGE = '💣'
const FLAG_IMAGE = '🚩'
const LIVE = '💜'
var gLivesCount =[LIVE, LIVE, LIVE]
var gBoard = []
var gMat = []
var gLevelChosen
var gTimerInterval
var shownCount = 0 /////////////////////////////////////////////////////////////
//const SIZE = 4 
var clicksCount = 0
var gLevel = [{size: 4, mines: 2},
              {size: 8, mines: 14},
              {size: 12, mines: 32}
]

gLevelChosen = gLevel[0]

function onLevelChosen(choice){
    gLevelChosen = gLevel[choice]
    clearInterval(gTimerInterval)
    gGame.secsPassed = 0
    gGame.isOn = true
    onInit()
}

function onInit(){
    //gGame.isOn = true
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
            boardNegs[i][j] = { minesAroundCount: negsCount1, isShown: false , isMine: gBoard[i][j].isMine, isMarked: false }
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
        startTime = Date.now()
        gTimerInterval = setInterval(onTime ,1000)
        //console.log(startTime)
    }
    if(gBoard[cellI][cellJ].isMine === true) {
        // elCell.style.backgroundColor = 'red'
        elCell.classlist.add('.exploded')
        return
        }   else if(elCell.style.backgroundColor !== 'white'){
        elCell.style.backgroundColor = 'white'
        gGame.shownCount++
        }   
    if (gBoard[cellI][cellJ].minesAroundCount > 0) {
        elCell.innerHTML = gBoard[cellI][cellJ].minesAroundCount
    }
    // if((gBoard[cellI][cellJ].isMine === false) && gBoard[cellI][cellJ].minesAroundCount === 0) expandShown(gBoard, elCell, cellI, cellJ)
    if((gBoard[cellI][cellJ].isMine === false) && gBoard[cellI][cellJ].minesAroundCount === 0) expandShown(cellI, cellJ)
}

function onCellRightClicked(i ,j , event){
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    
//    if(event.button === 2 && gBoard[i][j].isMine === true && elCell.innerHTML === MINE_IMAGE) {
//     elCell.innerHTML = FLAG_IMAGE
   if(event.button === 2 && elCell.innerHTML === '') {
    elCell.innerHTML = FLAG_IMAGE
    gGame.markedCount++
   } else if(event.button === 2 && elCell.innerHTML === FLAG_IMAGE){
    // elCell.innerHTML = MINE_IMAGE
    elCell.innerHTML = ''
    gGame.markedCount--
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

            if (currCell.isMine === true) continue
            else if(elCellNeg.style.backgroundColor !== 'white'){
                elCellNeg.style.backgroundColor = 'white'
                gGame.shownCount++
                elCellNeg.innerHTML = currCell.minesAroundCount
                }   
        }
    }
}

//optional
function onCellMarked(elCell){

}
//optional
function checkGameOver(){

}
//optional
function GameOver() {
    //gGame.isOn = false
    clearInterval(gTimerInterval)
    //clearInterval(gGlueInterval)
    //showModal()
    
}

function onTime(){
    gGame.secsPassed = (Date.now() - startTime)/1000
    // console.log(gGame.secsPassed)

    const elTimer = document.querySelector('.seconds')
    elTimer.innerText = (Math.round(gGame.secsPassed) + '').padStart(2, '0')
    
    const elShownCount = document.querySelector('.shownCount')
    elShownCount.innerText = gGame.shownCount

    const elMarkedCount = document.querySelector('.markedCount')
    elMarkedCount.innerText = gGame.markedCount
}




