import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import CourseList from './CourseList.jsx'
import Description from './Description.jsx'
import SignUp from './SignUp.jsx'
import Login from './Login.jsx'
import { AuthProvider } from '../controller/authController'
import PaymentForm from './PaymentPage.jsx'
import LearningPage from './LearningPage.jsx'
import OverView from './OverView.jsx'
import Profile from './profile.jsx'
import CertificatePage from './certificatePage.jsx'

const router = createBrowserRouter(
  [
    {
      path:'/',
      element:<App/>
    },
    {
      path:'/CourseList',
      element:<CourseList/>
    },
    {
      path:'/Description',
      element:<Description/>
    },
    {
      path:'/Login',
      element:<Login/>
    },
    {
      path:'/SignUp',
      element:<SignUp/>
    },
    {
      path:'Description',
      element:<Description/>
    },
    {
      path : '/PaymentPage',
      element : <PaymentForm/>
    },
    {
       path:'/LearningPage',
       element:<LearningPage/>
    },
    {
      path:'OverView',
      element:<OverView/>
    },
    {
      path:'profile',
      element:<Profile/>
    },
    {
      path:'certificate',
      element:<CertificatePage/>
    },
    {
       path:"/learning/:courseId",
       element:<LearningPage />
    }
  ]
)

createRoot(document.getElementById('root')).render( 
  <AuthProvider>
    <RouterProvider router={router}/>
  </AuthProvider>
)
