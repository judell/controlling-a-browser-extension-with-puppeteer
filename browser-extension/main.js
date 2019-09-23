const url = new URL(location.href)
const searchParams = new URLSearchParams(url.search)
const params = Array.from(searchParams)
const data = JSON.parse(params[0][1]) // acquire data passed to main.html
document.getElementById('data').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`
const doneButtonContainer = document.getElementById('doneButtonContainer')
const shadow = doneButtonContainer.attachShadow({ mode: 'open' })
shadow.innerHTML = '<button>done</button> <input></input>' // render the done button
shadowRoot = shadow.getRootNode()
const button = shadowRoot.querySelector('button')
const input = shadowRoot.querySelector('input')
button.onclick = () => {
  if (!input.value) {
    alert('input required') // require input
  } else {
    window.close() 
  }
}
