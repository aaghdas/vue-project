<template>
<v-app id="gallery-app" >
<HeaderConsultant/>
  <div class="consultant-page">
    <AppearTransition :transition="['-300px',0]">
      <p class="berater-text">Willkommen Berater*in</p>
    </AppearTransition>

    <div class="consultant-grid">
    
      <v-card class="consultant-card">
        <v-card-title class="berater-titel">Termine Übersicht</v-card-title>
        <v-img class="image-berater" aspect-ratio="1.4" cover v-bind:src="require('@/assets/terminbuchung.jpg')" alt="Berater 1" />
        <v-card-text class="berater-card-text">Unter dem Menüpunkt "Termine" kannst du dir anschauen, welche Termine gebucht sind.</v-card-text>
      </v-card>
    

    
      <v-card class="consultant-card">
        <v-card-title class="berater-titel">Termin buchen</v-card-title>
        <v-img class="image-berater" aspect-ratio="1.4" cover v-bind:src="require('@/assets/termine.jpeg')" alt="Berater 2" />
        <v-card-text class="berater-card-text">Unter dem Menüpunt "Termin Buchen" kannst du neue Termine buchen.</v-card-text>
      </v-card>
    

    
      <v-card class="consultant-card">
        <v-card-title class="berater-titel">Nachrichten sehen</v-card-title>
        <v-img class="image-berater" aspect-ratio="1.4" cover v-bind:src="require('@/assets/nachrichten.png')" alt="Berater 3" />
        <v-card-text class="berater-card-text">Unter dem Menüpunkt "Nachrichten" kannst du alle Nachrichten lesen.</v-card-text>
      </v-card>
   
    </div>
  
  
  </div>
   <FooterComponent/>
  </v-app>
 
</template>


<script>
import AppearTransition from './AppearTransition.vue'
import HeaderConsultant from './HeaderConsultant.vue'
import FooterComponent from './FooterComponent.vue'

export default{

    name:'ConsultantPage',

    

    components:{
        AppearTransition, 
        HeaderConsultant,
        FooterComponent
    },


    
   
};

</script>