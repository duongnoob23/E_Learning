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
import Flashcard from "./Client/pages/Flashcard/Flashcard";

function App() {
  return (
    <Provider store={store}>
      <QueryProvider>
        <Router>
          <div className="App">
            {/* <AppRoutes /> */}
            <Flashcard />
          </div>
        </Router>
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
