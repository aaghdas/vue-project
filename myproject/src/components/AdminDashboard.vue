<template>
    <v-app id="gallery-app" >
        <HeaderAdmin  /> 
    <div class="admin-top">
            <p class="admin-top-item">Neue Hunde der Gallerie  hinzufügen</p>
            <span >
                <router-link :to="{name: 'AddDogs'}"><v-icon  class="plus">mdi-plus-box</v-icon></router-link>
            </span>
            
    </div>
        <div class="cards-mobile-admin">
              <div class="gallery-card-mobile" v-for="(item) in dogs" :key="item.id">
                    <v-img id="img" cover class="ma-4" v-bind:src="item.image"  /> 
                    
                    <v-card-text>
                        <p class="cardtext"> {{item.name}}, {{item.Geschlecht}}, {{item.Alter}}, {{item.Rasse}}, {{item.Groesse}}, {{item.Ort}}</p>
                    </v-card-text>
                    
                    <div class="icon-wrapper">
                        <router-link :to="'/update/'+item.id"><v-icon class="edit" >mdi-pencil</v-icon></router-link>
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
import axios from 'axios'

export default{
    name:'AdminDashboard',
    
    data(){ 
        return{ 

            showMessageBox:false,
            dogs:[], 
          
        }
    },


components:{
    HeaderAdmin ,
    FooterComponent,
    
},

methods:{

    toggleMessage(){
        this.showMessageBox = !this.showMessageBox;
    },
    async deleteDogs(id){
        let result =await axios.delete("http://localhost:3000/dogs/"+id);
        console.warn(result)
        if(result.status==200){
            this.loadData();
        }
    },

    async loadData(){
        let result =await axios.get("http://localhost:3000/dogs");
        this.dogs = result.data;
    }

},

async mounted(){
   this.loadData();
    
},



}

</script>