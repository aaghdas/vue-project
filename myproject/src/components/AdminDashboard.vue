<template>
    <v-app id="gallery-app" >
        <HeaderAdmin  /> 
    <div class="admin-top">
            <p class="admin-top-item">Der Gallerie neue Hunde hinzufügen</p>
            <span>
                <router-link :to="{name: 'AddDogs'}"><v-icon  class="plus">mdi-plus-box</v-icon></router-link>
            </span>
            
    </div>
        <div class="cards-mobile-admin">
              <div class="gallery-card-mobile" v-for="(item) in dogs" :key="item.id">
                    <v-img id="img" cover class="ma-4" v-bind:src="item.image"  /> 
                    <v-card-text>
                        <p id="cardtext"> {{item.name}} </p>
                    </v-card-text>
                    
                    <div class="icon-wrapper">
                        <router-link :to="{name: 'UpdateDogs'}"><v-icon class="edit" >mdi-pencil</v-icon></router-link>
                            <v-icon class="delete">mdi-delete</v-icon>
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
            
            dogs:[], 
          
        }
    },


components:{
    HeaderAdmin ,
    FooterComponent,
    
},

async mounted(){
    let result =await axios.get("http://localhost:3000/dogs");
    this.dogs = result.data;
    
},



}

</script>