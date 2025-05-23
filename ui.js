function drawCanvas() {
    let canvasSize = Math.min(window.innerWidth, window.innerHeight);
    canvas.height = canvasSize;
    canvas.width = canvasSize;
    canvas.style.width = canvasSize + "px";
    canvas.style.height = canvasSize + "px";

    const cellSize = Math.floor(canvasSize / gridSize);
    const wallWidth = Math.floor(cellSize / 10);

    ctx.fillStyle = "#ddd";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let i = 1; i < gridSize-1; i++){
        for(let j = 1; j < gridSize-1; j++){
            ctx.fillStyle = "#eee";
            if((i+j) % 2 == 0){
                ctx.fillStyle = "#bbb";
            }
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }

    for(let i = 0; i < gridSize; i++) {
        for(let j = 0; j < gridSize; j++) {
            ctx.fillStyle = "#333";
            if(board.walls.some(wall => wall.x === i && wall.y === j && wall.type === V)) {
                ctx.fillRect(i * cellSize + cellSize - wallWidth/2, j * cellSize, wallWidth, cellSize);
            }
            if(board.walls.some(wall => wall.x === i && wall.y === j && wall.type === H)) {
                ctx.fillRect(i * cellSize, j * cellSize + cellSize - wallWidth/2, cellSize, wallWidth);
            }
        }
    }

    for(let i = 0; i <= 16; i++){
        let goal = board.goals[i];
        let color = "#f0f";
        let shape = "void";
        if(i != VOID){
            color = ["#f00", "#0f0", "#00f", "#ff0"][(i-1) % 4];
            shape = ["star", "moon", "gear", "planet"][Math.floor((i-1)/4)];
        }

        ctx.fillStyle = color;
        let img = new Image();
        img.src = "images/goals/" + shape +  ".png";
        ctx.filter = "contrast(.8) drop-shadow(0px 2px 0px " + color + ") drop-shadow(0px -2px 0px " + color + ") drop-shadow(2px 0px 0px " + color + ") drop-shadow(-2px 0px 0px " + color + ")";
        ctx.drawImage(img, goal.x * cellSize + cellSize/4, goal.y * cellSize + cellSize/4, cellSize / 2, cellSize / 2);
        ctx.filter = "none";
    }
}
