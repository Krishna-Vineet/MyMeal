import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import PublicLayout from "../layouts/PublicLayout"
import ConsumerLayout from "../layouts/ConsumerLayout"
import CookLayout from "../layouts/CookLayout"

import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Discover from "../pages/Discover"
import Cooks from "../pages/Cooks"
import Subscribe from "../pages/Subscribe"
import Orders from "../pages/Orders"
import Settings from "../pages/Settings"
import Profile from "../pages/Profile"
import NotFound from "../pages/NotFound"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/cooks" element={<Cooks />} />
        </Route>

        <Route element={<ConsumerLayout />}>
          <Route path="/app" element={<Navigate to="/app/orders" replace />} />
          <Route path="/app/discover" element={<Discover />} />
          <Route path="/app/cooks" element={<Cooks />} />
          <Route path="/app/subscribe" element={<Subscribe />} />
          <Route path="/app/orders" element={<Orders />} />
          <Route path="/app/settings" element={<Settings />} />
        </Route>

        <Route element={<CookLayout />}>
          <Route path="/cook" element={<Navigate to="/cook/profile" replace />} />
          <Route path="/cook/profile" element={<Profile />} />
          <Route path="/cook/orders" element={<Orders />} />
          <Route path="/cook/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
