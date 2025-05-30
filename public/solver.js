import { gridSize, H, V, RED, GREEN, BLUE, YELLOW } from "./constants.js";
import { preComputeBoard } from "./board.js";

// Moves
export const VoidUp       = 0b10000000000000000000;
export const VoidDown     = 0b01000000000000000000;
export const VoidLeft     = 0b00100000000000000000;
export const VoidRight    = 0b00010000000000000000;
export const RedUp        = 0b00001000000000000000;
export const RedDown      = 0b00000100000000000000;
export const RedLeft      = 0b00000010000000000000;
export const RedRight     = 0b00000001000000000000;
export const GreenUp      = 0b00000000100000000000;
export const GreenDown    = 0b00000000010000000000;
export const GreenLeft    = 0b00000000001000000000;
export const GreenRight   = 0b00000000000100000000;
export const BlueUp       = 0b00000000000010000000;
export const BlueDown     = 0b00000000000001000000;
export const BlueLeft     = 0b00000000000000100000;
export const BlueRight    = 0b00000000000000010000;
export const YellowUp     = 0b00000000000000001000;
export const YellowDown   = 0b00000000000000000100;
export const YellowLeft   = 0b00000000000000000010;
export const YellowRight  = 0b00000000000000000001;

// Move Masks
export const IsVoid   = 0b11110000000000000000;
export const IsRed    = 0b00001111000000000000;
export const IsGreen  = 0b00000000111100000000;
export const IsBlue   = 0b00000000000011110000;
export const IsYellow = 0b00000000000000001111;
export const IsUp     = 0b10001000100010001000;
export const IsDown   = 0b01000100010001000100;
export const IsLeft   = 0b00100010001000100010;
export const IsRight  = 0b00010001000100010001;

function EncodeRobots(robots){
    let i = 0;
    i += (gridSize*robots[0] + robots[1]);
    i += (gridSize*robots[2] + robots[3])*256;
    i += (gridSize*robots[4] + robots[5])*65536;
    i += (gridSize*robots[6] + robots[7])*16777216;
    i += (gridSize*robots[8] + robots[9])*4294967296;
    return i;
}

export class GameState{
    /**
     * @param {GameState} previousState will be deep copied 
     */
    constructor(previousState){
        this.robots = previousState.robots.slice();
        this.moves = previousState.moves.slice();
    }

    Move(board, move){
        let xId = null;
        let yId = null;
        let blockXA = null;
        let blockYA = null;
        let blockXB = null;
        let blockYB = null;
        let blockXC = null;
        let blockYC = null;
        let blockXD = null;
        let blockYD = null;

        if(move & IsVoid){
            xId = 0; yId = 1;
            blockXA = this.robots[2]; blockYA = this.robots[3];
            blockXB = this.robots[4]; blockYB = this.robots[5];
            blockXC = this.robots[6]; blockYC = this.robots[7];
            blockXD = this.robots[8]; blockYD = this.robots[9];
        }
        else if(move & IsRed){
            xId = 2; yId = 3;
            blockXA = this.robots[0]; blockYA = this.robots[1];
            blockXB = this.robots[4]; blockYB = this.robots[5];
            blockXC = this.robots[6]; blockYC = this.robots[7];
            blockXD = this.robots[8]; blockYD = this.robots[9];
        }
        else if(move & IsGreen){
            xId = 4; yId = 5;
            blockXA = this.robots[2]; blockYA = this.robots[3];
            blockXB = this.robots[0]; blockYB = this.robots[1];
            blockXC = this.robots[6]; blockYC = this.robots[7];
            blockXD = this.robots[8]; blockYD = this.robots[9];
        }
        else if(move & IsBlue){
            xId = 6; yId = 7;
            blockXA = this.robots[2]; blockYA = this.robots[3];
            blockXB = this.robots[4]; blockYB = this.robots[5];
            blockXC = this.robots[0]; blockYC = this.robots[1];
            blockXD = this.robots[8]; blockYD = this.robots[9];
        }
        else if(move & IsYellow){
            xId = 8; yId = 9;
            blockXA = this.robots[2]; blockYA = this.robots[3];
            blockXB = this.robots[4]; blockYB = this.robots[5];
            blockXC = this.robots[6]; blockYC = this.robots[7];
            blockXD = this.robots[0]; blockYD = this.robots[1];
        }

        let currentSpot = this.robots[xId] + 16*this.robots[yId];

        if(move & IsUp){
            let maxY = this.robots[yId];
            let minY = board.upLimit[currentSpot];

            if(blockXA == this.robots[xId] && minY <= blockYA && blockYA < maxY){ minY = blockYA + 1; }
            if(blockXB == this.robots[xId] && minY <= blockYB && blockYB < maxY){ minY = blockYB + 1; }
            if(blockXC == this.robots[xId] && minY <= blockYC && blockYC < maxY){ minY = blockYC + 1; }
            if(blockXD == this.robots[xId] && minY <= blockYD && blockYD < maxY){ minY = blockYD + 1; }

            this.robots[yId] = minY;
        }else if(move & IsLeft){
            let maxX = this.robots[xId];
            let minX = board.leftLimit[currentSpot];

            if(blockYA == this.robots[yId] && minX <= blockXA && blockXA < maxX){ minX = blockXA + 1; }
            if(blockYB == this.robots[yId] && minX <= blockXB && blockXB < maxX){ minX = blockXB + 1; }
            if(blockYC == this.robots[yId] && minX <= blockXC && blockXC < maxX){ minX = blockXC + 1; }
            if(blockYD == this.robots[yId] && minX <= blockXD && blockXD < maxX){ minX = blockXD + 1; }

            this.robots[xId] = minX;
        }else if(move & IsDown){
            let maxY = board.downLimit[currentSpot];
            let minY = this.robots[yId];

            if(blockXA == this.robots[xId] && minY < blockYA && blockYA <= maxY){ maxY = blockYA - 1; }
            if(blockXB == this.robots[xId] && minY < blockYB && blockYB <= maxY){ maxY = blockYB - 1; }
            if(blockXC == this.robots[xId] && minY < blockYC && blockYC <= maxY){ maxY = blockYC - 1; }
            if(blockXD == this.robots[xId] && minY < blockYD && blockYD <= maxY){ maxY = blockYD - 1; }

            this.robots[yId] = maxY;
        }else if(move & IsRight){
            let maxX = board.rightLimit[currentSpot];
            let minX = this.robots[xId];

            if(blockYA == this.robots[yId] && minX < blockXA && blockXA <= maxX){ maxX = blockXA - 1; }
            if(blockYB == this.robots[yId] && minX < blockXB && blockXB <= maxX){ maxX = blockXB - 1; }
            if(blockYC == this.robots[yId] && minX < blockXC && blockXC <= maxX){ maxX = blockXC - 1; }
            if(blockYD == this.robots[yId] && minX < blockXD && blockXD <= maxX){ maxX = blockXD - 1; }

            this.robots[xId] = maxX;
        }

        this.moves[this.moves[0] + 1] = move;
        this.moves[0]++;
    }

    CheckWin(board, goal){
        let goalColor = goal % 4;
        let goalX = board.goals[2*goal];
        let goalY = board.goals[2*goal + 1];
        if(this.robots[2] == goalX && this.robots[3] == goalY && (goal == 16 || goalColor == RED)){ return true; }
        else if(this.robots[4] == goalX && this.robots[5] == goalY && (goal == 16 || goalColor == GREEN)){ return true; }
        else if(this.robots[6] == goalX && this.robots[7] == goalY && (goal == 16 || goalColor == BLUE)){ return true; }
        else if(this.robots[8] == goalX && this.robots[9] == goalY && (goal == 16 || goalColor == YELLOW)){ return true; }
        else if(this.robots[0] == goalX && this.robots[1] == goalY && goal == 16){ return true;}
        return false;
    }
}

export function solve(board, startingState, goal, maxDepth){
    board = preComputeBoard(board);
    let seenStates = new Map();
    let todoStates = [startingState];
    let checks = 0;
    let stateId = -1;
    let numOfStates = 1;
    let startTime = Date.now();

    while(stateId + 1 < numOfStates){
        stateId++;
        let state = todoStates[stateId];
        
        if(state.moves[0] > maxDepth){continue;}

        let stateKey = EncodeRobots(state.robots);
        if(seenStates.has(stateKey)){continue;}
        seenStates.set(stateKey, true);

        checks++;
        if(state.CheckWin(board, goal)){
            console.log("checks", checks);
            console.log("loops", stateId);
            console.log("time", Date.now() - startTime);
            return state;
        }
        
        for(let move = 0; move < 20; move++){
            let newGameState = new GameState(state);
            newGameState.Move(board, 1 << move);
            todoStates.push(newGameState);
            numOfStates++;
        }

    }
    return false;
}
