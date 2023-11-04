<template>

    <div class="app-container">    
        
         <v-app id="app" >
         <HeaderHome v-if="!isLoggedIn" /> <HeaderLogedIn v-else /> 
         <v-main class="containerHome" >
            <AppearTransition :transition="['-300px',0]">
                <div id="homeText"><p>Unsere Hunde suchen neues Zuhause und nette  Spazieren BegleiterInnen</p></div>
            </AppearTransition> 
        

        <div class="card-container"> 
            <div id="functions">
               
                <p id="about-App" @click="scrollToPosition(320)">Funktionen in der Web-Applikation</p>
                <v-icon  id="scroll" @click="scrollToPosition(320)">mdi-chevron-double-down</v-icon>
                
            </div>
        <AppearTransition :transition="['-300px',0]">
                    
                    <v-card class="card">
                        <v-card-title class="title mb-0"><span id="word">Galerie</span></v-card-title>
                        
                        <v-card-text class="text-body">  
                        Möchtest du unsere Hunde kennenlernen? Die Gallery stellt Dir Hunde aus unserem Tierheim vor, die ein neues Zuhause suchen!
                        
                    
                        </v-card-text>
                        
                    </v-card>
                    
            </AppearTransition>  
            <AppearTransition :transition="['300px',0]">
                    
                    <v-card class="card">
                        <v-card-title class="title mb-0"><span id="word">Quiz</span></v-card-title>
                    
                        <v-card-text class="text-body">
                        Möchtest du dein Wissen über Hunde testen? Dann mach ein spannendes Quiz und erweitere dein Wissen über Hunde.
                        
                        </v-card-text>
                        
                    </v-card>
                    
            </AppearTransition> 
        
            
        <AppearTransition :transition="['-300px',0]">
        <v-card class="card">
                        <v-card-title class="title mb-0"><span id="word">Beratungstermin</span></v-card-title>
                    
                        <v-card-text class="text-body">
                        Buche Dir einfach ein Beratungsgespräch und lasse dich von unseren erfahrenen Experten beraten.
                        
                        </v-card-text>
                        
                    </v-card>
            
            </AppearTransition>

            <AppearTransition :transition="['-300px',0]">
        <v-card class="card">
                        <v-card-title class="title mb-0"><span id="word">Kontaktformular </span></v-card-title>
                    
                        <v-card-text class="text-body">
                    
                        Wie erreichst Du Uns? Gerne kannst Du uns durch Kontaktformular erreichen. Wir freuen uns auf Dich!
                        </v-card-text>
                        
                    </v-card>
            
            </AppearTransition>
               
        </div>   
         
    </v-main>  
    <FooterComponent/> 
   </v-app> 
   
   </div>
    
</template>

<script>

import HeaderHome from './HeaderHome.vue'
import HeaderLogedIn from './HeaderLogedIn.vue'
import FooterComponent from './FooterComponent.vue'
import AppearTransition from './AppearTransition.vue'

export default{
    name:'HomePage',
    data(){
        return{
            isLoggedIn: false,  
             
        }
    },

    components:{
        HeaderHome,
        HeaderLogedIn,
        FooterComponent,
        AppearTransition
    },
    
    async mounted(){
        
        let user = localStorage.getItem('user-info');
        
            if (user) {
                this.isLoggedIn = true;
             } 
        
     
            
    },
    methods:{
        scrollToPosition(position) {
            window.scroll({
                top: position,
                left: 0,
                behavior: "smooth"
            });
        }
    }
    
};


</script>