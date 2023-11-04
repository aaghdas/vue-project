<template>
 
            
   <div class="app-container">
        <v-app id="app-appointment" >
            <HeaderLogedIn v-if="isLoggedIn" />
            <div class="contact-container" v-if="isLoggedIn" >
                <ContactForm />
            </div>
            <div v-else > 
                    <HeaderHome />
                    <div id="meldung">
                        <p>Bitte melde dich an, bevor du einen Termin buchst oder das Kontaktformular ausfüllst! </p>
                    </div>
                    <div id="loginTermin">
                        <v-btn :to="{ name: 'LoginPage'}" id="loginbtn"> Einlogen</v-btn>
                        <p id="keinkonto">Noch kein Konto?</p>
                        <v-btn :to="{ name: 'SignUp'}" id="loginbtn"> Neues Konto</v-btn>
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