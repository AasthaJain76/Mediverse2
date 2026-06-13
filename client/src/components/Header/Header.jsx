import React, { useState } from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { name: 'Home', slug: "/home", active: authStatus }, 
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
    { name: "Profile", slug: "/profile", active: authStatus },
    { name: "Features", slug: "/features", active: authStatus }
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100/80 shadow-sm">
      <Container>
        <nav className="flex items-center justify-between py-2">
          
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-90 transition">
            <Logo width="70px" />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-2">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 rounded-full hover:bg-indigo-50/50 hover:text-indigo-600 transition duration-300"
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && <LogoutBtn />}
          </ul>

          {/* Hamburger Button */}
          <button
            className="md:hidden text-2xl p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-full transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute left-4 right-4 mt-1 bg-white/95 backdrop-blur-lg border border-gray-100 shadow-2xl rounded-2xl p-4 transition duration-300">
            <ul className="flex flex-col gap-2">
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name}>
                    <button
                      onClick={() => {
                        navigate(item.slug)
                        setMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-600 rounded-xl hover:bg-indigo-50/60 hover:text-indigo-600 transition"
                    >
                      {item.name}
                    </button>
                  </li>
                ) : null
              )}
              {authStatus && (
                <li onClick={() => setMenuOpen(false)} className="pt-2 border-t border-gray-100">
                  <LogoutBtn />
                </li>
              )}
            </ul>
          </div>
        )}
      </Container>
    </header>
  )
}

export default Header