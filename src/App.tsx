import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Home from "./pages/Home"
import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import AppLayout from "./components/AppLayout"
import Posts from "./pages/Posts"
import UserPosts from "./pages/UserPosts"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AccountSettings from "./pages/AccountSettings"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"


const queryClient = new QueryClient()
function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/posts/:id" element={<Posts />} />
                <Route path="/users/:user_id/posts" element={<UserPosts />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<AccountSettings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
