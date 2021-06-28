window.addEventListener("load", main, false);
function main() {
    window.addEventListener("keydown", select);
    const canv = document.getElementById("sudoku");
    const ctx = canv.getContext("2d");
    var unit;
    var posX = 0;
    var posY = 0;
    // var init = [
    //     [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0, 0, 0, 0]
    // ];
        
    var init = [
        [0, 0, 0, 8, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 4, 3, 0],
        [5, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 7, 0, 8, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 2, 0, 0, 3, 0, 0, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 7, 5],
        [0, 0, 3, 4, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 6, 0, 0]
    ];
    var working = [];
    for (i=0; i < 9; i++) {
        working.push([]);
        for (j=0; j < 9; j++) { 
            working[i].push(init[i][j]);
        }
    }

    function select(evt) {
        switch(evt.keyCode) {
            case 37:    // left
                if (posX > 0) {
                    posX--;
                }
                break;
            case 38:    // up
                if (posY > 0) {
                    posY--;
                }
                break;
            case 39:    // right
                if (posX < 8) {
                    posX++;
                }
                break;
            case 40:    // down
                if (posY < 8) {
                    posY++;
                }
                break;
            case 49:    // 1
                working[posY][posX] = 1;
                break;
            case 50:    // 2
                working[posY][posX] = 2;
                break;
            case 51:    // 3
                working[posY][posX] = 3;
                break;
            case 52:    // 4
                working[posY][posX] = 4;
                break;
            case 53:    // 5
                working[posY][posX] = 5;
                break;
            case 54:    // 6
                working[posY][posX] = 6;
                break;
            case 55:    // 7
                working[posY][posX] = 7;
                break;
            case 56:    // 8
                working[posY][posX] = 8;
                break;
            case 57:    // 9
                working[posY][posX] = 9;
                break;
            case 8:     // backspace   
                working[posY][posX] = 0;
                break;
            case 13:    // enter
                ctx.font = "70px Ariel";
                ctx.textAlign = "center"; 
                ctx.fillStyle = "black";
                ctx.fillText("Solving", canv.width/2, canv.height/2);
                setTimeout(() => {  // drawing is asnyc, so you need this for the previous to draw
                    solveSudoku(init);
                    checkSolution(init);
                    draw();
                }, 1);
                return;
        }
        if (init[posY][posX]) {
            working[posY][posX] = init[posY][posX];
        }
        draw();
    }

    function recalibrate() {
        canv.width = canv.clientWidth;
        canv.height = canv.clientHeight;
        unit = canv.width / 9;
    }
    
    function draw() {
        recalibrate();

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canv.width, canv.height);
        
        ctx.fillStyle = "#FFFF00";
        ctx.fillRect(posX * unit, posY * unit, unit, unit);

        ctx.fillStyle = "black";
        for (i=1; i < 9; i++) {
            if (i % 3 == 0) {
                ctx.lineWidth = "5";
            } else {
                ctx.lineWidth = "1";
            }
            ctx.beginPath();
            ctx.moveTo(unit * i, 0);
            ctx.lineTo(unit * i, canv.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, unit * i);
            ctx.lineTo(canv.width, unit * i);
            ctx.stroke();
        }
        ctx.font = "70px Ariel";
        ctx.textAlign = "center";
        xOffset = unit / 2;
        yOffset = unit * 5 / 6;

        for (i=0; i < 9; i++) {
            for (j=0; j < 9; j++) {
                if (init[i][j]) {
                    ctx.fillStyle = "black";
                    ctx.fillText(init[i][j], xOffset + unit * j, yOffset + unit * i);
                } else if (working[i][j]) {
                    ctx.fillStyle = "blue";
                    ctx.fillText(working[i][j], xOffset + unit * j, yOffset + unit * i);
                } 
                
                
            }
        }
    }
    draw();
    window.onresize = draw;
}
function checkSolution(array) {
    for (var i=0; i < 9; i++) {
        for (var j=0; j < 9; j++) {
            var temp = array[i][j];
            array[i][j] = 0;
            var valid = validVal(array, temp, i, j);
            array[i][j] = temp;
            if (!valid) {
                console.log("invalid");
                console.log(i, j);
                return 0;
            }
        }
    }
    console.log("valid");
    return 1;
}

function findCell(array) {

    for (i=0; i < 9; i++) {     // find empty cell
        for (j=0; j < 9; j++) {
            if (!array[i][j]) {
                return {row: i, col: j};
            }
        }
    }
    return 0;
}

function validVal(array, val, row, col) {
    for (i=0; i < 9; i++) {
        if (array[i][col] == val) {
            return 0;
        }
        if (array[row][i] == val) {
            return 0;
        }
    }
    row = row - (row % 3);
    col = col - (col % 3);

    for (i=row; i < row+3; i++) {
        for (j=col; j < col+3; j++) {
            if (array[i][j] == val) {
                return 0;
            }
        }
    }
    return 1;
}
function solveSudoku(array) {
    if (findCell(array) == 0) {
        return 1;
    }
    var {row, col} = findCell(array);
    var val = 1;
    for (val=1; val <= 9; val++) {
        if (validVal(array, val, row, col)) {
            array[row][col] = val;
            if (solveSudoku(array) == 1) {
                return 1;
            } else {
                array[row][col] = 0;
            }
        }
    }
    return 0;
}