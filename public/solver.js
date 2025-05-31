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

export const Up = new Uint32Array([VoidUp, RedUp, GreenUp, BlueUp, YellowUp]);
export const Down = new Uint32Array([VoidDown, RedDown, GreenDown, BlueDown, YellowDown]);
export const Left = new Uint32Array([VoidLeft, RedLeft, GreenLeft, BlueLeft, YellowLeft]);
export const Right = new Uint32Array([VoidRight, RedRight, GreenRight, BlueRight, YellowRight]);

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

    static DefaultState(){
        let dummyObj = {
            robots : Uint8Array.from([
                1,1,
                0,0,
                15,0,
                4,15,
                3,9
            ]),
            cells : new Int8Array(gridSize * gridSize),
            moves : new Uint32Array(30),
            possibleMoves : 0b11111111111111111111,
        }
        return new GameState(dummyObj);
    }

    /**
     * @param {GameState} previousState will be deep copied 
     */
    constructor(previousState){
        this.robots = previousState.robots.slice();
        this.cells = previousState.cells.slice();
        this.moves = previousState.moves.slice();
        this.possibleMoves = previousState.possibleMoves;
    }

    PreComputeCells(){
        for(let y = 0; y < gridSize; y++){
            for(let x = 0; x < gridSize; x++){
                this.cells[x + y*gridSize] = -1;
            }
        }
        for(let robot = 0; robot < 5; robot++){
            let pos = this.robots[2*robot] + this.robots[2*robot+1]*gridSize;
            this.cells[pos] = robot;
        }
    }

    PreComputePossibleMoves(board){
        this.possibleMoves = 0b11111111111111111111;

        for(let robot = 0; robot < 5; robot++){
            let pos = this.robots[2*robot] + this.robots[2*robot+1]*gridSize;
            let moveUp = YellowUp << 4*(4-robot);
            let moveDown = YellowDown << 4*(4-robot);
            let moveLeft = YellowLeft << 4*(4-robot);
            let moveRight = YellowRight << 4*(4-robot);

            if(board.upLimit[pos] == pos || this.cells[pos - gridSize] != -1){
                this.possibleMoves &= ~moveUp;
            }
            if(board.downLimit[pos] == pos || this.cells[pos + gridSize] != -1){
                this.possibleMoves &= ~moveDown;
            }
            if(board.leftLimit[pos] == pos || this.cells[pos - 1] != -1){
                this.possibleMoves &= ~moveLeft;
            }
            if(board.rightLimit[pos] == pos || this.cells[pos + 1] != -1){
                this.possibleMoves &= ~moveRight;
            }
        }
    }

    Move(board, move){
        let xId = -1;
        let yId = -1;
        let blockXA = -1;
        let blockYA = -1;
        let blockXB = -1;
        let blockYB = -1;
        let blockXC = -1;
        let blockYC = -1;
        let blockXD = -1;
        let blockYD = -1;

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

        let robot = xId / 2;
        let startCell = this.robots[xId] + 16*this.robots[yId];
        let endCell = -1;

        if(move & IsUp){
            let maxY = this.robots[yId];
            let minY = board.upLimit[startCell];

            if(blockXA == this.robots[xId] && minY <= blockYA && blockYA < maxY){ minY = blockYA + 1; }
            if(blockXB == this.robots[xId] && minY <= blockYB && blockYB < maxY){ minY = blockYB + 1; }
            if(blockXC == this.robots[xId] && minY <= blockYC && blockYC < maxY){ minY = blockYC + 1; }
            if(blockXD == this.robots[xId] && minY <= blockYD && blockYD < maxY){ minY = blockYD + 1; }

            this.robots[yId] = minY;
            endCell = this.robots[xId] + this.robots[yId]*gridSize;

            // UP
            this.possibleMoves &= ~Up[robot];
            if(startCell < 240 && board.downLimit[startCell] != startCell && this.cells[startCell + gridSize] != -1){ 
                this.possibleMoves |= Up[this.cells[startCell + gridSize]];
            }

            // DOWN
            this.possibleMoves |= Down[robot];
            if(endCell >= 16 && this.cells[endCell - gridSize] != -1){ 
                this.possibleMoves &= ~Down[this.cells[endCell - gridSize]];
            }

            // LEFT
            if (startCell % 16 > 0) {
                if (board.leftLimit[startCell] != startCell && this.cells[startCell - 1] != -1) {
                    this.possibleMoves |= Right[this.cells[startCell - 1]];
                }

                if (board.leftLimit[endCell] != endCell) {
                    if (this.cells[endCell - 1] != -1) {
                        this.possibleMoves &= ~Left[robot];
                        this.possibleMoves &= ~Right[this.cells[endCell - 1]];
                    } else {
                        this.possibleMoves |= Left[robot];
                    }
                } else {
                    this.possibleMoves &= ~Left[robot];
                }
            }

            // RIGHT
            if (startCell % 16 < 15) {
                if (board.rightLimit[startCell] != startCell && this.cells[startCell + 1] != -1) {
                    this.possibleMoves |= Left[this.cells[startCell + 1]];
                }

                if (board.rightLimit[endCell] != endCell) {
                    if (this.cells[endCell + 1] != -1) {
                        this.possibleMoves &= ~Right[robot];
                        this.possibleMoves &= ~Left[this.cells[endCell + 1]];
                    } else {
                        this.possibleMoves |= Right[robot];
                    }
                } else {
                    this.possibleMoves &= ~Right[robot];
                }
            }
        }else if(move & IsLeft){
            let maxX = this.robots[xId];
            let minX = board.leftLimit[startCell];

            if(blockYA == this.robots[yId] && minX <= blockXA && blockXA < maxX){ minX = blockXA + 1; }
            if(blockYB == this.robots[yId] && minX <= blockXB && blockXB < maxX){ minX = blockXB + 1; }
            if(blockYC == this.robots[yId] && minX <= blockXC && blockXC < maxX){ minX = blockXC + 1; }
            if(blockYD == this.robots[yId] && minX <= blockXD && blockXD < maxX){ minX = blockXD + 1; }

            this.robots[xId] = minX;
            endCell = this.robots[xId] + this.robots[yId]*gridSize;
            
            // RIGHT
            this.possibleMoves |= Right[robot];
            if(endCell % 16 > 0 && this.cells[endCell - 1] != -1){ 
                this.possibleMoves &= ~Right[this.cells[endCell - 1]];
            }

            // LEFT
            this.possibleMoves &= ~Left[robot];
            if(startCell % 16 < 15 && board.rightLimit[startCell] != startCell && this.cells[startCell + 1] != -1){ 
                this.possibleMoves |= Left[this.cells[endCell + 1]];
            }

            // UP
            if (startCell >= 16) {
                if (board.upLimit[startCell] != startCell && this.cells[startCell - gridSize] != -1) {
                    this.possibleMoves |= Down[this.cells[startCell - gridSize]];
                }

                if (board.upLimit[endCell] != endCell) {
                    if (this.cells[endCell - gridSize] != -1) {
                        this.possibleMoves &= ~Up[robot];
                        this.possibleMoves &= ~Down[this.cells[endCell - gridSize]];
                    } else {
                        this.possibleMoves |= Up[robot];
                    }
                } else {
                    this.possibleMoves &= ~Up[robot];
                }
            }

            // DOWN
            if (startCell < 240) {
                if (board.downLimit[startCell] != startCell && this.cells[startCell + gridSize] != -1) {
                    this.possibleMoves |= Up[this.cells[startCell + gridSize]];
                }

                if (board.downLimit[endCell] != endCell) {
                    if (this.cells[endCell + gridSize] != -1) {
                        this.possibleMoves &= ~Down[robot];
                        this.possibleMoves &= ~Up[this.cells[endCell + gridSize]];
                    } else {
                        this.possibleMoves |= Down[robot];
                    }
                } else {
                    this.possibleMoves &= ~Down[robot];
                }
            }

        }else if(move & IsDown){
            let maxY = board.downLimit[startCell];
            let minY = this.robots[yId];

            if(blockXA == this.robots[xId] && minY < blockYA && blockYA <= maxY){ maxY = blockYA - 1; }
            if(blockXB == this.robots[xId] && minY < blockYB && blockYB <= maxY){ maxY = blockYB - 1; }
            if(blockXC == this.robots[xId] && minY < blockYC && blockYC <= maxY){ maxY = blockYC - 1; }
            if(blockXD == this.robots[xId] && minY < blockYD && blockYD <= maxY){ maxY = blockYD - 1; }

            this.robots[yId] = maxY;
            endCell = this.robots[xId] + this.robots[yId]*gridSize;
            
            // UP
            this.possibleMoves |= Up[robot];
            if(endCell < 240 && this.cells[endCell + gridSize] != -1){ 
                this.possibleMoves &= ~Up[this.cells[endCell + gridSize]];
            }

            // DOWN
            this.possibleMoves &= ~Down[robot];
            if(startCell >= 16 && board.upLimit[startCell] != startCell && this.cells[startCell - gridSize] != -1){ 
                this.possibleMoves |= Down[this.cells[endCell - gridSize]];
            }

            // LEFT
            if (startCell % 16 > 0) {
                if (board.leftLimit[startCell] != startCell && this.cells[startCell - 1] != -1) {
                    this.possibleMoves |= Right[this.cells[startCell - 1]];
                }

                if (board.leftLimit[endCell] != endCell) {
                    if (this.cells[endCell - 1] != -1) {
                        this.possibleMoves &= ~Left[robot];
                        this.possibleMoves &= ~Right[this.cells[endCell - 1]];
                    } else {
                        this.possibleMoves |= Left[robot];
                    }
                } else {
                    this.possibleMoves &= ~Left[robot];
                }
            }

            // RIGHT
            if (startCell % 16 < 15) {
                if (board.rightLimit[startCell] != startCell && this.cells[startCell + 1] != -1) {
                    this.possibleMoves |= Left[this.cells[startCell + 1]];
                }

                if (board.rightLimit[endCell] != endCell) {
                    if (this.cells[endCell + 1] != -1) {
                        this.possibleMoves &= ~Right[robot];
                        this.possibleMoves &= ~Left[this.cells[endCell + 1]];
                    } else {
                        this.possibleMoves |= Right[robot];
                    }
                } else {
                    this.possibleMoves &= ~Right[robot];
                }
            }
        }else if(move & IsRight){
            let maxX = board.rightLimit[startCell];
            let minX = this.robots[xId];

            if(blockYA == this.robots[yId] && minX < blockXA && blockXA <= maxX){ maxX = blockXA - 1; }
            if(blockYB == this.robots[yId] && minX < blockXB && blockXB <= maxX){ maxX = blockXB - 1; }
            if(blockYC == this.robots[yId] && minX < blockXC && blockXC <= maxX){ maxX = blockXC - 1; }
            if(blockYD == this.robots[yId] && minX < blockXD && blockXD <= maxX){ maxX = blockXD - 1; }

            this.robots[xId] = maxX;
            endCell = this.robots[xId] + this.robots[yId]*gridSize;
            
            // LEFT
            this.possibleMoves |= Left[robot];
            if(endCell % 16 < 15 && this.cells[endCell + 1] != -1){ 
                this.possibleMoves &= ~Left[this.cells[endCell + 1]];
            }

            // RIGHT
            this.possibleMoves &= ~Right[robot];
            if(startCell % 16 > 0 && board.leftLimit[startCell] != startCell && this.cells[startCell - 1] != -1){ 
                this.possibleMoves |= Right[this.cells[endCell - 1]];
            }

            // UP
            if (startCell >= 16) {
                if (board.upLimit[startCell] != startCell && this.cells[startCell - gridSize] != -1) {
                    this.possibleMoves |= Down[this.cells[startCell - gridSize]];
                }

                if (board.upLimit[endCell] != endCell) {
                    if (this.cells[endCell - gridSize] != -1) {
                        this.possibleMoves &= ~Up[robot];
                        this.possibleMoves &= ~Down[this.cells[endCell - gridSize]];
                    } else {
                        this.possibleMoves |= Up[robot];
                    }
                } else {
                    this.possibleMoves &= ~Up[robot];
                }
            }

            // DOWN
            if (startCell < 240) {
                if (board.downLimit[startCell] != startCell && this.cells[startCell + gridSize] != -1) {
                    this.possibleMoves |= Up[this.cells[startCell + gridSize]];
                }

                if (board.downLimit[endCell] != endCell) {
                    if (this.cells[endCell + gridSize] != -1) {
                        this.possibleMoves &= ~Down[robot];
                        this.possibleMoves &= ~Up[this.cells[endCell + gridSize]];
                    } else {
                        this.possibleMoves |= Down[robot];
                    }
                } else {
                    this.possibleMoves &= ~Down[robot];
                }
            }
        }

        this.cells[startCell] = -1;
        this.cells[endCell] = robot;

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
    startingState.PreComputeCells(board);
    startingState.PreComputePossibleMoves(board);
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
        
        for(let moveIndex = 0; moveIndex < 20; moveIndex++){
            let move = (1 << moveIndex);
            if(move & state.possibleMoves){
                let newGameState = new GameState(state);
                newGameState.Move(board, move);
                todoStates.push(newGameState);
                numOfStates++;
            }
        }

    }
    return false;
}
