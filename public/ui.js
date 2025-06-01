import { gridSize, H, V } from "./constants.js";

export function drawBoard(board, state = null){
    const canvas = document.getElementsByClassName("board")[0];
    const ctx = canvas.getContext("2d");

    let canvasSize = Math.min(window.innerWidth, window.innerHeight);
    canvasSize = (gridSize + 2) * Math.floor(canvasSize / (gridSize + 2))
    canvas.height = canvasSize;
    canvas.width = canvasSize;
    canvas.style.width = canvasSize + "px";
    canvas.style.height = canvasSize + "px";

    const cellSize = canvasSize / (gridSize + 2);
    const wallWidth = Math.floor(cellSize / 10);
    const margin = cellSize;

    const colorBackground = "#ddd";
    const colorCheckerA = "#999";
    const colorCheckerB = "#bbb";
    const colorWall = "#333";

    // draw background
    ctx.fillStyle = colorBackground;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw cells
    for(let i = 0; i < gridSize; i++){
        for(let j = 0; j < gridSize; j++){
            ctx.fillStyle = colorCheckerA;
            if((i+j) % 2 == 0){
                ctx.fillStyle = colorCheckerB;
            }
            ctx.fillRect(margin + i * cellSize, margin + j * cellSize, cellSize, cellSize);
        }
    }

    // draw surounding and walls
    ctx.strokeStyle = colorWall;
    ctx.fillStyle = colorBackground;
    ctx.lineJoin = "round";
    ctx.lineWidth = wallWidth;
    ctx.strokeRect(margin, margin, cellSize * gridSize, cellSize * gridSize);
    ctx.fillRect(margin + cellSize * (gridSize / 2 - 1), margin + cellSize * (gridSize / 2 - 1), cellSize * 2, cellSize * 2);
    ctx.strokeRect(margin + cellSize * (gridSize / 2 - 1), margin + cellSize * (gridSize / 2 - 1), cellSize * 2, cellSize * 2);
    
    // draw walls
    for(let i = 0; i < gridSize; i++) {
        for(let j = 0; j < gridSize; j++) {
            ctx.fillStyle = "#333";
            if(board.walls.some(wall => wall.x === i && wall.y === j && wall.type === V)) {
                ctx.fillRect(margin + i * cellSize + cellSize - wallWidth/2, margin + j * cellSize, wallWidth, cellSize);
            }
            if(board.walls.some(wall => wall.x === i && wall.y === j && wall.type === H)) {
                ctx.fillRect(margin + i * cellSize, margin + j * cellSize + cellSize - wallWidth/2, cellSize, wallWidth);
            }
        }
    }

    // draw goals
    let goals = document.getElementsByClassName("goals")[0];
    for (const goal of goals.children) {
        goal.style.width = cellSize*0.6 + "px";
        goal.style.height = cellSize*0.6 + "px";

        const id = parseInt(goal.getAttribute("goal-id"));
        const x = board.goals[2*id];
        const y = board.goals[2*id + 1];

        goal.style.left = (margin + x * cellSize + cellSize/2) + "px";
        goal.style.top = (margin + y * cellSize + cellSize/2) + "px";
    }

    // draw state
    if(state == null){return;}
    let robots = document.getElementsByClassName("robots")[0];

    for (const robot of robots.children) {
        robot.style.width = cellSize*0.6 + "px";
        robot.style.height = cellSize*0.6 + "px";

        const id = parseInt(robot.getAttribute("robot-id"));
        const x = state[2*id];
        const y = state[2*id + 1];

        robot.style.left = (margin + x * cellSize + cellSize/2) + "px";
        robot.style.top = (margin + y * cellSize + cellSize/2) + "px";
    }
}
