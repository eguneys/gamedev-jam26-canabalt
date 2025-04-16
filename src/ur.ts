import { c } from './canvas'

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

let buildings: Building[]
let player: Player
let camera: Camera

export function _init() {
    player = { x: 20, y: 40 }
    camera = { x: player.x - 80, y: player.y - 55 }

    const initial_building = {
        left: player.x - 20,
        right: player.x + 40,
        top: player.y + 8
    }

    buildings = [initial_building]
}

export function _update(_delta: number) {



    let step_x = 1

    player.x += step_x
    if (player_has_collided()) {
        player.x -= step_x
    }

    let step_y = 1

    player.y += step_y
    if (player_has_collided()) {
        player.y -= step_y
    }

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

function player_has_collided() {

    let p_box: XYWH = [player.x, player.y, 1, 8]
    for (let b of buildings) {
        if (box_intersect(p_box, [b.left, b.top, b.right - b.left, 90])) {
            return true
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
        value += by
        if (value > target) {
            value = target
        }
    } else if (value > target) {
        value -= by
        if (value < target) {
            value = target
        }
    }
    return value
}

export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
}