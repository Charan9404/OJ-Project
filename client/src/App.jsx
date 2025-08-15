import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/Emailverify";
import ResetPassword from "./pages/ResetPassword";
import Problems from "./pages/Problems";
import Submissions from "./pages/Submissions";
import CodeEditorSpecial from "./pages/codeeditor-special"; // ← Add this import
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout";
import ProblemDetail from "./pages/ProblemDetail";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Routes with Navbar */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/problems"
          element={
            <Layout>
              <Problems />
            </Layout>
          }
        />
        <Route
          path="/problems/:id"
          element={
            <Layout>
              <ProblemDetail />
            </Layout>
          }
        />
        <Route
          path="/submissions"
          element={
            <Layout>
              <Submissions />
            </Layout>
          }
        />
        {/* ← Add the CodeEditor route */}
        <Route
          path="/codeeditor-special"
          element={
            <Layout>
              <CodeEditorSpecial />
            </Layout>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
