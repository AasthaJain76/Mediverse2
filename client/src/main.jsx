import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home.jsx'
import { AuthLayout} from './components/index.js'


import AddPost from "./pages/AddPost";
import Signup from './pages/SignUp'
import EditPost from "./pages/EditPost";
import Login from './pages/Login'
import Post from "./pages/Post";

import AllPosts from "./pages/AllPosts";
import Profile from "./pages/Profile"
import CurrentUserProfile from "./pages/CurrentUserProfile"
import Forum from './pages/Forum.jsx'
import PostThread from './pages/PostThread.jsx'
import ThreadView from './pages/ThreadView.jsx'
import Features from './pages/Features.jsx'
import Contests from './pages/Contests.jsx'
import RoadmapGenerator from './pages/RoadmapGenerator.jsx'
import MyRoadmaps from './pages/MyRoadmaps.jsx'
import RoadmapDetail from './pages/RoadmapDetail.jsx' // create this page
import ResumeAnalyzer from './pages/ResumeAnalyzer.jsx'
import ResumeResult from './pages/ResumeResult.jsx'
import Contact from './pages/Contact.jsx'
import About from './pages/About.jsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: (
                    <AuthLayout authentication={false}>
                        <Login />
                    </AuthLayout>
                ),
            },
            {
                path: "/login",
                element: (
                    <AuthLayout authentication={false}>
                        <Login />
                    </AuthLayout>
                ),
            },
            {
                path: "/home",
                element: (
                    <AuthLayout authentication>
                        <Home />
                    </AuthLayout>
                ),
            },
            {
                path: "/contact",
                element: (
                    <AuthLayout authentication>
                        <Contact />
                    </AuthLayout>
                ),
            },
            {
                path: "/about",
                element: (
                    <AuthLayout authentication>
                        <About />
                    </AuthLayout>
                ),
            },
            {
                path: "/signup",
                element: (
                    <AuthLayout authentication={false}>
                        <Signup />
                    </AuthLayout>
                ),
            },
            {
                path: "/all-posts",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <AllPosts />
                    </AuthLayout>
                ),
            },
            {
                path: "/add-post",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <AddPost />
                    </AuthLayout>
                ),
            },
            {
                path: "/edit-post/:slug",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <EditPost />
                    </AuthLayout>
                ),
            },
            {
                path: "/posts/:slug",
                element: <Post />,
            },
            {
                path: "/profile/:userId",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <Profile />
                    </AuthLayout>
                ),
            },
            {
                path: "/profile",
                element: (
                    <AuthLayout authentication>
                        <CurrentUserProfile />
                    </AuthLayout>
                ),
            },
            {
                path: "/features",
                element: (
                    <AuthLayout authentication>
                        <Features />
                    </AuthLayout>
                ),
            },
            {
                path: "/forum",
                element: (
                    <AuthLayout authentication>
                        <Forum />
                    </AuthLayout>
                ),
            },
            {
                path: "/post-thread",
                element: (
                    <AuthLayout authentication>
                        <PostThread />
                    </AuthLayout>
                ),
            },
            {
                path: "/forum/:threadId",
                element: (
                    <AuthLayout authentication>
                        <ThreadView />
                    </AuthLayout>
                ),
            },
            {
                path: "/contests",
                element: (
                    <AuthLayout authentication>
                        <Contests />
                    </AuthLayout>
                ),
            },
            {
                path: "/generate",
                element: (
                    <AuthLayout authentication>
                        <RoadmapGenerator />
                    </AuthLayout>
                ),
            },
            {
                path: "/my-roadmaps",
                element: (
                    <AuthLayout authentication>
                        <MyRoadmaps />
                    </AuthLayout>
                ),
            },
            {
                path: "/roadmap/:id",
                element: (
                    <AuthLayout authentication>
                        <RoadmapDetail />
                    </AuthLayout>
                ),
            },
            {
                path: "/resume-analyze",
                element: (
                    <AuthLayout authentication>
                        <ResumeAnalyzer />
                    </AuthLayout>
                ),
            },
            {
                path: "/resume-result",
                element: (
                    <AuthLayout authentication>
                        <ResumeResult />
                    </AuthLayout>
                ),
            },
        ],
    },
])


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>,
)