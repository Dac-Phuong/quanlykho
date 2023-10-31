import { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { getUserData } from './admin/utils/function'
import Login from './admin/page/auth/Login'
import Header from './layouts/Header'
import Sidebar from './layouts/Sidebar'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import appRoutes from './config/routes'

function App() {
    const navigate = useNavigate()
    useEffect(() => {
        const getData = () => {
            const userData = getUserData()
            if (userData?.token == null) {
                navigate('/login')
            }
        }
        getData()
    }, [navigate])

    return (
        <>
            <Routes>
                <Route index path='/login' element={<Login />} />
                <Route
                    path='*'
                    element={
                        <>
                            <div id='pcoded' className='pcoded'>
                                <div className='pcoded-overlay-box' />
                                <div className='pcoded-container navbar-wrapper'>
                                    <Header />
                                    <Sidebar />
                                    <div className='pcoded-main-container'>
                                        <div className='pcoded-wrapper'>
                                            <Routes>
                                                {appRoutes.map(({ path, Component }) => (
                                                    <Route key={path} path={path} element={<Component />} />
                                                ))}
                                            </Routes>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                ></Route>
            </Routes>

            <ToastContainer />
        </>
    )
}

export default App
