import ReactDOM from "react-dom/client"
import './index.css'
import App from './App.jsx'


import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)



// neon ek command de rha h, wo run kren ya chatgpt ke according chalna h?