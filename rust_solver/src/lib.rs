use std::collections::HashMap;

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
pub struct Board {
    pub bob: String,
    pub walls: Vec<HashMap<String, u8>>,
}

#[wasm_bindgen]
pub fn set_board(board : JsValue) -> Result<(), JsValue>{
    let b: Board = serde_wasm_bindgen::from_value(board)?;
    log("Hello World from Rust !");
    log(b.bob.as_str());
    log(b.walls.len().to_string().as_str());
    Ok(())
}

