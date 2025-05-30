import { gridSize, H, V } from "./constants.js";

export function assertCenterWalls(board){
    // center walls
    for(let i = 0; i < 2; i++){
        board.walls.push({x:7 + i, y:6, type:H});
        board.walls.push({x:7 + i, y:8, type:H});
        board.walls.push({x:6, y:7 + i, type:V});
        board.walls.push({x:8, y:7 + i, type:V});
    }

    // clear duplicates
    var seen = new Map();
    board.walls = board.walls.filter(function(wall) {
        var k = JSON.stringify(wall);
        return seen.has(k) ? false : (seen.set(k, true) || true);
    })

    return board;
}

export function preComputeBoard(board){
    board = assertCenterWalls(board);
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

    return board;
}
