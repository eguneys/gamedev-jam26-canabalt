export function Loop(update: (dt: number) => void, render: (alpha: number) => void) {

  const timestep = 1000/60
  let last_time = performance.now()
  let accumulator = 0

  function step(current_time: number) {
    requestAnimationFrame(step)


    let delta_time = Math.min(current_time - last_time, 1000)
    last_time = current_time

    accumulator += delta_time

    while (accumulator >= timestep) {
      update(timestep)
      accumulator -= timestep
    }

    render(accumulator / timestep)
  }
  requestAnimationFrame(step)
}

type Action = 'left' | 'right' | 'up' | 'jump' | 'shoot'

type PressState = 'just' | boolean

export type Input = {
  btn(action: Action): PressState
  btnp(action: Action): PressState
  update(): void
}

export function Input() {

  let downs: Record<Action, PressState> = { shoot: false, left: false, right: false, up: false, jump: false }

  function on_down(action: Action) {
    downs[action] = 'just'
  }

  function on_up(action: Action) {
    downs[action] = false
  }

  function btn(action: Action) {
    return downs[action] !== false
  }

  function btnp(action: Action) {
    return downs[action] === 'just'
  }

  function update() {
    for (let key of Object.keys(downs)) {
      if (downs[key as Action] === 'just') {
        downs[key as Action] = true
      }
    }
  }

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
        on_down('left')
        break
      case 'ArrowRight':
      case 'd':
        on_down('right')
        break
      case 'w':
      case 'ArrowUp':
        on_down('up')
        break
      case 'u':
      case 'x':
      case ' ':
        on_down('jump')
        break
      case 'c':
      case 'j':
        on_down('shoot')
        break
      default:
        return
    }
    e.preventDefault()
    e.stopImmediatePropagation()
    e.stopPropagation()
  })
  document.addEventListener('keyup', (e) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
        on_up('left')
        break
      case 'ArrowRight':
      case 'd':
        on_up('right')
        break
      case 'w':
      case 'ArrowUp':
        on_up('up')
        break
      case 'u':
      case 'x':
      case ' ':
        on_up('jump')
        break
      case 'c':
      case 'j':
      case ' ':
        on_up('shoot')
        break
      default:
        return
    }
    e.preventDefault()

    e.stopImmediatePropagation()
    e.stopPropagation()
  })

  return {
    btn,
    btnp,
    update
  }
}
