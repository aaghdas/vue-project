<template>
  
   <div class="app-container">
        <v-app id="app-appointment" >
            <HeaderLogedIn v-if="isLoggedIn" />
            <TerminBuchen v-if="isLoggedIn" /> 
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
    import FooterComponent from './FooterComponent.vue'
    
    import TerminBuchen from './TerminBuchen.vue'

    export default {
        name:'BookAppointment',
        components:{
            
            HeaderHome,
            FooterComponent,
            TerminBuchen
        },

        data(){ 
            return{ 
                isLoggedIn:false, 
            }
        },

        async mounted(){

            let user = JSON.parse(localStorage.getItem('user-info'))
                if(user) {
                this.isLoggedIn = true;
                }  
        }
    };
</script>
