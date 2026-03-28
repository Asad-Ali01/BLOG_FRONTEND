import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from 'next-themes'
import ErrorBoundary from './components/layouts/errorBoundary.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store,persistor } from './app/store.ts'
import { Toaster } from 'react-hot-toast'
import { PersistGate } from 'redux-persist/integration/react'
import 'antd/dist/reset.css'
createRoot(document.getElementById('root')!).render(
  <ErrorBoundary >
<BrowserRouter>
 <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>

    <App />
  </PersistGate>
    <Toaster position='top-right'/>
  </Provider>
  </ThemeProvider>
</BrowserRouter>
  </ErrorBoundary>
)
