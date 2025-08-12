import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { Web3AuthProvider } from "@web3auth/modal/react";
import web3AuthContextConfig from "./config/web3auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Web3AuthProvider config={web3AuthContextConfig}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </Web3AuthProvider>
);
