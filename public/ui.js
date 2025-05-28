


function draw(state = null) {
    let canvasSize = Math.min(window.innerWidth, window.innerHeight);
    canvasSize = (gridSize + 2) * Math.floor(canvasSize / (gridSize + 2))
    canvas.height = canvasSize;
    canvas.width = canvasSize;
    canvas.style.width = canvasSize + "px";
    canvas.style.height = canvasSize + "px";

    const cellSize = canvasSize / (gridSize + 2);
    const wallWidth = Math.floor(cellSize / 10);
    const margin = cellSize

    const colorBackground = "#ddd";
    const colorCheckerA = "#eee";
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
    return;

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

    for(let i = 0; i <= 16; i++){
        let goalX = board.goals[2*i];
        let goalY = board.goals[2*i+1];
        let color = "#c5c";
        let shape = "void";
        if(i != VOID){
            color = ["#c55", "#5c5", "#55c", "#cc5"][i % 4];
            shape = ["star", "moon", "gear", "planet"][Math.floor(i/4)];
        }

        let img = new Image();
        img.src = "images/goals/" + shape +  ".png";
        ctx.filter = "contrast(.8) drop-shadow(0px 2px 0px " + color + ") drop-shadow(0px -2px 0px " + color + ") drop-shadow(2px 0px 0px " + color + ") drop-shadow(-2px 0px 0px " + color + ")";
        ctx.drawImage(img, margin + goalX * cellSize + cellSize/4, margin + goalY * cellSize + cellSize/4, cellSize / 2, cellSize / 2);
        ctx.filter = "none";
    }

    if(state != null){
        for(let c = 0; c < 5; c++){
            let robotX = state.robots[2*c];
            let robotY = state.robots[2*c+1];
            let color = ["#f0f", "#f00", "#0f0", "#00f", "#ff0"][c];

            let img = new Image();
            img.src = "images/bot.png";
            ctx.filter = "contrast(.8) drop-shadow(0px 4px 0px " + color + ") drop-shadow(0px -4px 0px " + color + ") drop-shadow(4px 0px 0px " + color + ") drop-shadow(-4px 0px 0px " + color + ")";
            ctx.drawImage(img, margin + robotX * cellSize + cellSize/8, margin + robotY * cellSize + cellSize/8, cellSize * 0.75, cellSize *0.75);
            ctx.filter = "none";
        }
    }
}
