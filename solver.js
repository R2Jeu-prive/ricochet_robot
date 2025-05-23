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

class GameState{
    constructor(robots, moves){
        this.robots = JSON.parse(JSON.stringify(robots));
        this.moves = JSON.parse(JSON.stringify(moves))
    }

    Move(movingColor, movingD){
        let movingRobot = this.robots[movingColor];
        let start = this.robots[movingColor];
        let end = connections[movingRobot.x][movingRobot.y][movingD];
        let fastWarp = !this.robots.some(function(robot, color){
            return (color != movingColor
            && (
                (movingD <= 1 && robot.x == movingRobot.x)
                ||
                (movingD >= 2 && robot.y == movingRobot.y)
            ));
        })

        if(!fastWarp){
            let max = end;
            end = start;
            for(let k = 0; k < 20; k++){
                if(end.x == max.x && end.y == max.y){break;}
                if(this.robots.some(function(robot, color){
                    return (color != movingColor
                        && robot.x == end.x + dirs[movingD].x
                        && robot.y == end.y + dirs[movingD].y
                    );
                })){
                    break;
                }
                end.x += dirs[movingD].x;
                end.y += dirs[movingD].y;
            }
        }
        this.robots[movingColor] = end;
        this.moves.push({color:movingColor, dir:movingD});
        return end.x == start.x && end.y == start.y;
    }

    CheckWin(goal){
        if(goal == 0){
            return this.robots.some(robot => robot.x == board.goals[0].x && robot.y == board.goals[0].y)
        }
        let goalColor = (goal-1) % 4 + 1;
        return this.robots[goalColor].x == board.goals[goal].x && this.robots[goalColor].y == board.goals[goal].y;
    }

    Solve(goal, depth){
        if(depth == 0){return false;}

        let newRobots = []; 
        let nothingChanged = [];
        for(let color = 0; color <= 4; color++){
            newRobots.push([]);
            nothingChanged.push([])
            for(let d = 0; d < 4; d++){
                newRobots[color][d] = new GameState(this.robots, this.moves)
                nothingChanged[color][d] = newRobots[color][d].Move(color, d);
                if(nothingChanged[color][d]){continue;}
                let isWin = newRobots[color][d].CheckWin(goal);
                if(isWin){return newRobots[color][d];}
            }
        }
        
        for(let color = 0; color <= 4; color++){
            for(let d = 0; d < 4; d++){
                if(nothingChanged[color][d]){continue;}
                let winningRobots = newRobots[color][d].Solve(goal, depth-1);
                if(winningRobots !== false){console.log(winningRobots); return winningRobots;}
            }
        }
        return false;
    }
}
