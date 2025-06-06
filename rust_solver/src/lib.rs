use queues::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

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

#[derive(Clone)]
struct GameState {
    void: (u8, u8),
    red: (u8, u8),
    green: (u8, u8),
    blue: (u8, u8),
    yellow: (u8, u8),
    move_count: u8,
    moves: [Move; 25]
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

fn js_to_rust(js : JsValue) -> GameState{
    return GameState { void: (1, 1), red: (0, 0), green: (15, 0), blue: (4, 15), yellow: (3, 9), move_count: 0, moves: [Move::VoidUp; 25]};
}

fn rust_to_js(state : GameState) -> JsValue{
    return JsValue::from_f64(state.move_count.into());
}


#[wasm_bindgen]
pub fn solve(start_state : JsValue, depth : u8) -> JsValue{
    let states_max_count: usize = 100000;
    let mut states: Buffer<GameState> = Buffer::new(states_max_count);

    let res = states.add(js_to_rust(start_state));

    loop {
        let state : GameState = states.remove().expect("Queue should not be empty");

        

        if states.size() == 0 {
            return None;
        }
    }
}

