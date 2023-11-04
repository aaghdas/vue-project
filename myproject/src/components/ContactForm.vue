<template>
  
    <p id="contact-text" >Du kannst uns einfach durch Kontaktformular erreichen. Wir freuen uns auf Dich!
    </p>
    
  
  <v-form  v-model="valid" @submit.prevent="onSubmit">
   
    <v-text-field 
     onkeydown="return event.key != 'Enter';"
      label="E-Mail-Adresse"
      type="email"
      v-model="email"
      variant="outlined"
      
      >
      </v-text-field>
   
    <v-text-field 
      onkeydown="return event.key != 'Enter';"
      label="Telefonnummer"
      type="tel"
      v-model="phone"
      variant="outlined" 
      >
      </v-text-field>

    <v-textarea 
      label="Ihre Nachricht"
      type="text"
      variant="outlined"
      v-model="message">
    </v-textarea>
    <v-btn class="contactform-btn" type="submit"  :disabled="false">Absenden</v-btn>
  </v-form>
  <p v-if ="showMessageBox" class="messageform" v-html="messageContent"></p>
</template>

<script>
import axios from "axios";

export default {

  name:'contactForm',

  data() {
    return {
      valid: false,
      email: "",
      phone: "",
      message: "",
      messageContent: '',
      showMessageBox:false,
      name:""
     
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

    showMessage(content) {
      this.messageContent = content;
    },

    onSubmit() {
      // Create a new contact object with the form data
      const newContact = {
        datumZeit: new Date().toString(),
        email: this.email,
        phone: this.phone,
        message: this.message,
        name: this.name
      };
      // Send a POST request to the db.json file with the new contact object
      axios.post(`http://localhost:3000/contacts`, newContact).then(() => {
          // Show a success message
          this.showMessageBox = true;
          let content = "Ihre Nachricht wurde erfolgreich gesendet!";
          this.showMessage(content);
          // Clear the form fields
          this.email = "";
          this.phone = "";
          this.message = "";
        })
        .catch(() => {
          // Show an error message
          alert("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        });
    },
  },

 
};
</script>
