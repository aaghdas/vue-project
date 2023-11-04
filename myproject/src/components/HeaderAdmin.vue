<template>
    <v-app>
       
            <v-app-bar id="header">
                
                <v-btn> HübscheHunde Admin Dashboard </v-btn> 
                
                <v-spacer></v-spacer>
                <v-app-bar-items class="hidden sm-and-down">
                    <v-btn>{{benutzername}}</v-btn>
                    <v-btn  @click="logout" >Logout</v-btn>
                </v-app-bar-items>
            </v-app-bar>
        
    </v-app>     
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
        localStorage.clear();
        this.$emit('update:isLoggedIn', false);
        this.$router.push({ name:'LogOut' }).catch(() => {});
        },

         
    },
    async mounted(){

        let user = await localStorage.getItem('user-info');
        this.benutzername = JSON.parse(user).benutzername;
             
        } 
      
};


</script>





