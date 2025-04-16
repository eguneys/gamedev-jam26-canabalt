type Canvas = {
  canvas: HTMLCanvasElement
  rect(x: number, y: number, w: number, h: number, color: Color): void
  clear(): void
  set_transform(x: number, y: number): void
  reset_transform(): void
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

    function set_transform(x: number, y: number) {
        ctx.setTransform(1, 0, 0, 1, x, y)
    }

    function reset_transform() {
        ctx.resetTransform()
    }

    return {
      canvas,
      clear,
      rect,
      set_transform,
      reset_transform
    }
}

export let c: Canvas = Canvas(160, 90)

