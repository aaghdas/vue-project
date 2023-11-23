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
        
        

    methods:{
        logout() {
        localStorage.clear();
        this.$emit('update:isLoggedIn', false);
        this.$router.push({ name:'LogOut' }).catch(() => {});
        },

         
    },
   
      
};


</script>





