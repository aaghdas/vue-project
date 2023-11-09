<template> 
  <div class="app-container"> 
    <v-app id="gallery-app" >
      <HeaderLogedIn v-if="isLoggedIn" /><HeaderHome v-else />
        <v-container  class="gallery">
            
                <label class="label" ><v-icon>mdi-filter-outline</v-icon><span>Filter</span></label>
                
                      <select class="filter-select" v-model="selectedGender" v-bind:items="genders" placeholder="Geschlecht" @change="applyFilter" >
                          <option  :value="null" >Jedes Geschlecht &#x25BC;</option>
                          <option v-for="gender in genders" :value="gender" :key="gender">{{gender}}</option>
                      </select>

                      <select class="filter-select" v-model="selectedAge" v-bind:items="ages" label="Alter"  @change="applyFilter">
                          <option  :value="null" >Jedes Alter &#x25BC;</option>
                          <option v-for="age in ages" :value="age" :key="age">{{age}}</option>
                      </select>
                  
                      <select class="filter-select" v-model="selectedSize" v-bind:items="sizes" label="Größe" @change="applyFilter">
                          <option   :value="null" >Jede Größe &#x25BC;</option>
                          <option v-for="size in sizes" :value="size" :key="size">{{size}}</option>
                      </select>
                  
                      <select class="filter-select" v-model="selectedPlace" v-bind:items="places" label="Aufenthaltsort" @change="applyFilter" >
                          <option  :value="null" >Jeder Ort &#x25BC;</option>
                          <option v-for="place in places" :value="place" :key="place">{{place}}</option>
                      </select>
               
            <p class="noResult" v-if="noResult===true"><v-icon>mdi-information-outline</v-icon>  Keinen Hund gefunden... Filter erneut anpassen</p>
          <v-slide-group v-show="!mobile" v-if="noResult===false" id="slide"  continuous=true v-model="slideGroup" next-icon="mdi-arrow-right-drop-circle" prev-icon="mdi-arrow-left-drop-circle"  show-arrows="always" > 
                <template #prev="{ on, attrs }"> <v-icon color="rgb(22, 175, 98)"  v-bind="attrs" v-on="on" > mdi-arrow-left-drop-circle </v-icon></template> 
                <template #next="{ on, attrs }"> <v-icon color="rgb(22, 175, 98)"  v-bind="attrs" v-on="on" > mdi-arrow-right-drop-circle</v-icon></template>
                              
              <v-slide-item v-for="(item,index) in dogs" :key="item.id" > 
                                      
                  <v-card class="gallery-card" >
                      <v-img id="img" cover class="ma-4" v-bind:src="item.image" @click="showDogDetails(item)" /> 
                      <v-card-text>
                          <p id="cardtext"> {{item.name}} </p>
                                                
                          </v-card-text>
                          <div id="cardnumber" >
                              <span>{{index + 1}}/{{dogs.length}}</span>
                          </div>
                      
                  </v-card>
              </v-slide-item>
                      
            </v-slide-group>
          </v-container>  
            <div class="cards-mobile">
              <v-card class="gallery-card-mobile" v-show="mobile" v-for="(item) in dogs" :key="item.id">
                  <v-img id="img" cover class="ma-4" v-bind:src="item.image" @click="showDogDetails(item)" /> 
                  <v-card-text>
                    <p id="cardtext"> {{item.name}} </p>
                  </v-card-text>
                 
              </v-card>
            </div>
          
         
         <DogsMore v-if="showDetails" :dog="selectedDog" />  
      
      <FooterComponent/> 
   </v-app> 
   
   </div>
</template>

<script> import HeaderHome from './HeaderHome.vue' 
import HeaderLogedIn from './HeaderLogedIn.vue'
import FooterComponent from './FooterComponent.vue'
import DogsMore from './DogsMore.vue'
import axios from 'axios'
import { VSlideGroup, VSlideItem } from 'vuetify'

export default{ 
    name:'GalleryComponent', 
    data(){ 
        return{ 
            isLoggedIn:false, 
            dogs:[], 
            filterdDogs:[],
            slideGroup: 0,
            genders: ["Männlich", "Weiblich"],
            selectedGender: null,
            ages: ["Welpe", "Jungtier", "Erwachsen"],
            selectedAge: null,
            sizes:["Klein","Mittel","Groß"],
            selectedSize:null,
            places:["Leipzig","Dresden","Berlin"],
            selectedPlace:null,
            noResult:false,
            showDetails: false,
            selectedDog: null,
            mobile: false,
            windowWidth: null,
            
            
                }
    },


components:{
    HeaderHome,
    HeaderLogedIn,
    FooterComponent,
    VSlideGroup,
    DogsMore,
    VSlideItem
},



async mounted(){

    let user = JSON.parse(localStorage.getItem('user-info'))
        if(user) {
        this.isLoggedIn = true;
         }  

    let result =await axios.get("http://localhost:3000/dogs");
    this.dogs = result.data;
    this.originalDogs = [...this.dogs];  
     
},

created(){
    window.addEventListener('resize',this.checkScreen);
    this.checkScreen();

  },

methods: {

  checkScreen(){
      
    this.windowWidth = window.innerWidth;
     if(this.windowWidth <= 700){
          this.mobile = true;
          return;
      }
      this.mobile = false;
      return;
  },

   showDogDetails(dog) {
    this.$router.push({ name: "DogsMore", params: { id: dog.id } });
    this.showDetails = true;
      this.selectedDog = dog;
  },
  
    
    applyFilter() {
      this.dogs = [...this.originalDogs]; 
      this.dogs = this.dogs.filter((dog) => this.filterDogs(dog));
      if(this.dogs.length === 0){
        this.noResult =true;
      }else{
        this.noResult =false;
      }
    },
      
   

     filterDogs(dog) {
      // this method implements the filtering logic for a single dog
      let passGender = !this.selectedGender || dog.Geschlecht === this.selectedGender;
      let passAge = !this.selectedAge || dog.Alter === this.selectedAge;
      let passSize = !this.selectedSize  || dog.Groesse === this.selectedSize;
      let passPlace = !this.selectedPlace || dog.Ort === this.selectedPlace;
      let passAllFilters = passGender  && passAge && passSize && passPlace;
    
      return passAllFilters;
    },

    ageMatches(dogAge, selectedAge) {
      switch (selectedAge) {
        
        case "Klein":
          return dogAge === "Klein";
        case "Mittel":
          return dogAge === "Mittel";
        case "Groß":
          return dogAge ==="Groß";
        
        default:
          return true;
      }
    },
  nextSlide () {
    this.slideGroup++
  },
  previousSlide () {
    this.slideGroup--
  }
},

watch: {
  slideGroup (val) {
    if (val == this.dogs.length) {
      this.slideGroup = 0
    }
  }
}
} </script>
