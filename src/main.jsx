import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import dummyData from './data.json'

// Setup router menggunakan Data API approach sesuai instruksi
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // Fungsi loader untuk mensimulasikan data fetching
    loader: () => {
      return dummyData;
    }
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)