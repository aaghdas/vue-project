<template>
    <header id="headertest" :class="{'scrolled-nav' : scrollPosition}">
        <nav>
           <div id="home-icon" class="home" @click="$router.push({path: '/'})">
                   <v-icon @click="$router.push({path: '/'})">mdi-home </v-icon><span id="dogs24">&nbsp; Hunde.de</span> 
                    <v-spacer></v-spacer>    
            </div>  
              
            <ul v-show="!mobile" class="navigation">
                
                <li><router-link class="link" :to="{name: 'GalleryComponent'}">Gallery</router-link></li>
                <li><router-link class="link" :to="{name: 'QuizApp'}">Quiz</router-link></li>
                <li><router-link class="link" :to="{name: 'ContactFormPage'}">Kontakt</router-link></li>
                <li><router-link class="link" :to="{name: 'BookAppointment'}">Beratungstermin</router-link></li>
                <li><v-icon id="homeIcon-dropdown" @click="$router.push({path: '/login'})">mdi-login </v-icon>
                <span id="anmelden"> <router-link class="link" :to="{name: 'LoginPage'}">Anmelden</router-link></span></li>
                
            </ul>
            <div class="icon">
                <i id="icon" @click="toggleMobileNav" v-show="mobile" class="fa fa-navicon"  :class="{'icon-active' : mobileNav}"></i>
            </div>
            <transition name="mobile-nav">
                <ul v-show="mobileNav" class="dropdown-nav">

                    <li id="account-li-dropdown">
                    <v-icon id="homeIcon-dropdown" @click="$router.push({path: '/login'})">mdi-login</v-icon>
                    <span > <router-link class="link-dropdown" :to="{name: 'LoginPage'}"> Anmelden</router-link></span></li>
                    <v-divider thickness="3px" :dark="isDark"></v-divider>

                    <li id="li-dropdown"><i class="fa fa-home" id="homeIcon-dropdown" @click="$router.push({path: '/'})"></i>
                    <span> <router-link class="link-dropdown" :to="{name: 'HomePage'}">Startseite</router-link></span></li>

                    <li id="li-dropdown"><i class="fa fa-envelope-o" id="contact-icon-dropdown" @click="$router.push({path: '/'})"></i>
                    <span> <router-link class="link-dropdown" :to="{name: 'HomePage'}">Kontakt</router-link></span></li>
                    
                    <li id="li-dropdown" ><i class="fa fa-image" id="gallery-icon-dropdown" @click="$router.push({path: '/gallery'})"></i>
                    <span> <router-link class="link-dropdown" :to="{name: 'GalleryComponent'}">Gallery</router-link></span></li>
                   
                    <li id="li-dropdown" ><i class="fa fa-question-circle-o" id="quiz-icon-dropdown" @click="$router.push({path: '/quiz'})"></i>
                    <span> <router-link class="link-dropdown" :to="{name: 'QuizApp'}">Quiz</router-link></span></li>
                    <li><router-link class="link" :to="{name: 'BookAppointment'}">Beratungstermin</router-link></li>
                    
                    
                </ul>
            </transition>
            
        </nav>
    </header>
</template>


<script>



    export default {

        name:'HeaderHome',

        data(){
            return{
               scrollPosition: null,
               mobile: false,
               mobileNav: false,
               windowWidth: null,
            };
        },
        created(){
            window.addEventListener('resize',this.checkScreen);
            this.checkScreen();

        },
        methods:{

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
            }


        }
       
    
    
</script>
