'set strict'

// gBoard – A Matrix containing cell objects: Each cell:
//  { minesAroundCount: 4, isShown: false, isMine: false, isMarked: false } VV

// gLevel = { SIZE: 4, MINES: 2 }V


// gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }
const MINE = 'MINE'
const MINE_IMAGE = '💣'
var gBoard = []
var board = []
const size = 4 
var clicksCount = 0
var gLevel = [{size: 4, mines: 2},
              {size: 8, mines: 14},
              {size: 12, mines: 32}
]

function onInit(){
    gBoard = buildBoard()
    renderBoard(gBoard)
    var totalExposed = 0
}

function buildBoard(){
    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
        }
    }
    board[1][1].isMine = board[2][2].isMine = true
    //console.log(board)
    return board
}

function buildBoard2(board){
    const boardNegs = []
    var isMine2 = false
    for (var i = 0; i < size; i++) {
        boardNegs.push([])

        for (var j = 0; j < size; j++) {
            const negsCount1 = setMinesNegsCount(board ,i ,j)
            boardNegs[i][j] = { minesAroundCount: negsCount1, isShown: false , isMine: gBoard[i][j].isMine, isMarked: false }
        }
    }
    board = boardNegs
    console.log(board)
    return boardNegs
}

function setMinesNegsCount(board ,k ,l){
    var negsCount = 0;
    for (var i = k - 1; i <= k + 1; i++) {
        if (i < 0 || i >= 4) continue;
        for (var j = l - 1; j <= l + 1; j++) {
            if (j < 0 || j >= 4) continue;
            if (i === k && j === l) continue;
            const currCell = gBoard[i][j]
            if (currCell.isMine === true) negsCount++;
        }
    }
    
    return negsCount
}

function renderBoard(board){
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            if(cell.isMine === true) cell = MINE_IMAGE 
            else cell = ''
            const className = `cell cell-${i}-${j}`
            strHTML += `<td data-i=${i} data-j=${j} onclick="onCellClicked(this, ${i}, ${j})" class="cell ${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

function onCellClicked(elCell, cellI, cellJ){
    if(clicksCount === 0){
        buildBoard2(board)
        clicksCount = 1
        //console.log(board)
    }
    if(gBoard[cellI][cellJ].isMine === false) elCell.style.backgroundColor = 'white'
    else elCell.style.backgroundColor = 'red'
    console.log(gBoard[cellI][cellJ].minesAroundCount)
    console.log
    if (gBoard[cellI][cellJ].minesAroundCount > 0) {
        elCell.innerHTML = board[cellI][cellJ].minesAroundCount
        console.log(elCell.innerHTML)
        console.log(board[cellI][cellJ].minesAroundCount)
        //console.log(gBoard[cellI][cellJ].minesAroundCount)
    }
    if((gBoard[cellI][cellJ].isMine === false) && gBoard[cellI][cellJ].minesAroundCount === 0) expandShown(board, elCell, cellI, cellJ)
}

function onCellMarked(elCell){

}

function checkGameOver(){

}

function expandShown(board, elCell, k, l){
    for (var i = k - 1; i <= k + 1; i++) {
        if (i < 0 || i >= 4) continue;
        for (var j = l - 1; j <= l + 1; j++) {
            if (j < 0 || j >= 4) continue;
            if (i === k && j === l) continue;
            const currCell = gBoard[i][j]
            //if (currCell.isMine === true) negsCount++;
            //render-cell
        }
    }
}

