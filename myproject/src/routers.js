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
import NotFoundComponent from './components/NotFoundComponent';
import DatenSchutz from './components/DatenSchutz.vue';
import AGB from './components/AGB.vue';

const routes = [
    {
        name: 'GalleryComponent',
        component: GalleryComponent,
        path: '/gallery'
    },
    {
        name: 'DatenSchutz',
        component: DatenSchutz,
        path: '/datenschutz'
    },
    {
        name: 'AGB',
        component: AGB,
        path: '/agb'
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
        path: '/admin',
        meta: { requiresAdmin: true } 
    },

    {
    name:'NotFoundComponent',
    component: NotFoundComponent,
    path: '/:pathMatch(.*)*',
  },

  
    {
        name: 'AddDogs',
        component: AddDogs,
        path: '/add',
        meta: { requiresAdmin: true } 
    },

   
    
    {
        name: 'UpdateDogs',
        component: UpdateDogs,
        path: '/update/:id',
        meta: { requiresAdmin: true } 
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
        path: '/berater',
        meta: { requiresBerater: true } 
    },
    {
        name: 'ConsultantBookAppointments',
        component: ConsultantBookAppointments,
        path: '/terminbuchen',
        meta: { requiresBerater: true } 
    },
    {
        name: 'ConsultantMessages',
        component: ConsultantMessages,
        path: '/nachrichten',
        meta: { requiresBerater: true } 
    },
    {
        name: 'ConsultantAppointments',
        component: ConsultantAppointments,
        path: '/termine',
        meta: { requiresBerater: true } 
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

 router.beforeEach((to, from, next) => {
    // Überprüfen, ob der Benutzer eingeloggt ist und welche Rolle er hat
    const isLoggedIn = localStorage.getItem('user-info');
    const userInfo = isLoggedIn ? JSON.parse(isLoggedIn) : null;
    const isAdmin = userInfo && userInfo.benutzername === 'Admin';
    const isBerater = userInfo && userInfo.benutzername === 'Berater';
  
    // Wenn der Benutzer nicht eingeloggt ist oder nicht die erforderliche Rolle hat, leite zu 404 um
    if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin) {
      next({ path: '/404' });
    } else if (to.matched.some(record => record.meta.requiresBerater) && !isBerater) {
      next({ path: '/404' });
    } else {
      next();
    }
  });

export default router;