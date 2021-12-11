import { render } from 'preact'
import App from './app'
import './index.css'
import 'virtual:windi.css'
import { AuthProvider } from './authContext';

render(
    <AuthProvider>
    <App />
    </AuthProvider>
, document.getElementById('app'))
