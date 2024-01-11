<template>
    <v-app id="gallery-app" >
        <HeaderAdmin/> 
    <div class="admin-top">
            <p class="admin-top-item">Neue Hunde der Gallerie  hinzufügen</p>
            <span >
                <!-- Link zum AddDogs Komponente zum Hinzufügen von Hunden -->
                <router-link :to="{name: 'AddDogs'}"><v-icon  class="plus">mdi-plus-box</v-icon></router-link>
            </span>
            
    </div>
        <!-- Container für die Karten, die Hundenbilder sowie Hundeninfos, Verknüpfungen zum Hinzufügen, Bearbeiten und Löschen der Karten beinhalten -->
        <div class="cards-mobile-admin">
             <!-- die Array dogs wird durchitteriert und für jeden Hund werden Bild, Name, Geschlecht usw. angezeigt -->
              <div class="gallery-card-mobile" v-for="(item) in dogs" :key="item.id">
                    <v-img id="img" cover class="ma-4" v-bind:src="item.image"  /> 
                    
                    <v-card-text>
                        <p class="cardtext"> {{item.name}}, {{item.Geschlecht}}, {{item.Alter}}, {{item.Rasse}}, {{item.Groesse}}, {{item.Ort}}</p>
                    </v-card-text>
                    
                    <div class="icon-wrapper">

                        <!-- Verknüpfung zur Seite mit dem dynamischem Endpunkt update und id von der jeweiligen Karte -->
                        <router-link :to="'/update/'+item.id"><v-icon class="edit" >mdi-pencil</v-icon></router-link>
                        
                        <!-- Durch click event wird deleteDogs Methode zum löschen der Karte aufgerufen -->
                        <v-icon class="delete" @click="deleteDogs(item.id)">mdi-delete</v-icon>        
                    </div>
                </div>
                
        </div> 
       <FooterComponent/>
    </v-app>
     
</template>


<script>
import HeaderAdmin from './HeaderAdmin.vue'
import FooterComponent from './FooterComponent.vue'
import axios from 'axios'    // Importieren von axios zur Durchführung von HTTP-Anfragen


export default{
    name:'AdminDashboard',
    
    data(){ // Methode, die das Datenobjekt zurückgibt
        return{ 

            showMessageBox:false,   // Zustand der Nachrichtenbox (false = ausgeblendet, true = angezeigt)
            dogs:[],
           
          
        }
    },


components:{ // Registrierung der verwendeten Komponenten
    HeaderAdmin,
    FooterComponent,
    
},

methods:{

    toggleMessage(){
        this.showMessageBox = !this.showMessageBox;
    },

    // Asynchrone Methode zum Löschen eines Hundes
    async deleteDogs(id){
        // Senden einer DELETE-Anforderung an den Server
        let result =await axios.delete("http://localhost:3000/dogs/"+id);
        console.warn(result)
        if(result.status==200){  // Wenn der Status der Antwort 200 ist, d.h. Delete Anforderung erfolgreich ist, Daten neu laden
            this.loadData(); 
        }
    },

    // Asynchrone Methode zum Laden der Daten
    async loadData(){
        let result =await axios.get("http://localhost:3000/dogs");   // Senden einer GET-Anforderung an den Server
        this.dogs = result.data;   // Speichern der GET-Anforderung Ergebnisse in der dogs-Liste. dogs[] wurde schon im data-objekt deklariert, deswegen this.dogs)
    }

},

 mounted(){ // Lebenszyklushaken, der aufgerufen wird, wenn die Komponente eingehängt ist
   
    this.loadData(); // Beim mounten der komponente wird die Methode loadData aufgerufen.
    
},



}

</script>