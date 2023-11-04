<template>
    <HeaderHome />
    <h1> Hallo User, willkommen in Add Dogs Page</h1>
    <form class="add">

        <input type="text" name="name" placeholder="Name" v-model="dogs.name" />

         <select class="selectorAdmin" name="Geschlecht" v-model="dogs.Geschlecht">
            <option value="">-- Geschlecht --</option>
            <option value="Männlich">Männlich</option>
            <option value="Weiblich">Weiblich</option>
        </select>
        
        <select class="selectorAdmin" name="Alter" v-model="dogs.Alter">
            <option value="">-- Alter --</option>
            <option value="Welpe">Welpe</option>
            <option value="Jungtier">Jungtier</option>
            <option value="Erwachsen">Erwachsen</option>
            <option value="Senior">Senior</option>
        </select>
        
        <select class="selectorAdmin"  name="Rasse" v-model="dogs.Rasse">
            <option value="">-- Rasse --</option>
            <option value="Alaskan Malamute">Alaskan Malamute</option>
            <option value="Bandog">Bandog</option>
            <option value="Barbet">Barbet</option>
            <option value="Bulldog">Bulldog</option>
            <option value="Bully">Bully</option>
            <option value="Deutscher Schäferhund">Deutscher Schäferhund</option>
            <option value="Golden Retriever">Golden Retriever</option>
            <option value="Hirtenhund">Hirtenhund</option>
            <option value="Labrador">Labrador</option>
            <option value="Terrier">Terrier</option>
            <option value="Windhund">Windhund</option>
            <option value="Andere Rasse">Andere Rasse</option>
        </select>
        
        <select class="selectorAdmin" name="Größe" v-model="dogs.Groesse">
            <option value="">-- Größe --</option>
            <option value="Sehr klein">Sehr klein</option>
            <option value="Klein">Klein</option>
            <option value="Mittel">Mittel</option>
            <option value="Groß">Groß</option>
            <option value="Sehr groß">Sehr groß</option>
        </select>
        
        <select class="selectorAdmin" name="Ort" v-model="dogs.Ort">
            <option value="">-- Aufenthaltsort --</option>
            <option value="Leipzig">Leipzig</option>
            <option value="Dresden">Dresden</option>
            <option value="Berlin">Berlin</option>
        </select>
  
        <input type="file" name="image" v-on:change="readImage">
       
        <button type="button" v-on:click="addDogs">Einen neuen Hund hinzufügen</button>
    </form>
    
</template>


<script>
import HeaderHome from './HeaderHome.vue';

import axios from 'axios';


export default{
    name:'AddDogs',
    components:{
        HeaderHome
    },

    data(){
        return {
            dogs:{
            
            name:'',
            Geschlecht:'',
            Alter:'',
            Rasse:'',
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
                Rasse:this.dogs.Rasse,
                Groesse:this.dogs.Groesse,
                Ort:this.dogs.Ort,
                image:this.dogs.image
            });
            
            
            if(result.status==201){

               alert('Sie haben einen neuen Hund erfolgreich hizugefügt!'),
               this.$router.push({name:'HomePage'})
            }
        },

        readImage(event) { 
            const file = event.target.files[0]; 
            const reader = new FileReader(); 
            reader.onloadend = () => { this.dogs.image = reader.result; }; 
            reader.readAsDataURL(file); 
            },

        
    mounted(){
        let user = localStorage.getItem('user-info');
        
        if(!user){
            this.$router.push({name:'SignUp'})
        }
        
    }

}
}
</script>