import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App/index.jsx'
import { AppContainer } from './styles.jsx'


createRoot(document.getElementById('root')).render(
    <AppContainer>
    <App />
    </AppContainer>
)
