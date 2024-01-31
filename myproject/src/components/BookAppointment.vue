<template>
  
   <div class="app-container">
        <v-app id="app-appointment" >

            <!-- Wenn der Benutzer eingeloggt ist, werden die Header-Komponente sowie die TerminBuchen-Komponente angezeigt -->
            <div v-if="isLoggedIn"> 
                <HeaderLogedIn/>
                <TerminBuchen />
            </div>
            <div v-else > <!-- Wenn der Benutzer nicht eingeloggt ist, wird die folgende Struktur angezeigt -->
                    <HeaderHome />  <!-- Die HeaderHome-Komponente für nicht eingeloggte zustand wird angezeigt -->
                    
                    <!-- Eine Nachricht wird angezeigt, die den Benutzer auffordert, sich anzumelden -->
                    <p class="meldung"><v-icon>mdi-information-outline</v-icon>  Bitte melde dich an, bevor du einen Beratungstermin buchst oder das Kontaktformular ausfüllst! </p>
                    
                    <div id="loginTermin">
                        <!-- Login- und Registrierungsbuttons werden angezeigt und mit entsprechenden Seiten verlinkt -->
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
// die verwendeten Komponenten Importieren
    import HeaderHome from './HeaderHome.vue'
    import FooterComponent from './FooterComponent.vue'
    
    import TerminBuchen from './TerminBuchen.vue'
import HeaderLogedIn from './HeaderLogedIn.vue';

    export default {
        name:'BookAppointment',
        components:{
    HeaderHome,
    FooterComponent,
    TerminBuchen,
    HeaderLogedIn
},

        data(){ 
            return{  // isLoggedIn auf false Initialisieren. Es wird in mounted() geprüft und wenn Benutzer eingelogged ist, wird auf true eingesetzt.
                isLoggedIn:false, 
            }
        },


        /*Die mounted-Funktion ist eine spezielle Funktion in Vue.js, die aufgerufen wird,
         nachdem die Komponente an den DOM angehängt wurde. Hier wird die mounted-Funktion 
         verwendet, um zu überprüfen, ob der Benutzer eingeloggt ist, indem sie die Benutzerinformationen 
         aus dem lokalen Speicher abruft. Wenn der Benutzer eingeloggt ist, wird der Wert von isLoggedIn 
         auf true gesetzt, was dazu führt, dass bestimmte Teile der Komponente angezeigt 
         werden (wie HeaderLogedIn und TerminBuchen). Wenn der Benutzer nicht eingeloggt ist, 
         wird ein anderer Teil der Komponente angezeigt */
        async mounted(){  // Überprüfen Sie, ob der Benutzer eingeloggt ist, wenn die Komponente geladen wird
  
            // localStorage.getItem('user-info') ruft die Benutzerinformationen, die als String in json format unter dem Name user-info gespeichert sind, aus dem lokalen Speicher des Browsers ab.
            // JSON.parse() wandelt den abgerufenen String in ein JavaScript-Objekt um. 
            let user = JSON.parse(localStorage.getItem('user-info'))  
                if(user) {
                this.isLoggedIn = true;
                }  
        }
    };
</script>

 <!-- Die Methode JSON.parse() wird in JavaScript verwendet, um einen String, 
    der im JSON-Format (JavaScript Object Notation) geschrieben ist, in ein JavaScript-Objekt umzuwandeln1.

Hier wird localStorage.getItem('user-info') verwendet, um die Benutzerinformationen aus dem 
lokalen Speicher des Browsers abzurufen. Diese Informationen sind als String im JSON-Format gespeichert.
Um mit diesen Informationen als mit einem JavaScript-Objekt zu arbeiten, muss man den String
mit JSON.parse() in ein js Objekt umwandeln1. -->