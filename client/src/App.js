import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react'
import User from './pages/User'
import UserPage from './pages/UserPage'

import EditPage from "./pages/EditPage";
import CreateUserPage from "./pages/CreateUserPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserPage />} />
        <Route path="/edit-profile/:id" element={<EditPage />} />
        <Route path="/create-profile" element={<CreateUserPage />} />
      </Routes>
    </Router>
  )
}

export default App