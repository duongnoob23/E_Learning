// Main App Component
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import AppRoutes from './routes/routes'

// Import global styles
import './assets/styles/reset.css'
import './assets/styles/global.css'
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </Provider>
  )
}

export default App
