const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

let connections = [];

const dirs = [
    {x: 0, y: -1}, // UP
    {x: 0, y: 1}, // DOWN
    {x: -1, y: 0}, // LEFT
    {x: 1, y: 0} // RIGHT
];

function buildConnections(){
    for(let x = 1; x < gridSize-1; x++){
        connections[x] = [];
        for(let y = 1; y < gridSize-1; y++){
            let raycast = [true, true, true, true];
            connections[x][y] = Array.from({length: 4}, (_, i) => ({x: x, y: y}));
            for(let k = 0; k < 20; k++){
                if(raycast[RIGHT] && board.walls.some(wall => wall.x === x+k && wall.y === y && wall.type === V)){connections[x][y][RIGHT] = {x:x+k, y:y}; raycast[RIGHT] = false;}
                if(raycast[DOWN] && board.walls.some(wall => wall.x === x && wall.y === y+k && wall.type === H)){connections[x][y][DOWN] = {x:x, y:y+k}; raycast[DOWN] = false;}
                if(raycast[LEFT] && board.walls.some(wall => wall.x === x-k-1 && wall.y === y && wall.type === V)){connections[x][y][LEFT] = {x:x-k, y:y}; raycast[LEFT] = false;}
                if(raycast[UP] && board.walls.some(wall => wall.x === x && wall.y === y-k-1 && wall.type === H)){connections[x][y][UP] = {x:x, y:y-k}; raycast[UP] = false;}
            }
        }
    }
}

function EncodeRobots(robots){
    let i = 0;
    for(let color = 0; color < 5; color++){
        i += (gridSize*robots[color].x + robots[color].y)*Math.pow(gridSize*gridSize, color);
    }
    return i;
}

class GameState{
    constructor(robots, moves){
        this.robots = JSON.parse(JSON.stringify(robots));
        this.moves = JSON.parse(JSON.stringify(moves))
    }

    Move(movingColor, movingD){
        let movingRobot = this.robots[movingColor];

        if(movingD == UP){
            let maxY = movingRobot.y;
            let minY = 0;
            board.hWalls[movingRobot.x].forEach(y => {
                if(minY <= y && y < maxY){ minY = y+1; }
            })
            
            for(let color = 0; color < 5; color++){
                if(color == movingColor){continue;}
                let blockX = this.robots[color].x;
                let blockY = this.robots[color].y;

                if(blockX == movingRobot.x && minY <= blockY && blockY < maxY){
                    minY = blockY + 1;
                }
            }
            movingRobot.y = minY;
        }
        if(movingD == LEFT){
            let maxX = movingRobot.x;
            let minX = 0;
            board.vWalls[movingRobot.y].forEach(x => {
                if(minX <= x && x < maxX){ minX = x+1; }
            })
            
            for(let color = 0; color < 5; color++){
                if(color == movingColor){continue;}
                let blockX = this.robots[color].x;
                let blockY = this.robots[color].y;

                if(blockY == movingRobot.y && minX <= blockX && blockX < maxX){
                    minX = blockX + 1;
                }
            }
            movingRobot.x = minX;
        }
        if(movingD == DOWN){
            let maxY = gridSize - 1;
            let minY = movingRobot.y;
            board.hWalls[movingRobot.x].forEach(y => {
                if(minY <= y && y < maxY){ maxY = y; }
            })
            
            for(let color = 0; color < 5; color++){
                if(color == movingColor){continue;}
                let blockX = this.robots[color].x;
                let blockY = this.robots[color].y;

                if(blockX == movingRobot.x && minY < blockY && blockY <= maxY){
                    maxY = blockY - 1;
                }
            }
            movingRobot.y = maxY;
        }
        if(movingD == RIGHT){
            let maxX = gridSize - 1;
            let minX = movingRobot.x;
            board.vWalls[movingRobot.y].forEach(x => {
                if(minX <= x && x < maxX){ maxX = x; }
            })
            
            for(let color = 0; color < 5; color++){
                if(color == movingColor){continue;}
                let blockX = this.robots[color].x;
                let blockY = this.robots[color].y;

                if(blockY == movingRobot.y && minX < blockX && blockX <= maxX){
                    maxX = blockX - 1;
                }
            }
            movingRobot.x = maxX;
        }
        this.moves.push({color:movingColor, dir:movingD});
    }

    CheckWin(goal){
        if(goal == 0){
            return this.robots.some(robot => robot.x == board.goals[0].x && robot.y == board.goals[0].y)
        }
        let goalColor = (goal-1) % 4 + 1;
        return this.robots[goalColor].x == board.goals[goal].x && this.robots[goalColor].y == board.goals[goal].y;
    }

    SolveTree(goal, depth){
        if(depth == 0){return false;}
        
        let stateKey = EncodeRobots(this.robots);
        if(seenStates.has(stateKey)){return false;}
        seenStates.set(stateKey, true);

        console.log(this.moves);

        let newRobots = []; 
        for(let color = 0; color <= 4; color++){
            newRobots.push([]);
            for(let d = 0; d < 4; d++){
                newRobots[color][d] = new GameState(this.robots, this.moves)
                newRobots[color][d].Move(color, d);
                let isWin = newRobots[color][d].CheckWin(goal);
                if(isWin){return newRobots[color][d];}
            }
        }
        
        for(let color = 0; color <= 4; color++){
            for(let d = 0; d < 4; d++){
                let winningRobots = newRobots[color][d].SolveTree(goal, depth-1);
                if(winningRobots !== false){return winningRobots;}
            }
        }
        return false;
    }
}

let seenStates = null;
let todoStates = null;
function Solve(startingState, goal, maxDepth){
    seenStates = new Map();
    todoStates = [startingState];
    let checks = 0;
    let loops = 0;

    while(todoStates.length > 0){
        loops++;
        let state = todoStates.shift();

        if(state.moves.length > maxDepth){continue;}

        let stateKey = EncodeRobots(state.robots);
        if(seenStates.has(stateKey)){continue;}
        seenStates.set(stateKey, true);

        checks ++;
        if(state.CheckWin(goal)){
            console.log("checks", checks);
            console.log("loops", loops);
            return state;
        }
        
        let i = 0;
        for(let color = 0; color <= 4; color++){
            for(let d = 0; d < 4; d++){
                let newGameState = new GameState(state.robots, state.moves);
                newGameState.Move(color, d);
                todoStates.push(newGameState);
                i++;
            }
        }
    }
    return false;
}
