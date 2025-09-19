// Client/routes/clientRoutes.jsx (cập nhật)
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../../routes/PrivateRoute";
import PublicRoute from "../../routes/PublicRoute";

// Layout
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";

// Pages
import Home from "../pages/Home/Home";
import Flashcard from "../pages/Flashcard/Flashcard";
import Blog from "../pages/Blog/Blog";
import Instructor from "../pages/Instructor/Instructor";
import InstructorDetail from "../pages/Instructor/InstructorDetail";

// Auth Pages
import Login from "../../Client/pages/Auth/Login/Login";
import Register from "../../Client/pages/Auth/Register/Register";
import Course from "../pages/Course/Course";
import CoursePreview from "../pages/Course/CoursePreview/CoursePreview";
import CourseDetail from "../pages/Course/CourseDetail/CourseDetail";
import Profile from "../pages/ProfileV2/index";

// Exam Pages
import ExamList from "../pages/Exam/ExamList/ExamList";
import ExamDetail from "../pages/Exam/ExamDetail/ExamDetail";
import ExamTaking from "../pages/Exam/ExamTaking/ExamTaking";
import ExamResult from "../pages/Exam/ExamResult/ExamResult";

const ClientLayout = ({ children }) => (
  <div className="client-layout">
    //
    <Header />
    <main className="client-main">{children}</main>
    <Footer />
  </div>
);

const ClientRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES - Không cần đăng nhập */}

      {/* Home Route - Luôn có thể truy cập */}
      <Route
        path="/"
        element={
          <ClientLayout>
            <Home />
          </ClientLayout>
        }
      />

      {/* Auth Routes - Login & Register với Header/Footer */}
      <Route
        path="/login"
        element={
          <PublicRoute restricted={true}>
            <ClientLayout>
              <Login />
            </ClientLayout>
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute restricted={true}>
            <ClientLayout>
              <Register />
            </ClientLayout>
          </PublicRoute>
        }
      />

      {/* PRIVATE ROUTES - Cần đăng nhập client */}

      {/* Flashcard Routes */}
      <Route
        path="/flashcard"
        element={
          <PrivateRoute requiredRole="client">
            <ClientLayout>
              <Flashcard />
            </ClientLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/flashcard/topic/:topicId"
        element={
          <PrivateRoute requiredRole="client">
            <ClientLayout>
              <Flashcard />
            </ClientLayout>
          </PrivateRoute>
        }
      />

      {/* Blog Route */}
      <Route
        path="/blog"
        element={
          <PrivateRoute requiredRole="client">
            <ClientLayout>
              <Blog />
            </ClientLayout>
          </PrivateRoute>
        }
      />

      {/* Instructor Route */}
      <Route
        path="/instructor"
        element={
          <ClientLayout>
            <Instructor />
          </ClientLayout>
        }
      />

      {/* Instructor Detail Route */}
      <Route
        path="/instructor/:id"
        element={
          <ClientLayout>
            <InstructorDetail />
          </ClientLayout>
        }
      />

      <Route
        path="/course"
        element={
          <PrivateRoute>
            <ClientLayout>
              <Course />
            </ClientLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/course/1"
        element={
          <PrivateRoute>
            <ClientLayout>
              <CoursePreview />
            </ClientLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/courses/:id/learn"
        element={
          <PrivateRoute>
            <ClientLayout>
              <CourseDetail />
            </ClientLayout>
          </PrivateRoute>
        }
      />

      {/* Profile Route */}
      <Route
        path="/profile"
        element={
          <PrivateRoute requiredRole="client">
            <ClientLayout>
              <Profile />
            </ClientLayout>
          </PrivateRoute>
        }
      />

      {/* Exam Routes */}
      <Route
        path="/exam"
        element={
          <PrivateRoute requiredRole="client">
            <ClientLayout>
              <ExamList />
            </ClientLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/exam/:id"
        element={
          <PrivateRoute requiredRole="client">
            <ClientLayout>
              <ExamDetail />
            </ClientLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/exam/:id/detail"
        element={
          <PrivateRoute requiredRole="client">
            <ClientLayout>
              <ExamDetail />
            </ClientLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/exam/:id/take"
        element={
          <PrivateRoute requiredRole="client">
            <ExamTaking />
          </PrivateRoute>
        }
      />

      <Route
        path="/exam/:id/result"
        element={
          <PrivateRoute requiredRole="client">
            <ClientLayout>
              <ExamResult />
            </ClientLayout>
          </PrivateRoute>
        }
      />


      {/* Catch all - Redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default ClientRoutes;
