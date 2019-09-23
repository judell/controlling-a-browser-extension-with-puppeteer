function proceedWithData(data) {
  chrome.runtime.sendMessage({
    action: 'proceedWithData',
    data: data
  })
}

function start() {
  const viewLinksButtonContainer = document.createElement('div')
  const vlbc = viewLinksButtonContainer
  vlbc.id = 'viewLinksButtonContainer'
  vlbc.style.position = 'fixed'
  vlbc.style.top = 0
  vlbc.style.left = 0
  vlbc.style.margin = 0
  vlbc.style.width = '2em'
  vlbc.style.height = '2em'
  vlbc.style.padding = 0
  vlbc.style.zIndex = 2147483647
  document.body.insertBefore(vlbc, document.body.firstChild)
  const shadow = vlbc.attachShadow({ mode: 'open' })
  shadow.innerHTML = '<button id="viewLinksButton">view link elements</button>'
  const button = shadow.getElementById('viewLinksButton')
  button.onclick = () => {
    gather()
  }
}

function gather() {
  const linkElements = document.querySelectorAll('head link')
  const linkObjects = []
  for (let i = 0; i < linkElements.length; i++) {
    let linkObject = {}
    let linkAttrs = Array.from(linkElements[i].attributes)
    for (let attr of linkAttrs) {
      linkObject[attr.name] = attr.value
    }
    linkObjects.push(linkObject)
  }
  const data = {
    url: location.href,
    linkData: linkObjects
  }
  proceedWithData(data)
}

start()
