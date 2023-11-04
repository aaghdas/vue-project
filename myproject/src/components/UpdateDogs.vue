<template>
    <HeaderHome />
    <h1> Hallo User, willkommen in Update Dogs Page</h1>
</template>

<script>
import HeaderHome from './HeaderHome.vue'
export default{
    name:'UpdateDogs',
    components:{
        HeaderHome
    },

    mounted(){
        let user = localStorage.getItem('user-info');
        if(!user){
            this.$router.push({name:'SignUp'})
        }
    }

}

</script>