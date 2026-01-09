// Main App Component
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./assets/styles/global.css"; // CSS tùy chỉnh
import { QueryProvider } from "./providers/QueryProvider";
import { store } from "./redux/store";
// Import global styles
import "./App.css";
import "./assets/styles/global.css";
import "./assets/styles/reset.css";
import { queryClient } from "./lib/queryClient";
import AppRoutes from "./routes/routes";
import { DictionaryProvider } from "./Client/components/Dictionary/DictionaryContext";
import FloatingDictionaryButton from "./Client/components/Dictionary/FloatingDictionaryButton";
import Dictionary from "./Client/components/Dictionary/Dictionary";

function App() {
  return (
    <Provider store={store}>
      <QueryProvider queryClient={queryClient}>
        <DictionaryProvider>
          <Router>
            <div className="App">
              <AppRoutes />
              {/* <Lesson /> */}
            </div>
          </Router>

          {/* Floating Dictionary Button */}
          <FloatingDictionaryButton />
          
          {/* Dictionary Component */}
          <Dictionary />
        </DictionaryProvider>
      </QueryProvider>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Provider>
  );
}

export default App;
