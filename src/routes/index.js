// All components mapping with path for internal routes

import { lazy } from 'react'

import FinanceAccounting from '../features/leads copy'

const Dashboard = lazy(() => import('../pages/protected/Dashboard'))

const Contacts=lazy(()=>import('../pages/protected/Contact'))
const Partnership=lazy(()=>import('../pages/protected/Partnership'))
const Teams =lazy(()=>import('../pages/protected/Category'))
const Servicing=lazy(()=>import('../pages/protected/Service'))
const Carrier = lazy(() => import('../pages/protected/Carrier'))
const ServiceList=lazy(()=>import('../pages/protected/Order'));
const ViewTestimonial=lazy(()=>import('../pages/protected/Blog'));

const About=lazy(()=>import('../pages/protected/About'));

const routes = [
  { // the url
  component: Dashboard, // view rendered
  },
 
  // {
  //   path: '/team',
  //   component: Teams,
  // },
  
  // {
  //   path: '/About',
  //   component: About,
  // },

  // {
  //   path: '/Career',
  //   component: Carrier,
  // },
  // {
  //   path: '/Job',
  //   component: FinanceAccounting,
  // },
  // {
  //   path: '/Services',
  //   component: Servicing,
  // },
  {
    
    path: '/Product',
    component: ServiceList,
  },
  // {
    
  //   path: '/testimonial',
  //   component: ViewTestimonial
  // },
  // {
    
  //   path: '/Contact',
  //   component: Contacts
  // },
  // {
    
  //   path: '/Partnership',
  //   component: Partnership
  // },

  
]

export default routes
