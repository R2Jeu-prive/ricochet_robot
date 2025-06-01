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

let states = null;
const sizeOfState = 10 + 22;
const todoStatesLength = (1 << 25);
let currentId = -1;
let freeId = -1;
let nextFreeId = -1;

function move(board, moveId, current){
    let move = (1 << moveId);
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
        xId = current; yId = current+1;
        blockXA = states[current+2]; blockYA = states[current+3];
        blockXB = states[current+4]; blockYB = states[current+5];
        blockXC = states[current+6]; blockYC = states[current+7];
        blockXD = states[current+8]; blockYD = states[current+9];
    }
    else if(move & IsRed){
        xId = current+2; yId = current+3;
        blockXA = states[current+0]; blockYA = states[current+1];
        blockXB = states[current+4]; blockYB = states[current+5];
        blockXC = states[current+6]; blockYC = states[current+7];
        blockXD = states[current+8]; blockYD = states[current+9];
    }
    else if(move & IsGreen){
        xId = current+4; yId = current+5;
        blockXA = states[current+2]; blockYA = states[current+3];
        blockXB = states[current+0]; blockYB = states[current+1];
        blockXC = states[current+6]; blockYC = states[current+7];
        blockXD = states[current+8]; blockYD = states[current+9];
    }
    else if(move & IsBlue){
        xId = current+6; yId = current+7;
        blockXA = states[current+2]; blockYA = states[current+3];
        blockXB = states[current+4]; blockYB = states[current+5];
        blockXC = states[current+0]; blockYC = states[current+1];
        blockXD = states[current+8]; blockYD = states[current+9];
    }
    else if(move & IsYellow){
        xId = current+8; yId = current+9;
        blockXA = states[current+2]; blockYA = states[current+3];
        blockXB = states[current+4]; blockYB = states[current+5];
        blockXC = states[current+6]; blockYC = states[current+7];
        blockXD = states[current+0]; blockYD = states[current+1];
    }

    let currentSpot = states[xId] + 16*states[yId];

    if(move & IsUp){
        let maxY = states[yId];
        let minY = board.upLimit[currentSpot];

        if(blockXA == states[xId] && minY <= blockYA && blockYA < maxY){ minY = blockYA + 1; }
        if(blockXB == states[xId] && minY <= blockYB && blockYB < maxY){ minY = blockYB + 1; }
        if(blockXC == states[xId] && minY <= blockYC && blockYC < maxY){ minY = blockYC + 1; }
        if(blockXD == states[xId] && minY <= blockYD && blockYD < maxY){ minY = blockYD + 1; }

        states[yId] = minY;
    }else if(move & IsLeft){
        let maxX = states[xId];
        let minX = board.leftLimit[currentSpot];

        if(blockYA == states[yId] && minX <= blockXA && blockXA < maxX){ minX = blockXA + 1; }
        if(blockYB == states[yId] && minX <= blockXB && blockXB < maxX){ minX = blockXB + 1; }
        if(blockYC == states[yId] && minX <= blockXC && blockXC < maxX){ minX = blockXC + 1; }
        if(blockYD == states[yId] && minX <= blockXD && blockXD < maxX){ minX = blockXD + 1; }

        states[xId] = minX;
    }else if(move & IsDown){
        let maxY = board.downLimit[currentSpot];
        let minY = states[yId];

        if(blockXA == states[xId] && minY < blockYA && blockYA <= maxY){ maxY = blockYA - 1; }
        if(blockXB == states[xId] && minY < blockYB && blockYB <= maxY){ maxY = blockYB - 1; }
        if(blockXC == states[xId] && minY < blockYC && blockYC <= maxY){ maxY = blockYC - 1; }
        if(blockXD == states[xId] && minY < blockYD && blockYD <= maxY){ maxY = blockYD - 1; }

        states[yId] = maxY;
    }else if(move & IsRight){
        let maxX = board.rightLimit[currentSpot];
        let minX = states[xId];

        if(blockYA == states[yId] && minX < blockXA && blockXA <= maxX){ maxX = blockXA - 1; }
        if(blockYB == states[yId] && minX < blockXB && blockXB <= maxX){ maxX = blockXB - 1; }
        if(blockYC == states[yId] && minX < blockXC && blockXC <= maxX){ maxX = blockXC - 1; }
        if(blockYD == states[yId] && minX < blockXD && blockXD <= maxX){ maxX = blockXD - 1; }

        states[xId] = maxX;
    }

    states[current + states[current + 10] + 11] = moveId;
    states[current + 10]++;
}

function encodeRobots(current){
    let i = 0;
    i += (gridSize*states[current] + states[current+1]);
    i += (gridSize*states[current+2] + states[current+3])*256;
    i += (gridSize*states[current+4] + states[current+5])*65536;
    i += (gridSize*states[current+6] + states[current+7])*16777216;
    i += (gridSize*states[current+8] + states[current+9])*4294967296;
    return i;
}

function checkWin(board, goal, current){
    let goalColor = goal % 4;
    let goalX = board.goals[2*goal];
    let goalY = board.goals[2*goal + 1];
    if(states[current+2] == goalX && states[current+3] == goalY && (goal == 16 || goalColor == RED)){ return true; }
    else if(states[current+4] == goalX && states[current+5] == goalY && (goal == 16 || goalColor == GREEN)){ return true; }
    else if(states[current+6] == goalX && states[current+7] == goalY && (goal == 16 || goalColor == BLUE)){ return true; }
    else if(states[current+8] == goalX && states[current+9] == goalY && (goal == 16 || goalColor == YELLOW)){ return true; }
    else if(states[current] == goalX && states[current+1] == goalY && goal == 16){ return true;}
    return false;
}

function enqueue(board, moveId, current){
    nextFreeId = (freeId + 1) % todoStatesLength
    if(nextFreeId != currentId){
        states.copyWithin(freeId*sizeOfState, current, current+32);
        move(board, moveId, freeId*sizeOfState)
        freeId = nextFreeId;
    }else{
        throw new Error("Out Of Memory !");
    }
}

export function solve(board, startingState, goal, maxDepth){
    /*
    GameState data structure (32 bytes):

    | Byte Index | Name         | Description                                      |
    |------------|--------------|--------------------------------------------------|
    | 0          | xVoid        | X position of the Void robot                     |
    | 1          | yVoid        | Y position of the Void robot                     |
    | 2          | xRed         | X position of the Red robot                      |
    | 3          | yRed         | Y position of the Red robot                      |
    | 4          | xGreen       | X position of the Green robot                    |
    | 5          | yGreen       | Y position of the Green robot                    |
    | 6          | xBlue        | X position of the Blue robot                     |
    | 7          | yBlue        | Y position of the Blue robot                     |
    | 8          | xYellow      | X position of the Yellow robot                   |
    | 9          | yYellow      | Y position of the Yellow robot                   |
    | 10         | moveCount    | Number of moves played in this position          |
    | 11 - 31    | moves[]      | List of move IDs (each is an integer 0-255)      |
    */

    board = preComputeBoard(board);
    states = new Uint8Array(sizeOfState * todoStatesLength);
    startingState.every((val, i) => states[i] = val);

    let current = -1;
    let stateKey = -1;
    let robot = -1;
    let cell = -1;
    let seenStates = new Map();

    currentId = 0;
    freeId = 1;
    let startTime = Date.now();

    while(currentId != freeId){
        //console.log(currentId, freeId);

        current = currentId * sizeOfState;
        
        if(states[current + 10] > maxDepth){currentId = (currentId + 1) % todoStatesLength; continue;}

        stateKey = encodeRobots(current);
        if(seenStates.has(stateKey)){currentId = (currentId + 1) % todoStatesLength; continue;}
        seenStates.set(stateKey, true);

        if(checkWin(board, goal, current)){
            console.log("time", Date.now() - startTime);
            return states.subarray(current, current+32);
        }

        for(robot = 0; robot < 5; robot++){
            cell = states[current + 2*robot] + gridSize*states[current + 2*robot + 1];
            if(board.upLimit[cell] != cell){ enqueue(board, 20 - 4*robot, current); }
            if(board.downLimit[cell] != cell){ enqueue(board, 19 - 4*robot, current); }
            if(board.leftLimit[cell] != cell){ enqueue(board, 18 - 4*robot, current); }
            if(board.rightLimit[cell] != cell){ enqueue(board, 17 - 4*robot, current); }
        }

        currentId = (currentId + 1) % todoStatesLength;
    }
    console.error("No Solution found under depth ", maxDepth);
    return false;
}
