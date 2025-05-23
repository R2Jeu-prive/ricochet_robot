let board = {};

function initBoard(){
    board.walls = [];

    // surrounding walls
    for(let i = 0; i < gridSize-2; i++){
        board.walls.push({x:i+1, y:0, type:H});
        board.walls.push({x:i+1, y:gridSize-2, type:H});
        board.walls.push({x:0, y:i+1, type:V});
        board.walls.push({x:gridSize-2, y:i+1, type:V});
    }

    // center walls
    for(let i = 0; i < 2; i++){
        board.walls.push({x:gridSize/2 + i - 1, y:gridSize/2 - 2, type:H});
        board.walls.push({x:gridSize/2 + i - 1, y:gridSize/2, type:H});
        board.walls.push({x:gridSize/2 - 2, y:gridSize/2 + i - 1, type:V});
        board.walls.push({x:gridSize/2, y:gridSize/2 + i - 1, type:V});
    }

    board.walls.push({x:4,y:1,type:V});
    board.walls.push({x:11,y:1,type:V});
    board.walls.push({x:9,y:2,type:V});
    board.walls.push({x:6,y:3,type:V});
    board.walls.push({x:15,y:3,type:V});
    board.walls.push({x:3,y:5,type:V});
    board.walls.push({x:11,y:5,type:V});
    board.walls.push({x:7,y:6,type:V});
    board.walls.push({x:1,y:7,type:V});
    board.walls.push({x:12,y:7,type:V});
    board.walls.push({x:4,y:10,type:V});
    board.walls.push({x:8,y:11,type:V});
    board.walls.push({x:13,y:11,type:V});
    board.walls.push({x:1,y:12,type:V});
    board.walls.push({x:11,y:12,type:V});
    board.walls.push({x:7,y:13,type:V});
    board.walls.push({x:14,y:13,type:V});
    board.walls.push({x:2,y:15,type:V});
    board.walls.push({x:10,y:15,type:V});
    board.walls.push({x:6,y:16,type:V});
    board.walls.push({x:12,y:16,type:V});

    board.walls.push({x:10,y:2,type:H});
    board.walls.push({x:15,y:2,type:H});
    board.walls.push({x:6,y:3,type:H});
    board.walls.push({x:3,y:4,type:H});
    board.walls.push({x:1,y:5,type:H});
    board.walls.push({x:11,y:5,type:H});
    board.walls.push({x:16,y:5,type:H});
    board.walls.push({x:2,y:6,type:H});
    board.walls.push({x:8,y:6,type:H});
    board.walls.push({x:13,y:6,type:H});
    board.walls.push({x:4,y:9,type:H});
    board.walls.push({x:16,y:9,type:H});
    board.walls.push({x:9,y:10,type:H});
    board.walls.push({x:14,y:10,type:H});
    board.walls.push({x:2,y:12,type:H});
    board.walls.push({x:11,y:12,type:H});
    board.walls.push({x:7,y:13,type:H});
    board.walls.push({x:15,y:13,type:H});
    board.walls.push({x:1,y:14,type:H});
    board.walls.push({x:3,y:14,type:H});
    board.walls.push({x:10,y:14,type:H});

    board.goals = Array.from({length: 17}, (_, i) => ({x: 0, y: 0}));
    board.goals[VOID] = {x: 9, y: 11};

    board.goals[RED+STAR] = {x: 14, y: 11};
    board.goals[GREEN+STAR] = {x: 10, y: 2};
    board.goals[BLUE+STAR] = {x: 6, y: 3};
    board.goals[YELLOW+STAR] = {x: 4, y: 10};

    board.goals[RED+MOON] = {x: 2, y: 12};
    board.goals[GREEN+MOON] = {x: 3, y: 5};
    board.goals[BLUE+MOON] = {x: 10, y: 15};
    board.goals[YELLOW+MOON] = {x: 15, y: 3};

    board.goals[RED+GEAR] = {x: 8, y: 6};
    board.goals[GREEN+GEAR] = {x: 3, y: 15};
    board.goals[BLUE+GEAR] = {x: 13, y: 7};
    board.goals[YELLOW+GEAR] = {x: 15, y: 13};

    board.goals[RED+PLANET] = {x: 11, y: 5};
    board.goals[GREEN+PLANET] = {x: 11, y: 12};
    board.goals[BLUE+PLANET] = {x: 7, y: 13};
    board.goals[YELLOW+PLANET] = {x: 2, y: 7};
}
