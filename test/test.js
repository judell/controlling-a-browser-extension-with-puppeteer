const puppeteer = require('puppeteer')

const fs = require('fs')

const secondsForExtensionToLoad = 1

const CRX_PATH = '/users/jon/onedrive/controlling-a-browser-extension-with-puppeteer/browser-extension'

// in this environment some things need to pause
async function waitSeconds(seconds) {
  function delay(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
  }
  await delay(seconds)
}

// create a puppeteer object 
async function setup() {
  let browser = await puppeteer.launch({
    headless: false, // remain interactive
    args: [
      `--disable-extensions-except=${CRX_PATH}`,
      `--load-extension=${CRX_PATH}`
      // '--enable-devtools-experiments' # useful for sniffing the chrome devtools protocol
    ]
  })
  await waitSeconds(secondsForExtensionToLoad) // give extension time to load
  return browser
}

const urls = [
  'https://www.amazon.com',
  'https://example.com',
  'https://gov.uk',
  'https://loc.gov',
  'https://twitter.com',
  'https://wikipedia.org'
]

const allResults = []

async function main() {
  let browser = await setup() // acquire puppeteer browser object
  for (let url of urls) {
    let pages = await browser.pages() // get list of tabs
    let targetPage = pages[0] // initially the default empty tab
    await targetPage.goto(url) // load the url
    await waitSeconds(2) // let it breathe
    await targetPage.evaluate(() => {
      // this block runs in the browser
      const vlbc = document.getElementById('viewLinksButtonContainer')
      const shadow = vlbc.shadowRoot
      const button = shadow.querySelector('button')
      button.click()
    })
    await waitSeconds(2) // let it breathe
    pages = await browser.pages()
    let viewPage = pages[1] // go to the 2nd tab opened by the button click
    const message = new Date().toISOString() // make arbitrary input
    const results = await viewPage.evaluate((message) => {
      // this blocks run in the browser's 2nd tab
      const data = JSON.parse(document.querySelector('pre').innerText) // rehydrate the data
      const doneContainerRoot = document.getElementById('doneButtonContainer').shadowRoot
      const button = doneContainerRoot.querySelector('button')
      const input = doneContainerRoot.querySelector('input')
      input.value = message // satisfy the input requirement
      button.click()
      return Promise.resolve(data) // send data back to puppeteer
    }, message) // you have to put 'message' at the end too
    allResults.push(results)
  }
  fs.writeFile('test.json', JSON.stringify(allResults, null, 2), (err) => {
    if (err) throw err
  }) // save accumulated results
  await browser.close() // all done
}

main()
