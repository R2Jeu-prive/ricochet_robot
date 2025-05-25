
const canvas = document.getElementsByClassName("board")[0];
const ctx = canvas.getContext("2d");
const gridSize = 16;
const V = 0; // vertical wall right of cell
const H = 1; // horizontal wall under cell

const RED = 0;
const GREEN = 1;
const BLUE = 2;
const YELLOW = 3;

const STAR = 0;
const MOON = 4;
const GEAR = 8;
const PLANET = 12;
const VOID = 16;

window.addEventListener("load", () => {
    initBoard();
    drawCanvas();
    let robots = new Uint8Array(2*5);
    robots[0] = 0;
    robots[1] = 0;
    robots[2] = 0;
    robots[3] = 13;
    robots[4] = 0;
    robots[5] = 12;
    robots[6] = 14;
    robots[7] = 14;
    robots[8] = 14;
    robots[9] = 0;
    let moves = new Uint8Array(20);
    moves[0] = 0;
    let ini = new GameState(robots, moves, -1);
    /*ini.Move(GREEN, RIGHT);
    ini.Move(GREEN, UP);
    ini.Move(GREEN, LEFT);
    ini.Move(GREEN, DOWN);
    ini.Move(GREEN, RIGHT);*/
    drawCanvas(ini);
    console.log(Solve(ini, MOON+GREEN, 7));
});
