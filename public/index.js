import { defaultBoard, defaultState, gridSize } from "./constants.js"
import { drawBoard } from "./ui.js"
import { solve } from "./solver.js"


let board = defaultBoard;
let mode = "play";
let dragging = false;
let iniState = defaultState.slice();
let currentState = iniState.slice();
let solvedState = null;
let selectedGoal = 5;

window.addEventListener("resize", () => {
    if(mode == "play"){
        currentState = iniState.slice();
    }
    drawBoard(board, currentState);
});
window.addEventListener("load", () => {
    drawBoard(board, currentState);
});

/*
    requestAnimationFrame(main);
    return;
    preComputeBoard();

    draw();
    let robots = new Uint8Array(2*5);
    robots[0] = 0;
    robots[1] = 0;
    robots[2] = 0;
    robots[3] = 13;
    robots[4] = 0;
    robots[5] = 12;
    robots[6] = 14;
    robots[7] = 14;
    robots[8] = 14;
    robots[9] = 0;
    let moves = new Uint32Array(20);
    moves[0] = 0;
    let ini = new GameState(robots, moves, -1);
    /*ini.Move(GREEN, RIGHT);
    ini.Move(GREEN, UP);
    ini.Move(GREEN, LEFT);
    ini.Move(GREEN, DOWN);
    ini.Move(GREEN, RIGHT);
    //draw(ini);
    //console.log(Solve(ini, MOON+GREEN, 7));
});*/

window.addEventListener("mousedown", (e) => {
    if(e.target.classList.contains("goal") && mode == "setup"){
        dragging = true;
        e.target.classList.add("dragged");
        e.preventDefault();
    }
});

window.addEventListener("mousemove", (e) => {
    if(dragging){
        let dragged = document.getElementsByClassName("dragged")[0];
        dragged.style.left = parseInt(dragged.style.left) + e.movementX + "px";
        dragged.style.top = parseInt(dragged.style.top) + e.movementY + "px";
    }
});

window.addEventListener("mouseup", (e) => {
    if(dragging){
        let dragged = document.getElementsByClassName("dragged")[0];
        let id = dragged.getAttribute("goal-id");
        dragged.classList.remove("dragged")
        dragging = false;

        const cellSize = Math.floor(Math.min(window.innerWidth, window.innerHeight) / (gridSize + 2));
        let x = Math.round((parseInt(dragged.style.left) - cellSize*1.5) / cellSize);
        let y = Math.round((parseInt(dragged.style.top) - cellSize*1.5) / cellSize);
        console.log(x,y);

        if(x >= 0 && x < 16 && y >= 0 && y < 16 && (Math.pow(x-7.5, 2) + Math.pow(y-7.5, 2) > 1)){
            board.goals[2*id] = x;
            board.goals[2*id+1] = y;
        }

        drawBoard(board, currentState);
    }
});

function switchMode(newMode){
    document.getElementsByTagName("body")[0].classList.remove("play");
    document.getElementsByTagName("body")[0].classList.remove("setup");
    document.getElementsByTagName("body")[0].classList.remove("solution");
    
    mode = newMode;
    document.getElementsByTagName("body")[0].classList.add(mode);
}

function solveClick(button){
    button.disabled = true;
    solvedState = solve(board, iniState, selectedGoal, 20);
    button.disabled = false;
    if(!solvedState){
        alert("No solution found !");
        return;
    }

    switchMode('solution');
    console.log(solvedState[10]);
    document.getElementsByClassName("moveCount")[0].innerHTML = solvedState[10];
}

function acceptSolution(){
    iniState = new GameState(solvedState);
    iniState.moves[0] = 0
    currentState = new GameState(iniState);
    solvedState = false;
    switchMode('play')
    drawBoard(board, currentState);
}

function resetSolution(){
    currentState = new GameState(iniState);
    solvedState = false;
    switchMode('play')
    drawBoard(board, currentState);
}

function playAnimation(){
    currentState = new GameState(iniState);
    drawBoard(board, currentState);
    for(let i = 0; i < solvedState.moves[0]; i++){
        setTimeout(() => {
            currentState.Move(board, solvedState.moves[i+1]);
            drawBoard(board, currentState);
        }, 1000*(i+1));
    }
}

function selectGoal(button, goalId){
    let goalSelected = document.getElementsByClassName("selected")[0];
    goalSelected.classList.remove("selected");
    button.classList.add("selected");
    selectedGoal = goalId;
}

window.solveClick = solveClick;
window.acceptSolution = acceptSolution;
window.resetSolution = resetSolution;
window.switchMode = switchMode;
window.playAnimation = playAnimation;
window.selectGoal = selectGoal;

