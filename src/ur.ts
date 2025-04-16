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
    buildings = []
}

export function _update(_delta: number) {

    player.x += 1

    gen_building()

    camera.x = lerp(camera.x, player.x - 80, 0.1)
    camera.y = lerp(camera.y, player.y - 55, 0.1)
}

export function _render(_alpha: number) {

    c.clear()
    c.rect(0, 0, 160, 90, PURPLE)

    c.set_transform(-camera.x, camera.y)

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
        let inc_top = rnd_sint(10, 20)
        let top = left.top + inc_top
        buildings.unshift(new_building(left.right - width - gap, width, top))
    } else if (right.left < 90) {
        let width = 100
        let gap = 10
        let inc_top = rnd_sint(10, 20)
        let top = right.top + inc_top
        buildings.push(new_building(right.left + gap, width, top))
    }
}


/* UTIL */

export let level = 0

export function rnd(seed: number = level) {
    let x = Math.sin(seed) * 10000
    return x - Math.floor(x)
}

export function rnd_sign(seed: number = level) {
    return rnd(seed) < 0.5 ? 1 : -1
}

export function rnd_int(min: number, max: number, seed: number = level) {
    return Math.floor(rnd(seed) * (max - min + 1)) + min
}

export function rnd_sint(min: number, max: number, seed: number = level) {
    return rnd_sign(seed) * rnd_int(min, max, seed)
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