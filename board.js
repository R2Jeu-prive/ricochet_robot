let board = {};

function setGoal(goal,x,y){
    board.goals[2*goal] = x;
    board.goals[2*goal + 1] = y;
}

function initBoard(){
    board.walls = [];

    /* surrounding walls
    for(let i = 0; i < gridSize-2; i++){
        board.walls.push({x:i+1, y:0, type:H});
        board.walls.push({x:i+1, y:gridSize-2, type:H});
        board.walls.push({x:0, y:i+1, type:V});
        board.walls.push({x:gridSize-2, y:i+1, type:V});
    }*/

   
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
    
    board.walls = board.walls.map(function(wall){return {x:wall.x-1, y:wall.y-1, type:wall.type}});
    
    // center walls
    for(let i = 0; i < 2; i++){
        board.walls.push({x:gridSize/2 + i - 1, y:gridSize/2 - 2, type:H});
        board.walls.push({x:gridSize/2 + i - 1, y:gridSize/2, type:H});
        board.walls.push({x:gridSize/2 - 2, y:gridSize/2 + i - 1, type:V});
        board.walls.push({x:gridSize/2, y:gridSize/2 + i - 1, type:V});
    }

    board.upLimit = new Int8Array(gridSize * gridSize);
    board.downLimit = new Int8Array(gridSize * gridSize);
    board.leftLimit = new Int8Array(gridSize * gridSize);
    board.rightLimit = new Int8Array(gridSize * gridSize);
    
    for(let x = 0; x < gridSize; x++){
        for(let y = 0; y < gridSize; y++){
            let i = x + gridSize*y;
            
            board.upLimit[i] = 0;
            for(let k = y; k > 0; k--){
                if(board.walls.some(wall => wall.x == x && wall.y == k-1 && wall.type == H)){board.upLimit[i] = k; break;}
            }
            
            board.leftLimit[i] = 0;
            for(let k = x; k > 0; k--){
                if(board.walls.some(wall => wall.y == y && wall.x == k-1 && wall.type == V)){board.leftLimit[i] = k; break;}
            }

            board.downLimit[i] = 15;
            for(let k = y; k < 15; k++){
                if(board.walls.some(wall => wall.x == x && wall.y == k && wall.type == H)){board.downLimit[i] = k; break;}
            }

            board.rightLimit[i] = 15;
            for(let k = x; k < 15; k++){
                if(board.walls.some(wall => wall.y == y && wall.x == k && wall.type == V)){board.rightLimit[i] = k; break;}
            }
        }
    }

    board.goals = new Uint8Array(2*17);

    setGoal(RED+STAR, 13, 10);
    setGoal(GREEN+STAR, 9, 1);
    setGoal(BLUE+STAR, 5, 2);
    setGoal(YELLOW+STAR, 3, 9);

    setGoal(RED+MOON, 1, 11);
    setGoal(GREEN+MOON, 2, 4);
    setGoal(BLUE+MOON, 9, 14);
    setGoal(YELLOW+MOON, 14, 2);

    setGoal(RED+GEAR, 7, 5);
    setGoal(GREEN+GEAR, 2, 14);
    setGoal(BLUE+GEAR, 12, 6);
    setGoal(YELLOW+GEAR, 14, 12);

    setGoal(RED+PLANET, 10, 4);
    setGoal(GREEN+PLANET, 10, 11);
    setGoal(BLUE+PLANET, 6, 12);
    setGoal(YELLOW+PLANET, 1, 6);

    setGoal(VOID, 8, 10);
}
