<template>
    <header id="headertest" >
        
            <nav class="header-consultant">
                <div id="home-icon" class="home-consultant" @click="$router.push({path: '/'})">
                        <v-icon @click="$router.push({path: '/'})">mdi-home </v-icon>
                        <span id="dogs24">&nbsp; Hunde.de</span> 
                        <v-spacer></v-spacer>    
                </div>
                <div class="header-right">
                
                <div class="menu-icon"  @click="showMenu ? closeMenu() : toggleMenu()"
                 :class="{ 'active': active, 'menu-close': showMenu }"
                 @transitionend="showMenu = active && showMenu">
                     <v-icon class="icon-menu" v-if="!showMenu">mdi-menu</v-icon>
                    
                      
                </div>
                
                </div>       
                
                <ul  class="dropdown-nav-consultant" v-show="showMenu">
                <v-icon class="menu-close" @click="closeMenu">mdi-close</v-icon>
                    <li><router-link class="link" :to="{name: 'ConsultantPage'}">Berater Startseite</router-link></li>
                    <li><router-link class="link" :to="{name: 'ConsultantAppointments'}">Termine</router-link></li>
                    <li><router-link class="link" :to="{name: 'ConsultantBookAppointments'}">Termin Buchen</router-link></li>
                    <li><router-link class="link" :to="{name: 'ConsultantMessages'}">Nachrichten</router-link></li>
                    
                    <li><v-icon id="homeIcon-dropdown" @click="logout">mdi-logout</v-icon>
                        <span class="link" @click="logout">Abmelden</span></li>
                    
                </ul>
           
            </nav>
        
    </header>
</template>


<script>



    export default {

        name:'HeaderConsultant',

      
    data(){
        return{
            
            isLoggedIn: false,
            showMenu: false,
            active:false  
        }
    },

    methods:{

        closeMenu(){
            this.showMenu = false;
            this.active = false;
            
        },
       
        toggleMenu(){
            this.active = !this.active;
            setTimeout(() => {
                this.showMenu = !this.showMenu; 
            }, 500);
        },

        logout() {
            localStorage.clear();
            this.$emit('update:this.isLoggedIn', false);
            let path = this.$route.path;
            if (path === '/berater' || path === '/termine' || path === '/terminbuchen' || path === '/nachrichten') {
                    this.$router.push({ name: 'HomePage' });            
            }
        }
    }
}
  
</script>
