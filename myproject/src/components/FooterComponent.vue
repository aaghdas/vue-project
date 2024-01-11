<!-- Dieser Code erstellt eine Footer-Komponente mit verschiedenen Links und Icons. 
  Die Links führen zu den Datenschutz-, Impressum- und AGB-Seiten. 
  Die Icons sind Links zu verschiedenen Social-Media-Seiten. 
  Es gibt auch einen Copyright-Text, der das aktuelle Jahr und den Namen der Website anzeigt. -->

<template>
  
  <v-footer id="footer" class="bg-indigo-lighten-1 text-center d-flex flex-column">
    <!-- bg-indigo-lighten-1: Diese Klasse ändert die Hintergrundfarbe des Elements zu einem helleren Farbton (lighten-1) von Indigo.
    text-center: Diese Klasse zentriert den Text innerhalb des Elements.
    d-flex: Diese Klasse wendet das CSS-Flexbox-Layout auf das Element an. 
    flex-column: Diese Klasse ändert die Richtung der Flexbox-Elemente zu einer Spalte (column). Standardmäßig sind Flexbox-Elemente in einer Reihe. --> 

 

    

    <div class="legal-info">  <!-- Router-Links zu verschiedenen Seiten wie Datenschutz, Impressum und AGB -->
      <router-link class="legal" to="/datenschutz">Datenschutz</router-link> |
      <router-link class="legal" to="/impressum">Impressum</router-link> |
      <router-link class="legal" to="/agb">AGB</router-link>
    </div>

    <div>
    <!-- Eine Schleife, die über eine Liste von Icons iteriert und für jedes Icon einen Button erstellt -->
    <v-btn   
      v-for="icon in icons"
      :key="icon"
      class="mx-4"
      :icon="icon"
      variant="text"
    ></v-btn>
  </div>
  <div> <!-- Ein Copyright-Text mit dem aktuellen Jahr und dem Namen der Website -->
      Alle Rechte vorbehalten &nbsp;
      <i class="fa fa-copyright"></i>

      <!-- new Date() gibt Date-Objekt, das das aktuelle Datum und die aktuelle Uhrzeit beinhaltet, getFullYear() nimmt nur das Jahr -->
    {{new Date().getFullYear() }}<p class="footerlogo">&nbsp; Hunde.de</p>
    </div>
  </v-footer>
  
</template>

<script>

    export default{

        name:'FooterComponent',

        data(){
            return{
                icons: [  //Eine Liste von Icons, die in der Komponente verwendet werden
                    'mdi-facebook',
                    'mdi-twitter',
                    'mdi-linkedin',
                    'mdi-instagram',
                ]
            }
        }
    }

</script>