import React from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

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
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <Container>
        <nav className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/">
              <Logo width="70px" />
            </Link>
          </div>

          {/* Nav Items */}
          <ul className="flex items-center space-x-4">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition"
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}

            {/* Logout */}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header
