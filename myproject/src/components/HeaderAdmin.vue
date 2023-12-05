<template>
    
       
            <v-app-bar id="header">
                
                <v-btn> HübscheHunde Admin </v-btn> 
                
                <v-spacer></v-spacer>
                <v-app-bar-items class="hidden sm-and-down">
                    
                    <v-btn  @click="logout" >Logout</v-btn>
                </v-app-bar-items>
            </v-app-bar>
        
     
</template>


<script>
 
    export default {

        name:'HeaderAdmin',
        data(){
            return{
                benutzername:'',
            }
        },
        

    methods:{
        logout() {
            
            if (this.benutzername === 'Admin' ) {
                    this.$router.push({ name: 'HomePage' });            
            }
        localStorage.clear();
        this.$emit('update:isLoggedIn', false);
        
        },

         
    },

   

    async mounted(){
       
       let user = await localStorage.getItem('user-info');
       if(user){
        this.benutzername = await JSON.parse(user).benutzername;
       }
       
   
    } 
};


</script>





