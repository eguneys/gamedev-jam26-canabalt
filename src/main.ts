import { Loop } from './loop_input'
import './style.css'
import { _set_el, _init, _render, _update } from './ur'
import { c } from './canvas'


function app(el: HTMLElement) {

  _set_el(el)
  _init()

  Loop(_update, _render)

  c.canvas.classList.add('pixelated')


  let content = document.createElement('div')
  content.classList.add('content')

  content.appendChild(c.canvas)
  el.appendChild(content)
}


app(document.querySelector('#app')!)