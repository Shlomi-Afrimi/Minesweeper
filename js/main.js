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

//Retrieve best times from localStorage
retrieveBestTimes()
function retrieveBestTimes(){
    
    for(var i = 0; i < 3; i++){
        var levelPlayedRecord =''
        switch(i){
            case 0:
                levelPlayedRecord = 'Beginner'
                break
            case 1:
                levelPlayedRecord = 'Medium'
                break
            case 2:
                levelPlayedRecord = 'Expert'
        }
        if(localStorage.levelPlayedRecord !==null || isNaN(+localStorage.levelPlayedRecord) === false){
            var elRecord 
            elRecord = document.querySelector(`.${levelPlayedRecord}`)
            elRecord.innerText = localStorage.levelPlayedRecord
            }
    }
}

var gStartTime 
var gChoice = 0
var gTimerInterval
var gLevelChosen = gLevel[0]


var gLivesArray = [LIFE]
var gBoard = []
var gMat = []
var gGame = { isOn: true, shownCount: 0, markedCount: 0, secsPassed: 0 }
var gLivesLostCount = 0
var gClicksCount = 0

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
    gClicksCount = 0
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
    if(gClicksCount === 0){
        gBoard = buildBoard2(gBoard,cellI,cellJ)
        gClicksCount = 1
        gGame.secsPassed = 0
        gStartTime = Date.now()
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
    if(gBoard[cellI][cellJ].minesAroundCount === 0) expandShown(cellI, cellJ)
}

function onCellRightClicked(i ,j , event){
    if (!gGame.isOn) return
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    if(event.button === 2 && elCell.innerHTML === '' && elCell.style.backgroundColor !== 'red' && elCell.style.backgroundColor !== 'white') {
        gBoard[i][j].isMarked =true
        elCell.innerHTML = FLAG_IMAGE
        gGame.markedCount++
        elCell.style.backgroundColor ='yellow'
        checkGameOver()
    } else if(event.button === 2 && elCell.innerHTML === FLAG_IMAGE){
        gBoard[i][j].isMarked = false
        elCell.innerHTML = ''
        gGame.markedCount--
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

function expandShown(k, l){
    for (var i = k - 1; i <= k + 1; i++) {
        if (i < 0 || i >= gLevelChosen.size) continue;
        for (var j = l - 1; j <= l + 1; j++) {
            if (j < 0 || j >= gLevelChosen.size) continue;
            if (i === k && j === l) continue;
            const currCell = gBoard[i][j]
            const elCellNeg = document.querySelector(`.cell-${i}-${j}`)

            if (currCell.isMine === true || elCellNeg.style.backgroundColor === 'yellow') continue
            else if(elCellNeg.style.backgroundColor !== 'white'){ 
                if(gBoard[i][j].minesAroundCount === 0   ) {
                    gBoard[i][j].isShown = true
                    gGame.shownCount++
                    elCellNeg.style.backgroundColor = 'white'
                    expandShown(i, j) 
                }    
                else {
                    gBoard[i][j].isShown = true
                    gGame.shownCount++
                    elCellNeg.style.backgroundColor = 'white'
                    elCellNeg.innerHTML = currCell.minesAroundCount
                    }
                }
        }
    }
    checkGameOver()
}

function checkGameOver(){
    isLost()
    if (gGame.isOn) isWon()
}

function isLost(){
    if(gLivesLostCount >= gLevelChosen.lives){
        for (var i = 0; i < gLevelChosen.size; i++){
            for ( var j = 0; j < gLevelChosen.size; j++){
                if(gBoard[i][j].isMine){
                    const elCell = document.querySelector(`.cell-${i}-${j}`)
                    elCell.innerHTML = '💣'
                }
            }
        }
        clearInterval(gTimerInterval)
        gGame.isOn = false
        const elFinalResult = document.querySelector('.game-result')
        elFinalResult.innerHTML = ' You 😫lost!'
        return gGame.isOn
        }
}

function isWon(){
    if( gLivesLostCount < gLevelChosen.lives && (gGame.markedCount + gLivesLostCount) === gLevelChosen.mines &&
        gGame.shownCount + gGame.markedCount + gLivesLostCount === gLevelChosen.size**2){
        gGame.secsPassed = (Date.now() - gStartTime)/1000    
        const gameTime = (Math.round(gGame.secsPassed) + '').padStart(2, '0')
        onRecordCheck(gameTime)
        clearInterval(gTimerInterval)
        gGame.isOn = false
        const elFinalResult = document.querySelector('.game-result')
        elFinalResult.innerHTML = 'You 😎won!'
        return gGame.isOn
    } 
}

function onTime(){
    gGame.secsPassed = (Date.now() - gStartTime)/1000
    const elTimer = document.querySelector('.seconds')
    elTimer.innerText = (Math.round(gGame.secsPassed) + '').padStart(2, '0')
}

function onShowLives(){
    gLivesArray = []
    while(gLivesArray.length < gLevelChosen.lives){
        gLivesArray.push(LIFE + ' ')
    }
    const elLives = document.querySelector('.lives')
    elLives.innerHTML = 'Lives left: ' + gLivesArray.join(" ")
}

function onLiveLost(){
    gLivesArray.shift()
    gLivesArray.push(LIFE_LOST)
    const elLives = document.querySelector('.lives')
    elLives.innerHTML = 'Lives left: ' + gLivesArray.join(" ")
}

function onSmiley(){
    const elSmiley = document.querySelector('.game-result')
    elSmiley.innerHTML = '😐'
    onLevelChosen(gChoice)
}

/*-----------------bonus-------------------*/

function onRecordCheck(gameTime){
    var levelPlayedRecord
    switch(gChoice){
        case 0:
            levelPlayedRecord = 'Beginner'
            break
        case 1:
            levelPlayedRecord = 'Medium'
            break
        case 2:
            levelPlayedRecord = 'Expert'
    }
    if(localStorage.levelPlayedRecord === null || isNaN(localStorage.levelPlayedRecord) 
         || gameTime < +localStorage.levelPlayedRecord){
        localStorage.levelPlayedRecord = gameTime
        const elRecord = document.querySelector(`.${levelPlayedRecord}`)
        elRecord.innerHTML = localStorage.levelPlayedRecord
    }
}


