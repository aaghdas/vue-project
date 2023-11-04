<template>
    <header id="headertest" :class="{'scrolled-nav' : scrollPosition}">
        <nav>
           
            <div id="home-icon" class="home" @click="$router.push({path: '/'})">
                   <span id="dogs24">&nbsp; Hunde.de</span> <v-icon @click="$router.push({path: '/'})">mdi-home </v-icon>
                    <v-spacer></v-spacer>    
            </div>                     
              
               
              
            <ul v-show="!mobile" class="navigation">
                <li><v-icon id="homeIcon-dropdown" @click="$router.push({path: '/login'})">mdi-account-circle </v-icon>
                <span id="anmelden" > <router-link class="link" :to="{name: 'LoginPage'}"> {{benutzername}}</router-link></span>
                <span class="username">
                
                <span id="bearbeiten" ><router-link class="link" :to="{name: 'HomePage'}">Konto bearbeiten</router-link></span>
                </span>
                </li>
                
                <li><router-link class="link" :to="{name: 'ContactFormPage'}">Kontakt</router-link></li>
                <li><router-link class="link" :to="{name: 'GalleryComponent'}">Gallery</router-link></li>
                <li><router-link class="link" :to="{name: 'QuizApp'}">Quiz</router-link></li>
                <li >
                    <v-icon id="homeIcon-dropdown" @click="logout">mdi-logout</v-icon>
                    <span class="link" @click="logout">Abmelden</span></li>
                
            </ul>
            <div class="icon">
                <i id="icon" @click="toggleMobileNav" v-show="mobile" class="fa fa-navicon"  :class="{'icon-active' : mobileNav}"></i>
            </div>
            <transition name="mobile-nav">
                <ul v-show="mobileNav" class="dropdown-nav">

                    <li id="account-li-dropdown">
                    <v-icon id="homeIcon-dropdown" @click="$router.push({path: '/login'})">mdi-account-circle </v-icon>
                    <span> <router-link class="link-dropdown" :to="{name: 'LoginPage'}">{{benutzername}}</router-link></span></li>
                    <v-divider thickness="3px" :dark="isDark"></v-divider>

                    <li id="li-dropdown"><i class="fa fa-home" id="homeIcon-dropdown" @click="$router.push({path: '/'})"></i>
                    <span> <router-link class="link-dropdown" :to="{name: 'HomePage'}">Startseite</router-link></span></li>

                    <li id="li-dropdown"><i class="fa fa-envelope-o" id="contact-icon-dropdown" @click="$router.push({path: '/'})"></i>
                    <span> <router-link class="link-dropdown" :to="{name: 'HomePage'}">Kontakt</router-link></span></li>
                    
                    <li id="li-dropdown" ><i class="fa fa-image" id="gallery-icon-dropdown" @click="$router.push({path: '/'})"></i>
                    <span> <router-link class="link-dropdown" :to="{name: 'GalleryComponent'}">Gallery</router-link></span></li>
                   
                    <li id="li-dropdown" ><i class="fa fa-question-circle-o" id="quiz-icon-dropdown" @click="$router.push({path: '/quiz'})"></i>
                    <span> <router-link class="link-dropdown" :to="{name: 'QuizApp'}">Quiz</router-link></span></li>
                    <li id="li-dropdown">
                    <v-icon id="quiz-icon-dropdown" @click="logout">mdi-logout</v-icon>
                    <span class="link-dropdown" @click="logout"> Abmelden</span></li>
                    
                    
                    
                </ul>
            </transition>
            
        </nav>
    </header>
</template>




<script>
 
    export default {

        name:'HeaderLogedIn',
        
        data(){
        return{
            
            benutzername:'', 
            scrollPosition: null,
            mobile: false,
            mobileNav: false,
            windowWidth: null,   
            isLoggedIn: false  
        }
    },

    created(){
            window.addEventListener('resize',this.checkScreen);
            this.checkScreen();

        },

    methods:{
        logout() {
            localStorage.clear();
            this.$emit('update:this.isLoggedIn', false);
           setTimeout(() => {
            // Reload page after a short delay to ensure that `isLoggedIn` emits before the page refreshes
                if (this.$route.path === '/termin') {
                    this.$router.push({ name: 'HomePage' });
                }else{
                this.$router.go(0);
                }
            }, 50);
                    
        },

        toggleMobileNav(){
            this.mobileNav = !this.mobileNav;
           },

        checkScreen(){
            this.windowWidth = window.innerWidth;
            if(this.windowWidth <= 750){
                this.mobile = true;
                return;
            }
                
            this.mobile = false;
            this.mobileNav= false;
            return;
        }     
    },

    async mounted(){
       
        let user = await localStorage.getItem('user-info');
        this.benutzername = await JSON.parse(user).benutzername;
         if (user) {
                this.isLoggedIn = true;
             }
         else{
            this.isLoggedIn = true;
         } 
             
        }     
};
</script>




