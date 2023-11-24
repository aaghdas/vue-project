<template>
     <v-app id="gallery-app" >
    <HeaderAdmin  /> 
<div class="addDogs">
    <v-form ref="form">

        <v-text-field  type="text" name="name" label="Name" v-model="dogs.name"  clearable></v-text-field>

        <v-text-field  type="text" name="rasse"  label="Rasse" v-model="dogs.rasse"  clearable></v-text-field>
       
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
    </v-form>  
       
    <div class="file-input">
        <v-btn color="primary" small outlined @click="openFileInput">
            <v-icon left>mdi-upload</v-icon>
           Bild auswählen
        </v-btn>
        <input ref="fileInput" type="file" name="image" v-on:change="readImage" style="display: none"  accept="image/jpeg, image/jpg, image/png, image/webp">
    <div>
        <p v-if="selectedFileName">{{ selectedFileName }}</p>
    <v-icon v-if="selectedFileName"  @click="toggleSelectedFileName"> mdi-close-circle </v-icon>
    </div>  
    <v-btn type="button" v-on:click="addDogs">Hinzufügen</v-btn>  
    <v-btn type="button" v-on:click="reset">weitere Hunde hinzufügen</v-btn>    
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

    data(){

        return {

            fileInput: null,
            selectedFileName: null,
            Geschlecht:["Männlich","Weiblich"],
            Alter:["Welpe","Jungtier","Erwachsen"],
            Groesse:["Klein","Mittel","Groß"],
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
            rasse:'',
            Groesse:'',
            Ort:'',
            
            },
       
            
        }
    },

    methods:{

        async addDogs(){
            console.warn(this.dogs)
            const result = await axios.post("http://localhost:3000/dogs",{
                
                name:this.dogs.name,
                Geschlecht:this.dogs.Geschlecht,
                Alter:this.dogs.Alter,
                Rasse:this.dogs.rasse,
                Groesse:this.dogs.Groesse,
                Ort:this.dogs.Ort,
                image:this.dogs.image
            });
            
            
            if(result.status==201){

               alert('Sie haben einen neuen Hund erfolgreich hizugefügt!');
               
            }
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
        },

        toggleSelectedFileName(){
            this.selectedFileName= null;
        },

        reset(){
            this.dogs.name="";
            this.dogs.Geschlecht="";
            this.dogs.Alter="";
            this.dogs.rasse="";
            this.dogs.Groesse="";
            this.dogs.Ort="";    
            this.$refs.form.reset();
            this.fileInput= null;
            this.selectedFileName= null;

        }
   

}
}
</script>