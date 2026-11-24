const WEB_URL = 'https://tunglam7554.github.io/homepage-countdown/'
const WEB_ORIGIN = new URL(WEB_URL).origin

const iframe = document.createElement('iframe')
iframe.src = `${WEB_URL}?extensionId=${encodeURIComponent(chrome.runtime.id)}`
document.body.appendChild(iframe)

function sendToExtension(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      const runtimeError = chrome.runtime.lastError
      if (runtimeError) {
        reject(new Error(runtimeError.message))
      } else if (response && response.error) {
        reject(new Error(response.error))
      } else {
        resolve(response)
      }
    })
  })
}

function reply(message) {
  iframe.contentWindow.postMessage(message, WEB_ORIGIN)
}

window.addEventListener('message', async (event) => {
  if (event.source !== iframe.contentWindow || event.origin !== WEB_ORIGIN) {
    return
  }

  const message = event.data
  if (!message || typeof message !== 'object') return

  try {
    if (message.type === 'storage:ready') {
      const result = await sendToExtension({ type: 'storage:get' })
      reply({
        type: 'storage:hydrate',
        requestId: message.requestId,
        initialized: result.initialized,
        data: result.data,
      })
      return
    }

    const typeMap = {
      'storage:initialize': 'storage:initialize',
      'storage:set': 'storage:set',
      'storage:remove': 'storage:remove',
      'storage:clear': 'storage:clear',
    }
    const extensionMessageType = typeMap[message.type]
    if (!extensionMessageType) return

    const result = await sendToExtension({
      ...message,
      type: extensionMessageType,
    })
    reply({
      type: 'storage:result',
      requestId: message.requestId,
      data: result && result.data,
    })
  } catch (error) {
    reply({
      type: 'storage:error',
      requestId: message.requestId,
      error: error.message,
    })
  }
})
