const STORAGE_PREFIX = 'homepageCountdown:'
const DATA_PREFIX = `${STORAGE_PREFIX}data:`
const INITIALIZED_KEY = `${STORAGE_PREFIX}meta:initialized`

function isValidData(data) {
  return (
    data !== null &&
    typeof data === 'object' &&
    !Array.isArray(data) &&
    Object.entries(data).every(
      ([key, value]) =>
        key.length > 0 &&
        key.length <= 256 &&
        typeof value === 'string',
    )
  )
}

async function getData() {
  const stored = await chrome.storage.local.get(null)
  const data = Object.create(null)

  for (const [key, value] of Object.entries(stored)) {
    if (key.startsWith(DATA_PREFIX)) {
      data[key.slice(DATA_PREFIX.length)] = value
    }
  }

  return {
    initialized: stored[INITIALIZED_KEY] === true,
    data,
  }
}

async function handleMessage(message) {
  if (!message || typeof message !== 'object') {
    throw new Error('Invalid storage request.')
  }

  if (message.type === 'storage:get') {
    return getData()
  }

  if (message.type === 'storage:initialize') {
    if (!isValidData(message.data)) {
      throw new Error('Invalid initial storage data.')
    }

    const existing = await getData()
    if (existing.initialized) return existing

    const entries = Object.fromEntries(
      Object.entries(message.data).map(([key, value]) => [
        `${DATA_PREFIX}${key}`,
        value,
      ]),
    )
    await chrome.storage.local.set({
      ...entries,
      [INITIALIZED_KEY]: true,
    })
    return { initialized: true, data: message.data }
  }

  if (message.type === 'storage:set') {
    if (
      typeof message.key !== 'string' ||
      message.key.length === 0 ||
      message.key.length > 256 ||
      typeof message.value !== 'string'
    ) {
      throw new Error('Invalid storage value.')
    }

    await chrome.storage.local.set({
      [`${DATA_PREFIX}${message.key}`]: message.value,
      [INITIALIZED_KEY]: true,
    })
    return {}
  }

  if (message.type === 'storage:remove') {
    if (
      typeof message.key !== 'string' ||
      message.key.length === 0 ||
      message.key.length > 256
    ) {
      throw new Error('Invalid storage key.')
    }

    await chrome.storage.local.remove(`${DATA_PREFIX}${message.key}`)
    return {}
  }

  if (message.type === 'storage:clear') {
    const stored = await chrome.storage.local.get(null)
    const keys = Object.keys(stored).filter((key) =>
      key.startsWith(STORAGE_PREFIX),
    )
    await chrome.storage.local.remove(keys)
    return {}
  }

  throw new Error('Unknown storage request.')
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!sender.url) return false

  const senderUrl = new URL(sender.url)
  const extensionPageUrl = new URL(chrome.runtime.getURL('newtab.html'))
  if (
    senderUrl.origin !== extensionPageUrl.origin ||
    senderUrl.pathname !== extensionPageUrl.pathname
  ) {
    return false
  }

  handleMessage(message)
    .then(sendResponse)
    .catch((error) => sendResponse({ error: error.message }))

  return true
})
