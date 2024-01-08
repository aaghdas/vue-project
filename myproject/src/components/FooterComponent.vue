<template>
  
  <v-footer id="footer" class="bg-indigo-lighten-1 text-center d-flex flex-column">
   


    <v-divider></v-divider>

    

    <div class="legal-info">
      <router-link class="legal" to="/datenschutz">Datenschutz</router-link> |
      <router-link class="legal" to="/impressum">Impressum</router-link> |
      <router-link class="legal" to="/agb">AGB</router-link>
    </div>

    <div>
    
    <v-btn
      v-for="icon in icons"
      :key="icon"
      class="mx-4"
      :icon="icon"
      variant="text"
    ></v-btn>
  </div>
  <div>
      Alle Rechte vorbehalten &nbsp;
      <i class="fa fa-copyright"></i>
    {{new Date().getFullYear() }}<p class="footerlogo">&nbsp; Hunde.de</p>
    </div>
  </v-footer>
  
</template>

<script>

    export default{

        name:'FooterComponent',

        data(){
            return{
                icons: [
                    'mdi-facebook',
                    'mdi-twitter',
                    'mdi-linkedin',
                    'mdi-instagram',
                ]
            }
        }
    }

</script>