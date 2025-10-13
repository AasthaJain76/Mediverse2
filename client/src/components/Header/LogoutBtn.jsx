import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import { logout as logoutUser } from '../../services/authService';
import { toast } from 'react-toastify';

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logoutUser();           // 🔒 Backend logout
      dispatch(logout());           // ❌ Clear Redux state
      toast.success("Logged out successfully!");
      navigate("/login");     
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={logoutHandler}
      className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full shadow hover:bg-red-600 hover:shadow-md transition"
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
