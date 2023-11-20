<template> 
  <div class="app-container"> 
    <v-app id="gallery-app" >
      <HeaderLogedIn v-if="isLoggedIn" /><HeaderHome v-else />
        <v-container  class="gallery">
    
            
            <v-form ref="form" class="formContainer-login">
              <p class="text-in-form">Anmelden</p>
              <v-text-field
                label="Benutzername"
                variant="outlined"
                theme="dark"
                type="text"
                v-model="loginBenutzername"
                ref="loginBenutzername"
                :error-messages="failedAttemptsErrors"
            
              >
              
              </v-text-field>
              
              <v-text-field 
                
                label="Passwort"
                variant="outlined"
                theme="dark"
                :type="showPassword ? 'text' : 'password'"
                v-model="loginPassword"
                ref="loginPassword"
                :error-messages="loginErrors"
              >
              
                <template v-slot:append-inner>
                  <v-icon  @click="showPassword = !showPassword">
                    {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}
                  </v-icon>
                </template>
              
              </v-text-field>
              <v-btn :disabled="loginDisabled" class="login-btn" @click="login"> Login </v-btn>
              
            </v-form>
              
              <p class="form-text">Oder noch kein Konto? Jetzt registrieren</p>
                
          
  
      <v-form ref="form" class="formContainer-register">
        <p class="text-in-form">Konto erstellen</p>
        <v-text-field
          label="Name"
          variant="outlined"
          theme="dark"
          
          type="text"
          v-model="name"
           
           :error-messages="nameErrors"
          :rules="nameRules"  >
        </v-text-field>
  
        <v-text-field
          label="Email"
          variant="outlined"
          theme="dark"
          type="email"
          v-model="email"
          :error-messages="emailErrors"
          :rules="emailRules"  >
        </v-text-field>
           
        <v-text-field
          label="Email Wiederholen"
          variant="outlined"
          theme="dark"
          type="email"
          v-model="confirmEmail"
          :error-messages="confirmEmailErrors"
          :rules="confirmEmailRules"  >
        </v-text-field>
       
        <v-text-field
          label="Benutzername"
          variant="outlined"
          theme="dark"
          type="text"
          v-model="benutzername"
          :error-messages="benutzernameErrors"
          :rules="benutzernameRules"  >
        </v-text-field>
        
        <v-text-field 
          label="Passwort"
          variant="outlined"
          theme="dark"
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          
          ref="password"
          :error-messages="passwordErrors"
          :rules="passwordRules"  
          >
          <template v-slot:append-inner>
            <v-btn class="strong-password" @click="generateStrongPassword">Starkes Passwort</v-btn>  
            <v-icon  id="eye" @click="showPassword =!showPassword">
              {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}
            </v-icon>   
          </template>
          </v-text-field>
          
           <v-text-field 
            label="Passwort wiederholen"
            variant="outlined"
            theme="dark"
            :type="showPasswordWiederholen ? 'text' : 'password'"
            v-model="passwordWiederholen"
            ref="passwordWiederholen"
            :error-messages="passwordWiederholenErrors"
            :rules="passwordWiederholenRules" 
        >
            <template v-slot:append-inner>
                  <v-icon  @click="showPasswordWiederholen =! showPasswordWiederholen">
                    {{ showPasswordWiederholen ? 'mdi-eye' : 'mdi-eye-off' }}
                  </v-icon>
            </template>
        </v-text-field>

        <v-card class="card-form">
            <v-card-title>Tipps für Starkes Passwort:</v-card-title>
            <v-card-text> Im Eingabefeld "Passwort" auf dem Knopf "starkes Passwort" klicken, um automatisch und zufällig ein starkes Passwort generieren zu lassen. Alternative kannst Du auch eigenes Passwort mit folgenden Regeln verwenden:<br/> mind. 8 Charakter lang, mind. einen Großbuchstaben und einen Kleinbuchstaben, mind. ein Sonderzeichen.Viel Erfolg</v-card-text>
          </v-card>

        <v-btn class="login-btn" @click="checkBenutzername();checkPassword();checkName();checkEmail();checkEmailUnique();checkConfirmEmail();signUp()">Registrieren</v-btn>
      </v-form> 

        </v-container > 
        
        <FooterComponent/> 
      </v-app >
  </div >   
</template>


<script>

  import HeaderLogedIn from './HeaderLogedIn.vue'
  import HeaderHome from './HeaderHome.vue'
  import FooterComponent from './FooterComponent.vue'
  
  import axios from "axios"
  import generatePassword from '../plugins/pwGenerator.js'

  export default {

    name: "LoginPage",

    components: {
      HeaderLogedIn,
      HeaderHome,
      
      FooterComponent
      
    },

    data() {
      return {
        benutzername: "",
        loginBenutzername:"",
        password: "",
        loginPassword:"",
        showPassword: false, 
        loginDisabled:false,
        passwordWiederholen:"",
        showPasswordWiederholen:false,
        failedAttempts: 0,
        starkesPassword:generatePassword(),
            name:'',
            email:'',
            confirmEmail:'',
            failedAttemptsErrors:[],
            loginErrors:[],
            nameErrors: [],
            emailErrors: [],
            confirmEmailErrors: [],
            benutzernameErrors: [],
            passwordErrors: [],
            passwordWiederholenErrors:[],
            isNameValid: false,
            isEmailValid: false,
            isEmailUnique: false,
            isConfirmEmailValid: false,
            isBenutzernameGültig: false,
            isPasswordValid: false,
            nameRules: [v => !!v ,v => /^[A-Za-zäöüÄÖÜß.]{2,}( [A-Za-zäöüÄÖÜß.]{2,})* ?$/.test(v)],
            emailRules:[v => !!v , v => /.+@.+\..+/.test(v),v => /\.[a-zA-Z]{2,10}$/.test(v)],
            confirmEmailRules: [v => !!v , v => v === this.email],
            benutzernameRules:[v => !!v ],
            passwordRules: [ 
              v => !!v , 
              v => (v && v.length >= 8) , 
              v => /(?=.*[a-z])/.test(v) , 
              v => /(?=.*[A-Z])/.test(v) , 
              v => /(?=.*[0-9])/.test(v), 
              v => /(?=.*[#?!@$+_%^&:.=*~^§|{}(),;-])/.test(v)  
            ],
            passwordWiederholenRules:[v=> !!v , 
            v => v === this.password ]



      };
    },
   
    methods: {

    

      async login() {

         console.log("Benutzername: ", this.loginBenutzername);
         console.log("Passwort: ", this.loginPassword);
        let result = await axios.get(`http://localhost:3000/users`, {
          params: {
            benutzername: this.loginBenutzername,
            password: this.loginPassword
          }
        });
         console.log("Ergebnis: ", result);
        if(result.status == 200 && result.data.length > 0) {
              localStorage.setItem("user-info", JSON.stringify(result.data[0]));
              if(this.loginBenutzername==="Admin"){
                this.$router.push({name:'AdminDashboard'});
                 
              }else if(this.loginBenutzername==="Berater"){
                this.$router.push({name:'ConsultantPage'}); 
                }
              
              else{
                  let lastPath = localStorage.getItem('lastPath') 
                  if (lastPath) { 
                    this.$router.push(lastPath)
                  }else{
                  this.$router.push({name:'HomePage'});
                  }
              }
            
        }else {
            this.failedAttempts++;

            if (this.failedAttempts >= 3) {
           
              this.failedAttemptsErrors = []
              this.failedAttemptsErrors.push("Sie haben Ihre Anmeldeversuche überschritten! Bitte laden Sie die Seite neu, um es erneut zu versuchen.")
              this.loginDisabled = true; 

            }else{
              this. loginErrors= []
              this.loginErrors.push(`Falsches Benutzername oder Passwort! Sie haben noch ${3 - this.failedAttempts} Versuche.`)
            
            }
          }

        console.warn(result);
      },

      generateStrongPassword() {
        this.strongPassword = generatePassword();
        this.password = this.strongPassword;
        this.passwordWiederholen = this.strongPassword;
      },

      checkName() {
        this.nameErrors = []
        for (let rule of this.nameRules) {
          let isNameValid = rule(this.name);
          if (!isNameValid) {
            this.nameErrors.push("Name ist erforderlich und muss mindestens 3 Zeichen lang sein.")
          }
          this.isNameValid = isNameValid;
        }
        console.warn("name", this.isNameValid);
        return this.isNameValid;
      },

      checkEmail() {
        this.emailErrors = []
        for (let rule of this.emailRules) {
          let isEmailValid = rule(this.email);
          
          if (!isEmailValid) {
            this.emailErrors.push("Email ist erforderlich und muss gültig sein.")
          }
          
          this.isEmailValid = isEmailValid;
        }
        console.warn("email", this.isEmailValid);
        return this.isEmailValid;
      },

      checkConfirmEmail() {
        this.confirmEmailErrors = []
        for (let rule of this.confirmEmailRules) {
          let isConfirmEmailValid = rule(this.confirmEmail);
          if (!isConfirmEmailValid) {
            this.confirmEmailErrors.push("Email Wiederholen ist erforderlich und muss mit Email übereinstimmen.")
        }
        this.isConfirmEmailValid = isConfirmEmailValid;
        }
        console.warn("confirm email", this.isConfirmEmailValid);
        return this.isConfirmEmailValid;
      },

      async checkBenutzername() {
        this.benutzernameErrors = []
        for (let rule of this.benutzernameRules) {
          
          let isBenutzernameGültig = rule(this.benutzername);
          if (!isBenutzernameGültig) {
            this.benutzernameErrors.push("Benutzername erforderlich!")
          }
        }
        try {
          if(this.benutzername){
              let response = await axios.get("http://localhost:3000/users");
               if (response.data.find(user => user.benutzername === this.benutzername)) {
                  this.benutzernameErrors.push("Dieser Benutzername ist bereits vergeben. ");
                  this.isBenutzernameGültig = false;
                }
                else{
                   this.isBenutzernameGültig = true;
                  }
        
          }
        }catch (error) {
            console.log(error);
          }
        console.warn("bn",this.isBenutzernameGültig);
        return this.isBenutzernameGültig;
      },

      async checkEmailUnique() {
        this.emailErrors = []
        try {
          if(this.email){
              let response = await axios.get("http://localhost:3000/users");
               if (response.data.find(user => user.email === this.email)) {
                   this.emailErrors.push("Diese Email ist bereits vorhanden. Bitte wählen Sie eine andere.");
                    
                  this.isEmailUnique = false;
                }
                else{
                   this.isEmailUnique = true;
                  }
        
          }
        }catch (error) {
            console.log(error);
          }
        console.warn("email",this.isEmailUnique);
        return this.isEmailUnique;
      },


      checkPassword() {
          this.passwordErrors = []
          for (let rule of this.passwordRules) { 
          let isPasswordValid = rule(this.password); 
          if (!isPasswordValid) {
            this.passwordErrors.push("gültiges Passwort erforderlich!")
          }
          this.isPasswordValid = isPasswordValid;
          }
          console.warn("pw",this.isPasswordValid);
          return this.isPasswordValid; 
        },

        checkPasswordConfirm() {
          this.passwordWiederholenErrors = []
          for (let rule of this.passwordWiederholenRules) { 
          let isPasswordConfirmValid =  rule(this.passwordWiederholen); 
          if (!isPasswordConfirmValid) {
            this.passwordWiederholenErrors.push("Ihre Eingabe muss mit Ihrem Passwort übereinstimmen!")
          }
          this.isPasswordConfirmValid = isPasswordConfirmValid;
          }
          console.warn("pwConfirm",this.isPasswordConfirmValid);
          return this.isPasswordConfirmValid; 
        },


      async signUp(){
        let isBenutzernameGültig = this.checkBenutzername();
        let isPasswordValid = this.checkPassword();
        let isNameValid = this.checkName();
        let isEmailValid =  this.checkEmail();
        let isEmailUnique = this.checkEmailUnique();
        let isConfirmEmailValid =  this.checkConfirmEmail();
        let isPasswordConfirmValid =  this.checkPasswordConfirm();

        if(isPasswordValid===true && isPasswordConfirmValid===true && isBenutzernameGültig===true && isNameValid===true && isEmailValid===true && isEmailUnique===true && isConfirmEmailValid===true){
            
              let result = await axios.post("http://localhost:3000/users", {
                name:this.name,
                email:this.email,
                benutzername:this.benutzername,
                password:this.password
              });

              console.warn("user",result);
              
              if(result.status==201){
            
                localStorage.setItem("user-info",JSON.stringify(result.data))
                let lastPath = localStorage.getItem('lastPath') 
                  if (lastPath) { 
                    this.$router.push(lastPath)
                  }else{
                  this.$router.push({name:'HomePage'});
                  }
              }
        } 
        
        
      },

       

        
   },

    

    
    mounted() {
      
      let user = localStorage.getItem("user-info");
      if(user){
          if (this.benutzername==="Admin") {
          this.$router.push({ name: 'AdminDashboard' });
          }
          else {
            let lastPath = localStorage.getItem('lastPath')
            if (lastPath) { 
                    this.$router.push(lastPath)
            }else{
                this.$router.push({name:'HomePage'});
              }
          }
    }
  }
}

</script>
