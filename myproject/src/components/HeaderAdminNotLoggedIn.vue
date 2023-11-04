<template>
    <v-app>
       
            <v-app-bar id="header">
                
                <v-btn> HübscheHunde Admin Dashboard</v-btn> 
                
                <v-spacer></v-spacer>
                <v-app-bar-items class="hidden sm-and-down">
                   <v-btn @click="$router.push({path:'/login'})">Login</v-btn>
                </v-app-bar-items>
            </v-app-bar>
        
    </v-app>     
</template>


<script>
 
    export default {

        name:'HeaderAdminNotLoggedIn',
        
       

    
    
};


</script>





