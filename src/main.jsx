import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initializeExtensionStorageBridge } from './utils/ExtensionStorageBridge.js'

const root = createRoot(document.getElementById('root'))

initializeExtensionStorageBridge()
    .then(() => root.render(<App />))
    .catch((error) => {
        console.error('Failed to initialize extension storage:', error)
        document.getElementById('root').textContent =
            'Could not load extension data. Please reload the new tab.'
    })
