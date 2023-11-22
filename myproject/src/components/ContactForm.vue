<template>
  
  <p id="contact-text" >Du kannst uns einfach durch Kontaktformular erreichen. Wir freuen uns auf Dich!
  </p>
  
<!-- the submit.prevent will prevent the default submit behavior and execute onSubmit function as desired-->
<v-form ref="form" @submit.prevent="onSubmit">
  
    <v-text-field
     v-model="email"
      label="&#9993; E-Mail-Adresse"
      variant="outlined"
      :error-messages="emailErrors"
      :rules="emailRules " 
      clearable>
    </v-text-field>

    <v-text-field
        
        label="&#9993; Email-Adresse Wiederholen"
        variant="outlined"
        type="email"
        v-model="confirmEmail"
        :error-messages="confirmEmailErrors"
        :rules="confirmEmailRules"
        clearable >
    </v-text-field>
 
  <v-text-field
    
    label="&#9990;  Telefonnummer"
    type="tel"
    v-model="phone"
    variant="outlined" 
    :error-messages="phoneNumberErrors"
    :rules="phoneNumberRules"
    clearable>
  </v-text-field>
  <v-autocomplete
         
         v-model="bundesland"
         :rules="[() => !!bundesland || 'erforderliches Feld']"
         :items="bundesländer"
         label=" Bundesland "
         variant="outlined"
         required
       ></v-autocomplete>
       

  <!-- überprüfen, ob `message` definiert ist, bevor du auf die `length`-Eigenschaft zugreifst. -->
  <v-textarea 
  
    label="&#9998;  Nachricht schreiben "
    type="text"
    variant="outlined"
    v-model="message"
    :error-messages="messageErrors"
    :rules="messageRules"
    counter="1000"
    :counter-value="message ? message.length + '/' + 1000 : '0/1000'"
    clearable>
  </v-textarea>
  <v-btn class="contactform-btn" 
  @click="checkEmail();checkConfirmEmail();checkPhoneNumber();checkMessage(),onSubmit()" 
  type="submit"  :disabled="false">Absenden</v-btn>
  
</v-form>

<div v-if="showMessageBox" class="message">
    <p v-if ="showMessageBox" v-html="messageContent"></p>
    
    <v-btn v-if="showButton" class="confirmation-buttonJa"  @click="reset">Vorgang beenden</v-btn>
</div>

</template>

<script>
import axios from "axios";

export default {

name:'contactForm',

data() {
  return {
    bundesländer:[
      "Baden-Württemberg",
      "Bayern",
      "Berlin",
      "Brandenburg",
      "Bremen",
      "Hamburg",
      "Hessen",
      "Mecklenburg-Vorpommern",
      "Niedersachsen",
      "Nordrhein-Westfalen",
      "Rheinland-Pfalz",
      "Saarland",
      "Sachsen",
      "Sachsen-Anhalt",
      "Schleswig-Holstein",
      "Thüringen"],
    bundesland:"",
    email: "",
    confirmEmail: "",
    phone: "",
    message: "",
    messageContent: '',
    showMessageBox:false,
    name:"",
    
    emailRules:[v => !!v || 'erforderliches Feld' , v => /.+@.+\..+/.test(v),v => /\.[a-zA-Z]{2,10}$/.test(v)],
    confirmEmailRules: [v => !!v || 'erforderliches Feld', v => v === this.email],
    phoneNumberRules: [v => !!v || 'erforderliches Feld', v => /^[0-9]{12}$/.test(v)],
    messageRules: [v => !!v || 'erforderliches Feld'],

    emailErrors: [],
    confirmEmailErrors: [],
    phoneNumberErrors: [],
    messageErrors: [],
    isEmailValid: false,
    isConfirmEmailValid: false,
    isPhoneNumberValid: false,
    isMessageValid: false,
    showButton:false,
         
          
  };
},

async mounted(){

          let user = localStorage.getItem('user-info')
          user = JSON.parse(user);
          this.name = await user.name;
              if(user) {
              this.isLoggedIn = true;
              }  
      },

methods: {

reset(){
  this.email= "";
  this.bundesland="",
    
    this.confirmEmail="",
    this.phone= "",
    this.message= "",
    
  this.$refs.form.reset();
 
  this.showMessageBox=false;
},

  showMessage(content,showButton) {
    this.messageContent = content;
    this.showButton = showButton;
  },
  
  checkEmail() {
      this.emailErrors = []
      for (let rule of this.emailRules) {
        let isEmailValid = rule(this.email);
        
        if (!isEmailValid) {
          this.emailErrors.push("Ungültige Email-Adresse ")
        }
        
        this.isEmailValid = isEmailValid;
      }
      console.warn("email", this.isEmailValid);
      return this.isEmailValid;
    },

  checkConfirmEmail() {
      this.confirmEmailErrors = []
      for (let rule of this.confirmEmailRules) {
        let isConfirmEmailValid =  rule(this.confirmEmail);
        if (!isConfirmEmailValid) {
          this.confirmEmailErrors.push("Email-Wiederholung stimmt mit der Email nicht überein")
      }
      this.isConfirmEmailValid = isConfirmEmailValid;
      }
      console.warn("confirm email", this.isConfirmEmailValid);
      return this.isConfirmEmailValid;
    },

  checkPhoneNumber() {
  this.phoneNumberErrors = [];
  for (let rule of this.phoneNumberRules) {
    let isPhoneNumberValid = rule(this.phone);
    if (!isPhoneNumberValid) {
          this.phoneNumberErrors.push("Ungültige Telefonnummer")
        }
        
        this.isPhoneNumberValid = isPhoneNumberValid;
      }
      console.warn("Telefon", this.isPhoneNumberValid);
      return this.isPhoneNumberValid;
    },

  checkMessage() {
    this.messageErrors = [];
    for (let rule of this.messageRules) {
      let isMessageValid = rule(this.message);
      if (!isMessageValid) {
          this.messageErrors.push("Nachricht ist Erfordelich")
        }
        
        this.isMessageValid = isMessageValid;
      }
      console.warn("Nachricht", this.isMessageValid);
      return this.isMessageValid;
    },

   
  async onSubmit() {
    if(this.isEmailValid===true && this.isConfirmEmailValid===true &&
    this.isPhoneNumberValid===true && this.isMessageValid===true ){

    // Create a new contact object with the form data
    const newContact = {
      datumZeit: new Date().toString(),
      email: this.email,
      phone: this.phone,
      message: this.message,
      name: this.name,
      state: this.bundesland,
    };
    // Send a POST request to the db.json file with the new contact object
    await axios.post(`http://localhost:3000/contacts`, newContact).then(() => {
        // Show a success message
        this.showMessageBox = true;
        let content = "Ihre Nachricht wurde erfolgreich gesendet!";
        this.showMessage(content,true);
      
      })}
    

  }

}
};
</script>