//use queues::*;
use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}

pub const WALL_NONE : u8 = 0;
pub const WALL_UNDER : u8 = 1;
pub const WALL_RIGHT : u8 = 2;
pub const WALL_BOTH : u8 = 3;

/*
#[derive(Clone, Copy)]
enum Move {
    VoidUp,
    VoidDown,
    VoidLeft,
    VoidRight,
    RedUp,
    RedDown,
    RedLeft,
    RedRight,
    GreenUp,
    GreenDown,
    GreenLeft,
    GreenRight,
    BlueUp,
    BlueDown,
    BlueLeft,
    BlueRight,
    YellowUp,
    YellowDown,
    YellowLeft,
    YellowRight,
}
*/

#[derive(Serialize, Deserialize)]
pub struct JsBoard {
    pub walls: Vec<u8>,
    pub goals: Vec<u8>,
}

pub struct Board {
    pub goals: Vec<u8>,
    pub up_limit: Vec<u8>,
    pub down_limit: Vec<u8>,
    pub left_limit: Vec<u8>,
    pub right_limit: Vec<u8>,
}

pub fn pre_compute_board(js_board : JsBoard) -> Board{
    let mut board = Board {
        goals: vec![0; 17],
        up_limit: vec![0; 256],
        down_limit: vec![15; 256],
        left_limit: vec![15; 256],
        right_limit: vec![0; 256],
    };

    for i in 0..17 {
        board.goals[i] = js_board.goals[i];
    }

    'a : for x in 0..16 {
        for y in 0..16 {
            let i = x + 16*y;

            for y_ in (1..y).rev() {
                if (js_board.walls[x + 16*y_] & WALL_UNDER) != 0 { board.up_limit[i] = (y_ + 1) as u8; break; }
            }

            for y_ in y..15 {
                if (js_board.walls[x + 16*y_] & WALL_UNDER) != 0 { board.down_limit[i] = y_ as u8; break; }
            }

            for x_ in (1..x).rev() {
                if (js_board.walls[x_ + 16*y] & WALL_RIGHT) != 0 { board.left_limit[i] = (x_ + 1) as u8; break; }
            }

            for x_ in x..15 {
                if (js_board.walls[x_ + 16*y] & WALL_RIGHT) != 0 { board.right_limit[i] = x_ as u8; break; }
            }
        }
    }

    return board;
}

#[wasm_bindgen]
pub fn set_board(js_board : JsValue) -> Result<(), JsValue>{
    let parsed_js_board: JsBoard = serde_wasm_bindgen::from_value(js_board)?;
    let board: Board = pre_compute_board(parsed_js_board);
    log("Hello World from Rust !");
    log(board.down_limit[3].to_string().as_str());
    Ok(())
}

