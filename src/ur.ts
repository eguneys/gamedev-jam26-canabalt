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

export function _update(delta: number) {

    player.x += 1

    camera.x = lerp(camera.x, player.x - 80, 0.1)
    camera.y = lerp(camera.y, player.y - 55, 0.1)
}

export function _render(alpha: number) {

    c.clear()
    c.rect(0, 0, 160, 90, PURPLE)

    c.set_transform(-camera.x, camera.y)

    render_player(player)

    c.reset_transform()
}

function render_player(player: Player) {
    c.rect(player.x, player.y, 1, 8, BLACK)
}



function appr(value: number, target: number, by: number): number {
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

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
}