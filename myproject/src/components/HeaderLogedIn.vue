<template>
    <header id="headertest" :class="{'scrolled-nav' : scrollPosition}">
        <nav>
           
            <div id="home-icon" class="home" @click="$router.push({path: '/'})">
                   <span id="dogs24">&nbsp; Hunde.de</span> <v-icon @click="$router.push({path: '/'})">mdi-home </v-icon>
                    <v-spacer></v-spacer>    
            </div>                     
              
               
              
            <ul v-show="!mobile" class="navigation">
                
                <div class="account"> 
                    <li>
                        <v-icon id="homeIcon-dropdown" @click="toggleArrowbox">mdi-account-circle </v-icon>
                        <span id="anmelden" class="link" @click="toggleArrowbox"> {{benutzername}}</span>
                    </li>
                    <div v-if="showArrowBox" class="arrowBox">
                        <p class="link-konto" @click="toggleConfirmMessage" >Konto löschen</p>
                        <div v-if="showConfirmMessage">
                            <p class="confirmMessage" >Möchtest du wirklich dein Konto löchen? </p>
                            <v-btn   class="admin-button-close" type="button"   @click="deleteAccount(this.id)"> Ja löschen</v-btn>
                            <v-btn   @click="toggleConfirmMessage"  class="admin-button" type="button" >Abbrechen</v-btn>
                        </div>
                    </div>
                </div>    
                <li><router-link class="link" :to="{name: 'ContactFormPage'}">Kontakt</router-link></li>
                <li><router-link class="link" :to="{name: 'GalleryComponent'}">Gallery</router-link></li>
                <li><router-link class="link" :to="{name: 'QuizApp'}">Quiz</router-link></li>
                <li><router-link class="link" :to="{name: 'BookAppointment'}">Beratungstermin</router-link></li>
                <li >
                    <v-icon id="homeIcon-dropdown" @click="logout">mdi-logout</v-icon>
                    <span class="link" @click="logout">Abmelden</span>
                </li>
                
                
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

                    <li id="li-dropdown"><i class="fa fa-envelope-o" id="contact-icon-dropdown" @click="$router.push({path: '/kontakt'})"></i>
                    <span> <router-link class="link-dropdown" :to="{name: 'ContactFormPage'}">Kontakt</router-link></span></li>
                    
                    <li id="li-dropdown" ><i class="fa fa-calendar" id="gallery-icon-dropdown" @click="$router.push({path: '/termin'})"></i>
                    <span> <router-link class="link-dropdown" :to="{name: 'BookAppointment'}">Beratungstermin</router-link></span></li>

                    <li id="li-dropdown" ><i class="fa fa-image" id="gallery-icon-dropdown" @click="$router.push({path: '/gallery'})"></i>
                    <span> <router-link class="link-dropdown" :to="{name: 'GalleryComponent'}">Gallery</router-link></span></li>
                   
                    <li id="li-dropdown" ><i class="fa fa-question-circle-o" id="quiz-icon-dropdown" @click="$router.push({path: '/quiz'})"></i>
                    <span> <router-link class="link-dropdown" :to="{name: 'QuizApp'}">Quiz</router-link></span></li>
                    <li id="li-dropdown">
                        <v-icon id="quiz-icon-dropdown" @click="logout">mdi-logout</v-icon>
                        <span class="link-dropdown" @click="logout"> Abmelden</span>
                    </li>
                    <li  id="li-dropdown">  
                        <v-icon id="quiz-icon-dropdown" >mdi-delete</v-icon>
                        <span class="link-dropdown" @click="toggleConfirmMessageAndArrowbox">Konto Löschen</span>
                        
                        <div v-if="showArrowBox" class="arrowBox-dropdown">
                            <p class="confirmMessage" >Möchtest du wirklich dein Konto löchen? </p>
                            <div >
                                
                                <v-btn   class="admin-button-close" type="button"   @click="deleteAccount(this.id)"> Ja löschen</v-btn>
                                <v-btn   @click="toggleConfirmMessageAndArrowbox"  class="admin-button" type="button" >Abbrechen</v-btn>
                            </div>
                        </div>
                    </li>
                    
                    
                    
                </ul>
            </transition>
            
        </nav>
    </header>
</template>




<script>
 import axios from 'axios'

 
    export default {

        name:'HeaderLogedIn',
        
        data(){
        return{
            showArrowBox :false,
            showConfirmMessage:false,
            benutzername:'', 
            id:'', 
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

        async deleteAccount(id){
            try {
                let result = await axios.delete("http://localhost:3000/users/"+id);
                console.warn(result)
                if(result.status == 200){
                    this.loadData();
                    this.toggleArrowbox();
                    this.logout();
                }
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        },

    async loadData(){
        let result =await axios.get("http://localhost:3000/users");
        this.users = result.data;

        
    },

        toggleConfirmMessage(){
            this.showConfirmMessage = !this.showConfirmMessage;
        },
        toggleArrowbox(){
            this.showArrowBox = !this.showArrowBox;
        },
        toggleConfirmMessageAndArrowbox(){
            this.toggleConfirmMessage();
            this.toggleArrowbox();
        },
        logout() {
            localStorage.clear();
            this.$emit('update:this.isLoggedIn', false);
            let path = this.$route.path;
            if (path === '/termin' || path === '/kontakt' )  {
                    this.$router.push({ name: 'HomePage' });
                }else{
                this.$router.go(0);
                }
            
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
        this.id = await JSON.parse(user).id;
         if (user) {
                this.isLoggedIn = true;
                console.log(this.benutzername )
                console.log(this.id)
             }
         else{
            this.isLoggedIn = true;
         } 
             
        }     
};
</script>

<!-- Die created-Hook in Vue.js ist ein guter Ort, um Event-Listener hinzuzufügen, da sie aufgerufen wird, sobald die Vue-Instanz erstellt ist
und die reaktiven Daten und Ereignisse initialisiert sind. Zu diesem Zeitpunkt ist das Template und noch nicht gerendert oder 
an das DOM noch nicht eingehängt ist, aber vollen Zugriff auf die Methoden und Daten innerhalb der Vue-Instanz vorhanden ist. 
Dies kann besonders nützlich sein, wenn der Event-Listener auf Ereignisse hören soll, die sofort nach der Erstellung der Komponente auftreten 
können, wie z.B. Bildschirmgröße. -->



