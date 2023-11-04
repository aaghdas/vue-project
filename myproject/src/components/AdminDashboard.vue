<template>

    <v-app id="app" >
    
        <HeaderAdminNotLoggedIn v-if="!isLoggedIn" /> <HeaderAdmin v-else /> 
        <v-main >
        
       
                <h1>Willkommen in Admin Dashboard...Um Änderungen durchzuführen, melden Sie Sich als Admin an.</h1>
                
                   <h2>Gallery bearbeiten</h2>
                    <v-btn  @click="$router.push({path:'/add'})">hinzufügen</v-btn>
                    <v-btn  @click="$router.push({path:'/update'})">Bearbeiten</v-btn>
                    <v-btn  @click="$router.push({path:'/update'})">Löschen</v-btn>

                     <h2>Quiz bearbeiten</h2>
                    <v-btn  @click="$router.push({path:'/add'})">hinzufügen</v-btn>
                    <v-btn  @click="$router.push({path:'/update'})">Bearbeiten</v-btn>
                    <v-btn  @click="$router.push({path:'/update'})">Löschen</v-btn>
        </v-main>
<FooterComponent /> 
        
       
    </v-app>
   
</template>

<script>

import HeaderAdminNotLoggedIn from './HeaderAdminNotLoggedIn.vue'
import HeaderAdmin from './HeaderAdmin.vue'
import FooterComponent from './FooterComponent.vue'

export default{
    name:'AdminDashboard',
    data(){
        return{
            isLoggedIn: false,  
             
        }
    },

    components:{
        HeaderAdminNotLoggedIn,
        HeaderAdmin,
        FooterComponent
    },
    
    async mounted(){

        let user = localStorage.getItem('user-info');
        
            if (user) {
                this.isLoggedIn = true;
             }  
            
    }
}

</script>