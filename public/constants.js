export const gridSize = 16;

// For goals
export const RED = 0;
export const GREEN = 1;
export const BLUE = 2;
export const YELLOW = 3;
export const STAR = 0;
export const MOON = 4;
export const GEAR = 8;
export const PLANET = 12;
export const VOID = 16;

// For walls
export const V = 0; // vertical wall right of cell
export const H = 1; // horizontal wall under cell

export const defaultBoard = {
    goals : Uint8Array.from([
        13, 10,
        9, 1,
        5, 2,
        3, 9,
        1, 11,
        2, 4,
        9, 14,
        14, 2,
        7, 5,
        2, 14,
        12, 6,
        14, 12,
        10, 4,
        10, 11,
        6, 12,
        1, 6,
        8, 10,
    ]),
    walls : [
        {x:3,y:0,type:V},
        {x:10,y:0,type:V},
        {x:8,y:1,type:V},
        {x:5,y:2,type:V},
        {x:14,y:2,type:V},
        {x:2,y:4,type:V},
        {x:10,y:4,type:V},
        {x:6,y:5,type:V},
        {x:0,y:6,type:V},
        {x:11,y:6,type:V},
        {x:3,y:9,type:V},
        {x:7,y:10,type:V},
        {x:12,y:10,type:V},
        {x:0,y:11,type:V},
        {x:10,y:11,type:V},
        {x:6,y:12,type:V},
        {x:13,y:12,type:V},
        {x:1,y:14,type:V},
        {x:9,y:14,type:V},
        {x:5,y:15,type:V},
        {x:11,y:15,type:V},
        
        {x:9,y:1,type:H},
        {x:14,y:1,type:H},
        {x:5,y:2,type:H},
        {x:2,y:3,type:H},
        {x:0,y:4,type:H},
        {x:10,y:4,type:H},
        {x:15,y:4,type:H},
        {x:1,y:5,type:H},
        {x:7,y:5,type:H},
        {x:12,y:5,type:H},
        {x:3,y:8,type:H},
        {x:15,y:8,type:H},
        {x:8,y:9,type:H},
        {x:13,y:9,type:H},
        {x:1,y:11,type:H},
        {x:10,y:11,type:H},
        {x:6,y:12,type:H},
        {x:14,y:12,type:H},
        {x:0,y:13,type:H},
        {x:2,y:13,type:H},
        {x:9,y:13,type:H},
    ]
}

export const defaultState = {
    robots : Uint8Array.from([
        1,1,
        0,0,
        15,0,
        15,15,
        0,15
    ]),
    moves : new Uint32Array(30)
}