import './App.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes/routes'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useEffect, useState } from 'react'
// import { requestPermission, onMessageListener } from './firebase';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generalData } from './lib/helper/dynamicData'


function App() {
  const queryClient = new QueryClient()
  const [message, setmessage] = useState('')


  useEffect(() => {
    document.title = generalData?.name || "Sonbola";
  }, [generalData?.name]); // This effect runs whenever generalData.name changes


  return (
    <QueryClientProvider client={queryClient} >
      <ToastContainer
        autoClose={4000}
        position="bottom-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <main>
        <RouterProvider router={routes} />
      </main>
    </QueryClientProvider>
  )
}

export default App
