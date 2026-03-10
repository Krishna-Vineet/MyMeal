import { BrowserRouter, Routes, Route } from "react-router-dom"

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

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Consumer routes */}
        <Route element={<ConsumerLayout />}>
          <Route path="/discover" element={<Discover />} />
          <Route path="/cooks" element={<Cooks />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Cook routes */}
        <Route element={<CookLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}