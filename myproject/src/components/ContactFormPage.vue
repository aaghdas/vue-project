<template>
 
            
   <div class="app-container">
        <v-app id="app-appointment" >
            <HeaderLogedIn v-if="isLoggedIn" />
            <div class="contact-container" v-if="isLoggedIn" >
                <ContactForm />
            </div>
            <div v-else > 
                    <HeaderHome />
                    <p class="meldung"><v-icon>mdi-information-outline</v-icon>  Bitte melde dich an, bevor du einen Beratungstermin buchst oder das Kontaktformular ausfüllst! </p>
                    
                    <div id="loginTermin">
                        <v-btn :to="{ name: 'LoginPage'}" class="loginbtn"> Einlogen</v-btn>
                        <p id="keinkonto">Noch kein Konto?</p>
                        <v-btn :to="{ name: 'SignUp'}" class="loginbtn"> Neues Konto</v-btn>
                    </div>
            </div>
            <FooterComponent/> 
        </v-app>
    </div> 
</template>

<script>

import HeaderHome from './HeaderHome.vue'
import HeaderLogedIn from './HeaderLogedIn.vue'
import FooterComponent from './FooterComponent.vue'
import ContactForm from './ContactForm.vue'

export default{

    name:'ContactFormPage',

    components:{
        HeaderHome,
        HeaderLogedIn,
        FooterComponent,
        ContactForm
    },

    data(){ 
            return{ 
                isLoggedIn:false, 
                benutzername:"",
                name:""
            }
        },

        async mounted(){

            let user = localStorage.getItem('user-info')
            user = JSON.parse(user);
            this.benutzername = await user.benutzername;
            this.name = await user.name;
                if(user) {
                this.isLoggedIn = true;
                }  
        }
};

</script>