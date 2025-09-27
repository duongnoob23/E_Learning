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
import Lesson from "./Client/pages/Lesson/Lesson.jsx";

function App() {
  return (
    <Provider store={store}>
      <QueryProvider>
        <Router>
          {/* <div className="App">
            <AppRoutes />
          </div> */}
          <Lesson />
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
