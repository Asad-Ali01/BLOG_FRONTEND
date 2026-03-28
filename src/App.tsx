import "./App.css";
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layouts/mainLayout";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import { GlobalLoader } from "./components/ui/GlobalLoader";
import { Spin } from "antd";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/LoginPage"));
const Register = lazy(() => import("./pages/RegisterPage"));
const CreateBlog = lazy(() => import("./pages/CreateBlog"));
const MyBlogs = lazy(() => import("./pages/MyBlogs"));
const EditBlog = lazy(() => import("./pages/EditBlog"));
const AdminBlogPage = lazy(() => import("./pages/AdminBlogPage"));
const AdminUserPage = lazy(() => import("./pages/AdminUserPage"));

function App() {
  return (
    <>
    <GlobalLoader/>
    <Suspense fallback={<div className="h-screen grid place-items-center">
    <Spin size="large"/>
  </div>}>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/my-blogs" element={<MyBlogs />} />
          <Route path="/edit-blog/:id" element={<EditBlog />} />
          <Route element={<AdminRoute/>}>
          <Route path="/manage-blogs" element={<AdminBlogPage />} />
          <Route path="/manage-users" element={<AdminUserPage />} />
          </Route>
          
        </Route>
      </Route>
    </Routes>
    </Suspense>
    </>
  );
}

export default App;
