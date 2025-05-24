
const canvas = document.getElementsByClassName("board")[0];
const ctx = canvas.getContext("2d");
const gridSize = 18;
const V = 0; // vertical wall right of cell
const H = 1; // horizontal wall under cell

const VOID = 0;
const RED = 1;
const GREEN = 2;
const BLUE = 3;
const YELLOW = 4;

const STAR = 0;
const MOON = 4;
const GEAR = 8;
const PLANET = 12;

window.addEventListener("load", () => {
    initBoard();
    buildConnections();
    drawCanvas();

    let ini = new GameState([{x:1,y:1},{x:1,y:14},{x:1,y:15},{x:15,y:15},{x:15,y:1}],[]);
    /*ini.Move(GREEN, DOWN);
    ini.Move(GREEN, RIGHT);
    ini.Move(GREEN, UP);
    ini.Move(GREEN, LEFT);
    ini.Move(GREEN, DOWN);
    ini.Move(GREEN, RIGHT);*/
    drawCanvas(ini);
    console.log(Solve(ini, MOON+GREEN, 7));
});
