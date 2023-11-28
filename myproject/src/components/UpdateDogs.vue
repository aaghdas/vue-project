<template>
    <v-app id="gallery-app" >
   <HeaderAdmin  /> 
   
            <p class="update-top">Daten bearbeiten</p>
   
<div class="update">
    
   <v-form ref="form" >

       <v-text-field  type="text" name="name" label="Name" v-model="dogs.name"  clearable></v-text-field>

       <v-text-field  type="text" name="Rasse"  label="Rasse" v-model="dogs.Rasse"  clearable></v-text-field>
      
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
      
   <div class="file-input">
   
       <input ref="fileInput" type="file" name="image" v-on:change="readImage" style="display: none"  accept="image/jpeg, image/jpg, image/png, image/webp">
       
        <div  class="file-name">
            
            <v-btn v-if="!selectedFileName" class="admin-button-update" small outlined @click="openFileInput">
                <v-icon  >mdi-upload</v-icon>
                Bild auswählen
            </v-btn>
            <v-btn class="admin-button-filename">{{ selectedFileName }} &nbsp;</v-btn>
            
            <div  > 
                <v-btn  class="admin-button" type="button" v-on:click="updateDogs">Aktualisieren</v-btn>
                <v-btn  v-if="selectedFileName" class="admin-button-close" type="button"   @click="toggleSelectedFileName"> Abbrechen</v-btn>
            </div> 

            <div v-if="showMessageBox" class="message-admin">
                <p class="content" v-html="messageContent"></p>
                
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
   name:'UpdateDogs',
   components:{
       HeaderAdmin,
       FooterComponent  
   },

   data(){

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

   async updateDogs(){
    console.warn(this.dogs)
           const result = await axios.put("http://localhost:3000/dogs/"+this.$route.params.id,{
               
               name:this.dogs.name,
               Geschlecht:this.dogs.Geschlecht,
               Alter:this.dogs.Alter,
               Rasse:this.dogs.Rasse,
               Groesse:this.dogs.Groesse,
               Ort:this.dogs.Ort,
               Beschreibung: this.dogs.Beschreibung,
               image:this.dogs.image
           });
           
           
           if(result.status==200){
               let content = 'Sie haben die Daten erfolgreich aktualisiert!'
               this.showMessage(content)
             
              
           }
   },

   showMessage(content) {
     this.messageContent = content;
     this.showMessageBox = true;
     
   },

   hideMessageBox() {
    
     this.showMessageBox = false;
     this.showNextButton = false;
     this.showCloseButton  = false;
     this.messageContent = '';
     
   },
   
       

       readImage(event) { 
           const file = event.target.files[0]; 
           const reader = new FileReader(); 
           reader.onloadend = () => {
            this.dogs.image = reader.result;
            this.selectedFileName = file.name;
           }; 
           try {
               if (file.size > 200000) { // Max. 200 KB
                   alert('Die Dateigröße darf 200 KB nicht überschreiten.');
               }else{
           reader.readAsDataURL(file);}
           } catch (error) {
           console.error(error);
           this.selectedFileName = null; // Setzt selectedFileName zurück, um keinen fehlerhaften Dateinamen anzuzeigen
           }
       
       },

       openFileInput() {
       
        this.$refs.fileInput.click();
        this.resetFileInput(); // zurücksetzen des inputs und des Dateinamens
       },

       toggleSelectedFileName(){
           this.selectedFileName= null;
           
       },
       resetFileInput() {
        this.$refs.fileInput.value = null; // setzt das input-Element auf null zurück
        this.selectedFileName = null;
        },

       reset(){
           this.dogs.name="";
           this.dogs.Geschlecht="";
           this.dogs.Alter="";
           this.dogs.Rasse="";
           this.dogs.Groesse="";
           this.dogs.Ort="";    
           this.$refs.form.reset();
           this.fileInput= null;
           this.selectedFileName= null;
           
           this.hideMessageBox();

       }
  

},

async mounted(){
    const result = await axios.get('http://localhost:3000/dogs/'+this.$route.params.id)
    console.log(this.$route.params.id)
    console.log(result.data)
    this.dogs = result.data
}

}
</script>