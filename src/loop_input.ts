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

export type TouchMouse = {
  btn: () => boolean
  update: () => void
}

export function TouchMouse(el: HTMLElement) {


  let is_jump = false

  function on_down() {
    is_jump = true
  }
  function on_up() {
    is_jump = false
  }
  
  function update() {}

  function btn() {
    return is_jump
  }

  el.addEventListener('touchstart', () => on_down(), { passive: false })
  el.addEventListener('mousedown', () => on_down(), { passive: false })
  document.addEventListener('touchend', () => on_up())
  document.addEventListener('mouseup', () => on_up())

  return {
    btn,
    update
  }
}