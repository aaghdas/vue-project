<template>
    <div class="dogsMore">  
        <v-card class="dogsMore-card">
            <v-card-title class="dogsMore-title">{{ dog.name }}   </v-card-title>  
            
            <v-img class="dogsMore-img" v-bind:src="dog.image"  cover/>
            <v-card-text class="dogsmore-text">
                {{dog.Rasse}}, {{dog.Geschlecht}}, {{dog.Alter}} und {{dog.Groesse}}  <br/>
                <v-action>
                    <v-btn class="describe-btn" @click="description">Mehr über mich ...</v-btn>
                </v-action>
            </v-card-text>
        </v-card>
        
        <v-card v-show="showBeschreibung" class="dogsMore-card-describe">
           <v-icon class="close-icon" @click="showBeschreibung = false">mdi-close</v-icon> 
           
             
           <v-card-text class="dogsMore-text">
           {{ dog.name }} lebt aktuell in {{dog.Ort}}. mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
           </v-card-text>
        </v-card>
                             
    </div>
</template>

<script>
    import axios from 'axios'; 
    
    export default {

    name: 'DogsMore',
    props: ['id'],

  
    data() {
        return {
        dog: {},
        showBeschreibung:false,
        }
    },

    methods:{

        description(){
            this.showBeschreibung = true;
            this.$nextTick(() => {
                this.scrollToPosition(300);
            });
        },
        scrollToPosition(position) {
            window.scroll({
                top: position,
                left:0,
                behavior: "smooth"
            });
        }

        
    },

    async created() {
        try {
            let result = await axios.get(`http://localhost:3000/dogs/${this.$route.params.id}`);
            this.dog = result.data;
        } catch (error) {
           console.log(error);
        }
    }
    }
</script>

/*`this.$nextTick()` ist eine Methode in Vue.js, 
die einen Rückruf (Callback) ausführt, nachdem Vue.js seine 
Änderungen an der DOM abgeschlossen hat. Die Methode akzeptiert eine Funktion als Argument,
 die dann nach der Aktualisierung der DOM ausgeführt wird.
 DOM steht für Document Object Model und ist eine Programmierschnittstelle für Webdokumente. 
 Mit DOM kann eine Webseite als Baumstruktur dargestellt werden, in der jeder Knoten (Node) einem
  Element, Attribut oder Textknoten entspricht. Mit Hilfe von DOM können Webentwickler auf diese 
  Baumstruktur zugreifen und Veränderungen an der Webseite in Echtzeit vornehmen.

DOM wird oft in Verbindung mit JavaScript verwendet, um dynamische Webseiten zu erstellen. 
Das bedeutet, dass Elemente und Inhalte einer Seite in Abhängigkeit von Nutzerinteraktionen oder 
Datenveränderungen aktualisiert werden können. Ein Beispiel hierfür ist die Erstellung von
 HTML-Forms oder das Hinzufügen von Event-Listenern über JavaScript.

DOM ist also eine wichtige Grundlage für viele JavaScript-Bibliotheken und Frameworks wie jQuery, 
React und Vue.js.
*/