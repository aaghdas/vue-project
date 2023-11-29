import GalleryComponent from './components/GalleryComponent.vue'
import SignUp from './components/SignUp.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/LoginPage.vue'
import AddDogs from './components/AddDogs.vue'
import UpdateDogs from './components/UpdateDogs.vue'

import Quiz from './components/QuizApp.vue'
import DogsMore from './components/DogsMore.vue'
import HomePage from './components/HomePage.vue'
import AdminDashboard from './components/AdminDashboard.vue'
import BookAppointment from './components/BookAppointment.vue'
import ContactFormPage from './components/ContactFormPage.vue'
import ConsultantPage from './components/ConsultantPage.vue'
import ConsultantAppointments from './components/ConsultantAppointments.vue'
import ConsultantBookAppointments from './components/ConsultantBookAppointments.vue'
import ConsultantMessages from './components/ConsultantMessages.vue'

const routes = [
    {
        name: 'GalleryComponent',
        component: GalleryComponent,
        path: '/gallery'
    },
   
    
    {

        name: 'SignUp',
        component: SignUp,
        path: '/sign-up'
    },

    {
        name: 'LoginPage',
        component: Login,
        path: '/login'
    },
   
    {
        name:'AdminDashboard',
        component: AdminDashboard,
        path: '/admin'
    },

    
    {
        name: 'AddDogs',
        component: AddDogs,
        path: '/add'
    },

   
    
    {
        name: 'UpdateDogs',
        component: UpdateDogs,
        path: '/update/:id'
    },
    
    {
        name: 'QuizApp',
        component: Quiz,
        path: '/quiz' 
    },
   
   
    {
        name: 'HomePage',
        component: HomePage,
        path: '/' 
    },
    {
        name: 'BookAppointment',
        component: BookAppointment,
        path: '/termin' 
    },
    {
        name:'DogsMore',
        component: DogsMore,
        path:'/beschreibung:id'
    },
    {
        name:'ContactFormPage',
        component: ContactFormPage,
        path:'/kontakt'
    },
    {
        name: 'ConsultantPage',
        component: ConsultantPage,
        path: '/berater'
    },
    {
        name: 'ConsultantBookAppointments',
        component: ConsultantBookAppointments,
        path: '/terminbuchen'
    },
    {
        name: 'ConsultantMessages',
        component: ConsultantMessages,
        path: '/nachrichten'
    },
    {
        name: 'ConsultantAppointments',
        component: ConsultantAppointments,
        path: '/termine'
    }


];


const router = createRouter(
    {
        history: createWebHistory(),
        routes,
        scrollBehavior(to,from,savedPosition){
            return savedPosition || {top:0}
        }
        
    }
);


 router.beforeEach((to, from, next) => { 
   localStorage.setItem('lastPath', from.path) 
   next()
 });

export default router;