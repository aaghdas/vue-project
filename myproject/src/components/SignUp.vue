<template>
  
  
  <h1 id="formSignUp">Neues Konto erstellen</h1>
      <v-form ref="form" >
        <v-text-field
          label="Name"
          type="text"
          v-model="name"
          :rules="nameRules">
        </v-text-field>
  
        <v-text-field
          label="Email"
          type="email"
          v-model="email"
          :rules="emailRules">
        </v-text-field>
           
        <v-text-field
          label="Email Wiederholen"
          type="email"
          v-model="confirmEmail"
          :rules="confirmEmailRules">
        </v-text-field>
       
        <v-text-field
          label="Benutzername"
          type="text"
          v-model="benutzername"
          :rules="benutzernameRules">
        </v-text-field>
        
        <v-text-field 
          label="Passwort"
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          @click="checkBenutzername"
          ref="password"
          :rules="passwordRules"
          >
          <template v-slot:append-inner>
            <v-btn @click="showAlert">Starkes Passwort</v-btn>  
            <v-icon  id="eye" @click="showPassword =!showPassword">
              {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}
            </v-icon>
          </template>
        </v-text-field>
             
           
        <v-btn color="primary" @click="checkBenutzername();checkPassword();checkName();checkEmail();checkEmailUnique();checkConfirmEmail();signUp()">Neues Konto</v-btn>
      </v-form> 
     
</template>



<script>
import axios from 'axios'
import generatePassword from '../plugins/pwGenerator.js'



export default{

    name:'SignUp',

    data(){
        return{
            starkesPassword:generatePassword(),
            name:'',
            email:'',
            confirmEmail:'',
            benutzername:'',
            password:'',
            isNameValid: false,
            isEmailValid: false,
            isEmailUnique: false,
            isConfirmEmailValid: false,
            isBenutzernameGültig: false,
            isPasswordValid: false,
            showPassword: false, 
            nameRules: [v => !!v ,v => /^[A-Za-zäöüÄÖÜß.]{2,}( [A-Za-zäöüÄÖÜß.]{2,})* ?$/.test(v)],
            emailRules:[v => !!v , v => /.+@.+\..+/.test(v)],
            confirmEmailRules: [v => !!v , v => v === this.email],
            benutzernameRules:[v => !!v || 'Benutzername ist erforderlich'],
            passwordRules: [ 
              v => !!v || 'Passwort ist erforderlich', 
              v => (v && v.length >= 8) , 
              v => /(?=.*[a-z])/.test(v) , 
              v => /(?=.*[A-Z])/.test(v) , 
              v => /(?=.*[0-9])/.test(v), 
              v => /(?=.*[#?!@$+_%^&:.=*~^§|{}(),;-])/.test(v)  
            ]
        };
        
    },

   
    methods:{

      async checkName() {
        for (let rule of this.nameRules) {
          let isNameValid = await rule(this.name);
          this.isNameValid = isNameValid;
        }
        console.warn("name", this.isNameValid);
        return this.isNameValid;
      },

      async checkEmail() {
        for (let rule of this.emailRules) {
          let isEmailValid = await rule(this.email);
          this.isEmailValid = isEmailValid;
        }
        console.warn("email", this.isEmailValid);
        return this.isEmailValid;
      },

      async checkConfirmEmail() {
        for (let rule of this.confirmEmailRules) {
          let isConfirmEmailValid = await rule(this.confirmEmail);
          this.isConfirmEmailValid = isConfirmEmailValid;
        }
        console.warn("confirm email", this.isConfirmEmailValid);
        return this.isConfirmEmailValid;
      },

      async checkBenutzername() {
        try {
          if(this.benutzername){
              let response = await axios.get("http://localhost:3000/users");
               if (response.data.find(user => user.benutzername === this.benutzername)) {
                  this.$swal({
                    text: "Dieser Benutzername ist bereits vergeben. Bitte wählen Sie einen anderen.",
                    });
                  this.isBenutzernameGültig = false;
                }
                else{
                   this.isBenutzernameGültig = true;
                  }
        
          }else{
              alert("benutzername erforderlich")
            }
        }catch (error) {
            console.log(error);
          }
        console.warn("bn",this.isBenutzernameGültig);
        return this.isBenutzernameGültig;
      },

      async checkEmailUnique() {
        try {
          if(this.email){
              let response = await axios.get("http://localhost:3000/users");
               if (response.data.find(user => user.email === this.email)) {
                  this.$swal({
                    text: "Diese Email ist bereits vergeben. Bitte wählen Sie einen anderen.",
                    });
                  this.isEmailUnique = false;
                }
                else{
                   this.isEmailUnique = true;
                  }
        
          }else{
              alert("Email erforderlich")
            }
        }catch (error) {
            console.log(error);
          }
        console.warn("email",this.isEmailUnique);
        return this.isEmailUnique;
      },


      async checkPassword() {
          
          for (let rule of this.passwordRules) { 
          let isPasswordValid = await rule(this.password); 
          this.isPasswordValid = isPasswordValid;
          }
          console.warn("pw",this.isPasswordValid);
          return this.isPasswordValid; 
        },


      async signUp(){
        let isBenutzernameGültig = await this.checkBenutzername();
        let isPasswordValid = await this.checkPassword();
        let isNameValid = await this.checkName();
        let isEmailValid = await this.checkEmail();
        let isEmailUnique = await this.checkEmailUnique();
        let isConfirmEmailValid = await this.checkConfirmEmail();

        if(isPasswordValid===true && isBenutzernameGültig===true && isNameValid===true && isEmailValid===true && isEmailUnique===true && isConfirmEmailValid===true){
            
              let result = await axios.post("http://localhost:3000/users", {
                name:this.name,
                email:this.email,
                benutzername:this.benutzername,
                password:this.password
              });

              console.warn("user",result);
              if(result.status==201){
            
                localStorage.setItem("user-info",JSON.stringify(result.data))
                this.$router.push({name:'HomePage'})
              }
        } 
        else if(isBenutzernameGültig===false){
          alert("Dieser Benutzername ist bereits vergeben. Bitte wählen Sie einen anderen.");
          
        }else if(isPasswordValid===false){
            alert("Ungültiges Passwort! Passwort muss mindestens 8 Zeichen lang sein, mindestens einen Kleinbuchstaben, mindestens einen Großbuchstaben, mindestens eine Ziffer und mindestens ein Sonderzeichen enthalten.");
        }else if(isNameValid===false){
            alert("Ungültiger Name! Name ist erforderlich und muss mindestens 3 Zeichen lang sein.");
        }else if(isEmailValid===false){
            alert("Ungültige Email! Email ist erforderlich und muss gültig sein.");
        }else if(isConfirmEmailValid===false){
            alert("Ungültige Email Wiederholen! Email Wiederholen ist erforderlich und muss mit Email übereinstimmen.");
        }
        
      },

       

        showAlert() {
      
            this.$swal({
              
              text: ` ${this.starkesPassword}.`,
              width: '20%',
              heightAuto:true,
              padding:'0px',
              
              showCancelButton: true,
              confirmButtonText: "Starkes Passwort",
              cancelButtonText: "Eigenes Passwort",
            })
            .then((result) => {
              
                if (result.isConfirmed) {
                    this.password = this.starkesPassword;
                }  
                else{
                  this.$swal.close();
                }  
            });
        }
   },

    
}
</script>
