import { Loop } from './loop_input'
import './style.css'
import { _render, _update } from './ur'

type Canvas = {
  canvas: HTMLCanvasElement
  rect(x: number, y: number, w: number, h: number, color: Color): void
  clear(): void
}

type Color = string

function Canvas(width: number, height: number): Canvas {

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!
    ctx.imageSmoothingEnabled = false

    function rect(x: number, y: number, width: number, height: number, color: Color) {
        ctx.fillStyle = color
        ctx.fillRect(x, y, width, height)
    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    return {
      canvas,
      clear,
      rect
    }
}

export let c: Canvas


function app(el: HTMLElement) {

  c = Canvas(160, 90)

  Loop(_update, _render)

  c.canvas.classList.add('pixelated')


  let content = document.createElement('div')
  content.classList.add('content')

  content.appendChild(c.canvas)
  el.appendChild(content)
}


app(document.querySelector('#app')!)