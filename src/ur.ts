import { c } from './canvas'
import { TouchMouse } from './loop_input'

export const PURPLE = '#5e4069'
export const BLACK = '#120a19'
export const RED = '#c4181f'
export const DARKRED = '#7e1f23'

export type Building = {
    left: number
    right: number
    top: number
}


export type Player = {
    x: number
    y: number
}

export type Camera = {
    x: number
    y: number
}



let i_player: PlayerInternals

function internalize_player() {
    let p = i_player
    let [x, y] = [p.i_x, p.i_y]
    player = { x, y }
}

let buildings: Building[]
let player: Player
let camera: Camera

export type PlayerInternals = {
    i_x: number
    i_y: number
    rem_x: number
    rem_y: number
    dx: number
    dy: number
    ddx: number
    ddy: number
    j_buffer: number
    is_grounded: boolean
    i_y0: boolean
    j_used: boolean
    j_cut: number
}

export function _init() {

    i_player = { 
        i_x: 20, 
        i_y: 40,
        rem_x: 0,
        rem_y: 0,
        dx: 0,
        dy: 0,
        ddx: 0,
        ddy: 0,
        j_buffer: 0,
        is_grounded: false,
        j_used: false,
        j_cut: 0,
        i_y0: false
    }

    internalize_player()
    camera = { x: player.x - 80, y: player.y - 55 }

    let initial_building = {
        left: player.x - 20,
        right: player.x + 40,
        top: player.y + 8
    }
    /*
    initial_building = {
        left: player.x - 2000,
        right: player.x + 4000,
        top: player.y + 8
    }
        */

    buildings = [initial_building]
}

export function _update(delta: number) {


    update_player(delta)
    internalize_player()

    gen_building()

    camera.x = lerp(camera.x, player.x - 80, 0.1)
    camera.y = lerp(camera.y, player.y - 55, 0.1)


    let left_visible_building = buildings.find(_ => _.right > camera.x && _.right < camera.x + 160)
    let full_visible_building = buildings.find(_ => _.left > camera.x && _.right < camera.x + 160)
    let right_visible_building = buildings.find(_ => _.left > camera.x && _.left < camera.x + 160)

    let covered_visible_building = buildings.find(_ => _.left < camera.x && _.right > camera.x + 160)

    let min_visible_building_top = 90

    if (covered_visible_building) {
        min_visible_building_top = Math.min(min_visible_building_top, covered_visible_building.top)
    }
    if (left_visible_building) {
        min_visible_building_top = Math.min(min_visible_building_top, left_visible_building.top)
    }
    if (right_visible_building) {
        min_visible_building_top = Math.min(min_visible_building_top, right_visible_building.top)
    }
    if (full_visible_building) {
        min_visible_building_top = Math.min(min_visible_building_top, full_visible_building.top)
    }

    if (player.y > min_visible_building_top + 50) {
        _init()
    }

    if (camera.y > min_visible_building_top - 40) {
        camera.y = min_visible_building_top - 40
    }


    i.update()
}

function update_player(delta: number) {

    let i_y0 = i_player.i_y0
    let i_y = false
    if (i.btn()) {
        i_y = true
    } else {
        i_y = false
        if (i_y0) {
            i_player.j_buffer = 100
            i_player.j_cut = 200
        }
    }

    i_player.j_buffer = appr(i_player.j_buffer, 0, delta)
    i_player.j_cut = appr(i_player.j_cut, 0, delta)

    i_player.i_y0 = i_y

    if (i_y || i_player.j_buffer > 0) {
        if (!i_player.j_used) {
            //console.log('jump', i_player.is_grounded)

            i_player.dy = -400
            i_player.ddy = 1000

            i_player.j_buffer = 0
            i_player.j_used = true
        }
    }

    if (i_player.is_grounded) {
        i_player.j_used = false
    }


    const max_deccel_dy = 200

    const max_accel_fall_dy = 200
    const max_fall_dy = 200
    if (i_player.j_cut > 0) {
        if (i_player.dy < 0) {
            i_player.ddy = 2888
            i_player.dy = appr(i_player.dy, 0, i_player.ddy * delta / 1000)
        } else {
            console.log(i_player.dy)
            i_player.ddy = 1000
            i_player.dy = appr(i_player.dy, max_fall_dy * 2, i_player.ddy * delta / 1000)
        }
    } else if (i_player.dy < 0) {
        i_player.ddy = appr(i_player.ddy, max_deccel_dy, 200 * delta / 1000)
        i_player.dy = appr(i_player.dy, 0, i_player.ddy * delta / 1000)
    } else {
        i_player.ddy = appr(i_player.ddy, max_accel_fall_dy, 200 * delta / 1000)
        i_player.dy = appr(i_player.dy, max_fall_dy, i_player.ddy * delta / 1000)
    }


    const max_accel_x1 = 20
    if (i_player.dx < 60) {

        let reach_max_accel_x1_speed = i_player.ddx > max_accel_x1 ? 200 : 100
        i_player.ddx = appr(i_player.ddx, max_accel_x1, reach_max_accel_x1_speed * delta / 1000)
        i_player.dx = appr(i_player.dx, 60, i_player.ddx * delta / 1000)
    }


    update_physics_player(delta)
}

function update_physics_player(delta: number) {

    let step_x = Math.sign(i_player.dx)
    let a = Math.abs(i_player.dx * delta / 1000 + i_player.rem_x)
    let t = Math.floor(a)

    i_player.rem_x = (a - t) * step_x

    for (let i = 0; i < t; i++) {
        i_player.i_x += step_x

        internalize_player()
        let p_box: XYWH = [player.x, player.y, 1, 8]
        if (player_has_collided(p_box)) {
            i_player.i_x -= step_x
            break
        }
    }

    let step_y = Math.sign(i_player.dy)
    let ay = Math.abs(i_player.dy * delta / 1000 + i_player.rem_y)
    let ty = Math.floor(a)

    i_player.rem_y = (ay - ty) * step_y

    internalize_player()
    let p_box: XYWH = [player.x, player.y + 1, 1, 8]
    i_player.is_grounded = !!player_has_collided(p_box)

    for (let i = 0; i < t; i++) {
        i_player.i_y += step_y
        internalize_player()
        let p_box: XYWH = [player.x, player.y, 1, 8]
        if (player_has_collided(p_box)) {
            i_player.i_y -= step_y
            i_player.is_grounded = true
            break
        }
        i_player.is_grounded = false
    }
}

export function _render(_alpha: number) {

    c.clear()
    c.rect(0, 0, 160, 90, PURPLE)

    c.set_transform(-camera.x, -camera.y)

    render_player(player)

    for (let b of buildings) {
        render_building(b)
    }

    c.reset_transform()
}

function render_player(player: Player) {
    c.rect(player.x, player.y, 1, 8, BLACK)
}

function render_building(b: Building) {
    c.rect(b.left, b.top, b.right - b.left, 90, RED)
}

function gen_building() {

    function new_building(left: number, width: number, top: number) {
        return {
            left,
            right: left + width,
            top
        }
    }

    let left = buildings[0]
    let right = buildings[buildings.length - 1]


    let x = player.x

    if (x - left.right < 90) {
        let width = 100
        let gap = 10
        let inc_top = rnd_sint(10, 12)
        let top = left.top + inc_top
        buildings.unshift(new_building(left.left - width - gap, width, top))
    } 
    
    if (right.left - x < 90) {
        let width = 100
        let gap = 10
        let inc_top = rnd_sint(10, 12)
        let top = right.top + inc_top
        buildings.push(new_building(right.right + gap, width, top))
    }
}

function player_has_collided(p_box: XYWH) {
    for (let b of buildings) {
        if (box_intersect(p_box, [b.left, b.top, b.right - b.left, 90])) {
            return b
        }
    }
    return false
}


type XYWH = [number, number, number, number]
function box_intersect(a: XYWH, b: XYWH) {
    let [ax, ay, aw, ah] = a
    let [bx, by, bw, bh] = b

    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}

/* UTIL */

export let level = 0

/* https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript */
const make_random = (seed = level) => {
  return () => {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }
}

type RNG = () => number

export const random = make_random()

export function rnd_h(rng: RNG = random) {
  return rng() * 2 - 1
}

export function rnd_int_h(max: number, rng: RNG = random) {
  return rnd_h(rng) * max
}

export function rnd_sign(rng: RNG = random) {
  return rng() < 0.5 ? -1 : 1  
}

export function rnd_sint(min: number, max: number, rng: RNG = random) {
    return rnd_sign(rng) * rnd_int(min, max, rng)
}

export function rnd_int(min: number, max: number, rng: RNG = random) {
    return Math.floor(rng() * (max - min) + min)
}

export function arr_rnd<A>(arr: Array<A>) {
  return arr[rnd_int(0, arr.length)]
}

export function arr_remove<A>(arr: Array<A>, a: A) {
  arr.splice(arr.indexOf(a), 1)
}

export function arr_shuffle<A>(array: Array<A>) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array
}


export function appr(value: number, target: number, by: number): number {
    if (value < target) {
        return Math.min(value + by, target)
    } else if (value > target) {
        return Math.max(value - by, target)
    }
    return value
}

export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
}

let i: TouchMouse
export function _set_el(el: HTMLElement) {
    i = TouchMouse(el)
}