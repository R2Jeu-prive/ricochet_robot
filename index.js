
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

    let ini = new GameState([{x:8,y:8},{x:8,y:9},{x:1,y:15},{x:9,y:8},{x:9,y:9}],[]);
    console.log(ini.Solve(MOON+GREEN, 8));
});
