<template>
    <v-app id="gallery-app" >
   <HeaderAdmin  /> 
<!-- Formular zum Hinzufügen von Hunden -->
<div class="addDogs"> 
   <v-form ref="form">

       <v-text-field  type="text" name="name" label="Name" v-model="dogs.name"  clearable></v-text-field>

       <v-text-field  type="text" name="rasse"  label="Rasse" v-model="dogs.Rasse"  clearable></v-text-field>
      
       <v-autocomplete
           v-model="dogs.Geschlecht"
           :items="Geschlecht"
           label=" Geschlecht "
           variant="solo"
           required
           clearable
      ></v-autocomplete>
      <v-autocomplete
           v-model="dogs.Alter"
           :items="Alter"
           label=" Alter "
           variant="solo"
           required
           clearable
      ></v-autocomplete>
   
      <v-autocomplete
           v-model="dogs.Groesse"
           :items="Groesse"
           label=" Größe "
           variant="solo"
           required
           clearable
      ></v-autocomplete>

      <v-autocomplete
           v-model="dogs.Ort"
           :items="Bundesländer"
           label="Bundesland "
           variant="solo"
           required
           clearable
      ></v-autocomplete>
      <v-textarea 
       label="&#9998;  Beschreibung "
       type="text"
       variant="solo"
       v-model="dogs.Beschreibung"
       clearable>
       </v-textarea>
      

   </v-form>  
   <!-- Container für die Dateieingabe, wenn Benutzer ein Bild für den Hund auswählen möchte  -->
   <div class="file-input">
       
  <!--  Verstecktes Dateieingabeelement, das auf Dateiänderungen reagiert und die Methode "readImage" aufruft -->
       <input ref="fileInput" type="file" name="image" v-on:change="readImage" style="display: none"  accept="image/jpeg, image/jpg, image/png, image/webp">
       
        <div  class="file-name">
            <v-btn v-if="!selectedFileName" class="admin-button" small outlined @click="openFileInput">  <!--  Button zum Öffnen der Dateiauswahl. Wird nur angezeigt, wenn kein Dateiname ausgewählt ist. -->
                <v-icon  >mdi-upload</v-icon>
                Bild auswählen
            </v-btn>

           <!-- wenn ein Dateiname ausgewählt ist und die Nachrichtenbox nicht angezeigt wird, zeigt den ausgewählten Dateinamen an. -->
            <div v-if="selectedFileName && !showMessageBox">
                <v-btn  class="admin-button-filename">{{ selectedFileName }} &nbsp;</v-btn>
                
                <v-btn  class="admin-button" type="button" v-on:click="addDogs">Hinzufügen</v-btn>
                <v-btn  class="admin-button-close" type="button"   @click="toggleSelectedFileName"> Abbrechen</v-btn>
            </div> 

            <div v-if="showMessageBox" class="message-admin">
                <p class="content" v-html="messageContent"></p>
                <v-btn v-if="showNextButton" class="admin-button" type="button" v-on:click="reset">weitere Hunde hinzufügen</v-btn> 
                <v-btn v-if="showCloseButton" class="admin-button-close" type="button" v-on:click="reset">Vorgang beenden</v-btn>
            </div> 

        </div>       
    </div>
   
   
   
</div>
   <FooterComponent/>
</v-app>  
</template>


<script>
import HeaderAdmin from './HeaderAdmin.vue';
import FooterComponent from './FooterComponent.vue'
import axios from 'axios';



export default{
   name:'AddDogs',
   components:{
       HeaderAdmin,
       FooterComponent  
   },

   /*In Vue.js ist data eine Funktion, die ein Objekt zurückgibt. 
   Dieses Objekt enthält alle Eigenschaften, die man in Vue-Instanz oder -Komponente verfolgen möchte. 
   Jede Eigenschaft, die in das return-Objekt der data-Funktion aufgenommen wird, ist reaktiv. Das bedeutet,
   dass Vue.js Änderungen an diesen Eigenschaften erkennt und die Komponente automatisch neu rendert, wenn eine Änderung erkannt wird. */

   data(){ // Methode, die das Datenobjekt zurückgibt, das alle Eigenschaften, die man in Vue-Instanz oder -Komponente verfolgen möchte, enthält. 

       return {
           showMessageBox:false,
           messageContent: '',
           showNextButton:false,
           showCloseButton:false,
           fileInput: null,
           selectedFileName: null,
           Geschlecht:["Männlich","Weiblich"],
           Alter:["Welpe","Jungtier","Erwachsen"],
           Groesse:["Klein","Mittelgroß","Groß"],
          Bundesländer:[
               "Baden-Württemberg",
               "Bayern",
               "Berlin",
               "Brandenburg",
               "Bremen",
               "Hamburg",
               "Hessen",
               "Mecklenburg-Vorpommern",
               "Niedersachsen",
               "Nordrhein-Westfalen",
               "Rheinland-Pfalz",
               "Saarland",
               "Sachsen",
               "Sachsen-Anhalt",
               "Schleswig-Holstein",
               "Thüringen"],
              
        // Datenobjekt für Hundeinformationen  
           dogs:{
           
           name:'',
           Geschlecht:'',
           Alter:'',
           Rasse:'',
           Groesse:'',
           Ort:'',
           Beschreibung:'',
           
           },
      
           
       }
   },

   methods:{

    /* Methode zum Anzeigen einer Nachricht, die den Nachrichtinhalt als Parameter entgegennimmt.
        es beinhaltet Nachrichtinhalt, ein container für Nachrichtinhalt, next-Knopf sowie close-Knopf */
    showMessage(content) {
     this.messageContent = content;
     this.showMessageBox = true;
     this.showNextButton = true;
     this.showCloseButton = true;
   },

   // Methode zum Ausblenden der container für Nachrichtinhalt, next-Knopf sowie close-Knopf und löscht den Nachrichtinhalt //  
   hideMessageBox() {
    
     this.showMessageBox = false;
     this.showNextButton = false;
     this.showCloseButton  = false;
     this.messageContent = ''; // Nachrichteninhalt löschen
     
   },
   
   // Asynchrone Methode zum Hinzufügen von Hunden
       async addDogs(){
           console.warn(this.dogs)
           /* POST-Anforderung an den Server senden, 
           in array dogs wird einen Hund mit Eigenschaften Name, Geschlecht usw. eingefügt*/
           const result = await axios.post("http://localhost:3000/dogs",{
               
               name:this.dogs.name,
               Geschlecht:this.dogs.Geschlecht,
               Alter:this.dogs.Alter,
               Rasse:this.dogs.Rasse,
               Groesse:this.dogs.Groesse,
               Ort:this.dogs.Ort,
               Beschreibung: this.dogs.Beschreibung,
               image:this.dogs.image
           });
           
           // Wenn der Status der Antwort 201 ist, d.h. die Post-Anforderung erfolgreich ist, gibt die Nachricht mit gegebenen Inhalt aus.
           if(result.status==201){
               let content = 'Sie haben einen neuen Hund erfolgreich hizugefügt!'
               this.showMessage(content)
             
              
           }
       },

       // Methode zum Lesen des Bildes
       readImage(event) { //Diese Methode wird aufgerufen, wenn ein Benutzer eine Datei auswählt. Das event-Objekt enthält Informationen über das ausgelöste Ereignis.
           const file = event.target.files[0]; //Hier wird die erste (und in diesem Fall einzige) Datei aus der Dateiauswahl extrahiert. event.target verweist auf das Element, das das Ereignis ausgelöst hat, in diesem Fall das Dateieingabeelement. files[0] verweist auf die erste ausgewählte Datei.
           const reader = new FileReader(); //Ein FileReader-Objekt zum Lesen der Datei erstellen
           
           /*ein Ereignishandler, der aufgerufen wird, 
           wenn das Laden der Datei abgeschlossen ist. 
           In diesem Fall wird das Ergebnis des FileReader (das ist die Bilddaten als Data-URL) in this.dogs.image gespeichert, 
           und der Dateiname wird in this.selectedFileName gespeichert. */
           reader.onloadend = () => {
            this.dogs.image = reader.result;
            this.selectedFileName = file.name;
           }; 
           try {
               if (file.size > 200000) { // Wenn die Dateigröße größer als 200 KB ist, Warnung anzeigen
                   alert('Die Dateigröße darf 200 KB nicht überschreiten.');
               }else{ // wenn Dateigröße max 200kB ist, Datei als Data-URL lesen
           reader.readAsDataURL(file);}
           } catch (error) { //Bei einem Fehler in der Konsole anzeigen und Setzt selectedFileName zurück, um keinen fehlerhaften Dateinamen anzuzeigen
           console.error(error);
           this.selectedFileName = null; 
           }
       
       },

       // Methode zum Öffnen der Dateiauswahl
       openFileInput() {
       
        // Klick-Ereignis auf das Dateieingabeelement auslösen und danach Dateieingabe zurücksetzen
        this.$refs.fileInput.click();
        this.resetFileInput(); 
       },
       // Methode zum Zurücksetzen der Ausgewählten Dateinamen 
       toggleSelectedFileName(){
           this.selectedFileName= null;
           
       },

       resetFileInput() {  //Methode zum Zurücksetzen der Dateieingabe
        this.$refs.fileInput.value = null; // setzt das input-Element auf null zurück
        this.selectedFileName = null;
        },


       reset(){ // Methode zum Zurücksetzen des Formulars
           this.dogs.name="";
           this.dogs.Geschlecht="";
           this.dogs.Alter="";
           this.dogs.Rasse="";
           this.dogs.Groesse="";
           this.dogs.Ort="";    
           this.$refs.form.reset();
           this.fileInput= null;
           this.selectedFileName= null;
           
           this.hideMessageBox();  // Nachrichtenbox ausblenden

       }
  

}
}
</script>