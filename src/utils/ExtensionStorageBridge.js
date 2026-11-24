function getLocalStorageSnapshot() {
  return Object.fromEntries(
    Array.from({ length: localStorage.length }, (_, index) => {
      const key = localStorage.key(index)
      return [key, localStorage.getItem(key)]
    }).filter(([key, value]) => key !== null && value !== null),
  )
}

function applyStorageSnapshot(data) {
  const storage = window.localStorage
  const originalSetItem = Storage.prototype.setItem
  const originalClear = Storage.prototype.clear

  originalClear.call(storage)
  for (const [key, value] of Object.entries(data)) {
    originalSetItem.call(storage, key, value)
  }
}

function createRequestId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function initializeExtensionStorageBridge() {
  const extensionId = new URLSearchParams(window.location.search).get(
    'extensionId',
  )
  if (!extensionId || !/^[a-p]{32}$/.test(extensionId)) {
    return Promise.resolve()
  }

  const extensionOrigin = `chrome-extension://${extensionId}`
  const requestId = createRequestId()

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      window.removeEventListener('message', onMessage)
      reject(new Error('Timed out waiting for extension storage.'))
    }, 10000)

    function finish(error) {
      window.clearTimeout(timeout)
      window.removeEventListener('message', onMessage)
      if (error) reject(error)
      else resolve()
    }

    function persist(message) {
      window.parent.postMessage(
        { ...message, requestId: message.requestId || createRequestId() },
        extensionOrigin,
      )
    }

    function onMessage(event) {
      if (event.source !== window.parent || event.origin !== extensionOrigin) {
        return
      }

      const message = event.data
      if (!message || typeof message !== 'object') return

      if (message.type === 'storage:error') {
        if (message.requestId === requestId) {
          finish(new Error(message.error || 'Extension storage failed.'))
        } else {
          console.error('Failed to save extension data:', message.error)
        }
        return
      }

      if (
        message.type === 'storage:hydrate' &&
        message.requestId === requestId
      ) {
        if (message.initialized) {
          applyStorageSnapshot(message.data)
          installStorageMirroring(persist)
          finish()
        } else {
          persist({
            type: 'storage:initialize',
            requestId,
            data: getLocalStorageSnapshot(),
          })
        }
        return
      }

      if (
        message.type === 'storage:result' &&
        message.requestId === requestId
      ) {
        applyStorageSnapshot(message.data)
        installStorageMirroring(persist)
        finish()
      }
    }

    window.addEventListener('message', onMessage)
    window.parent.postMessage(
      { type: 'storage:ready', requestId },
      extensionOrigin,
    )
  })
}

function installStorageMirroring(persist) {
  const originalSetItem = Storage.prototype.setItem
  const originalRemoveItem = Storage.prototype.removeItem
  const originalClear = Storage.prototype.clear
  const extensionId = new URLSearchParams(window.location.search).get(
    'extensionId',
  )

  Storage.prototype.setItem = function (key, value) {
    originalSetItem.call(this, key, value)
    if (this === window.localStorage) {
      persist({
        type: 'storage:set',
        key: String(key),
        value: String(value),
      })
    }
  }

  Storage.prototype.removeItem = function (key) {
    originalRemoveItem.call(this, key)
    if (this === window.localStorage) {
      persist({ type: 'storage:remove', key: String(key) })
    }
  }

  Storage.prototype.clear = function () {
    originalClear.call(this)
    if (this === window.localStorage) {
      persist({ type: 'storage:clear' })
    }
  }

  window.addEventListener('message', (event) => {
    if (
      event.source === window.parent &&
      event.origin === `chrome-extension://${extensionId}` &&
      event.data?.type === 'storage:error'
    ) {
      console.error('Failed to save extension data:', event.data.error)
    }
  })
}
