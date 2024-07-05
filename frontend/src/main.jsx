import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  BrowserRouter
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const settings = {
  autoClose: 3000,
  position: "top-center",
  transition: Slide
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ToastContainer {...settings} />
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
