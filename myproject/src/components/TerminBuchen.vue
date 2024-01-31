<template>

  
    
    <div class="calandar-container">
        <p id="contact-text">
          Hier kannst Du bequem den Termin für Dein erstes Beratungsgespräch buchen und Dich von unseren erfahrenen Experten kostenlos beraten lassen!
          Wir können dann Dir einen Hund aus unserem Tierheim vorstellen, der ein neues Zuhause sucht und Dir am besten passt. 
        </p >

       
        
        <div class="termin">
          <input  type="text" id="datepicker" ref="datepicker" @input= "checkBooked" placeholder="Datum Auswählen">
        </div>


        <div class="termin" v-if="timeSlots.length > 0">
                    <select size="4" class="termin-zeit" id="time" v-model="selectedTime"  >
                    
                      <option class="zeitwahl" value="1" >Zeit Auswählen &#128338;</option>
                      <option class="zeitwahl" v-for="time in timeSlots" :value="time.start" :key="time.start" :disabled="time.booked">{{ time.start }} - {{ time.end }}
                        <span v-if="time.booked===true">  Nicht verfügbar</span>
                      </option>
                    </select>
        </div>
            
            <v-btn class="termin-absenden" v-if="!showMessageBox" @click="confirmBooking">Termin Buchen</v-btn>
       
            <div v-if="showMessageBox" class="message">
              <p v-html="messageContent"></p>
              <v-btn v-if="showConfirmButton" @click="bookConfirmed" class="confirmation-buttonJa">Bestätigen</v-btn>
              <v-btn v-if="showConfirmButton" @click="hideMessageBox" class="confirmation-buttonNein">Abbrechen</v-btn>
              <v-btn v-if="showCloseButton" @click="close" class="close-button">Vorgang beenden</v-btn>
              <v-btn v-if="showNextButton" @click="close" class="close-button">Buchung fortfahren</v-btn>
            </div>
    </div> 
    <p class="form-text">Oder möchteuns du uns kontaktieren?</p>   
   <div class="contact-container-termin">
      <contactForm /> 
    </div>
 
</template>

<script>

import ContactForm from './ContactForm.vue'

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import axios from 'axios';

export default {
  name:'TerminBuchen',

  components: {
    ContactForm,
    
  },

  data() {
    return {
      startDate: new Date(),
      numOfDays: 364,
      timeSlots: [
        { start: '10:00', end: '11:00', booked: false },
        { start: '11:00', end: '12:00', booked: false },
        { start: '12:00', end: '13:00', booked: false },
        { start: '13:00', end: '14:00', booked: false },
        { start: '14:00', end: '15:00', booked: false },
        { start: '15:00', end: '16:00', booked: false },
        { start: '16:00', end: '17:00', booked: false },
        { start: '17:00', end: '18:00', booked: false },
      ],
      selectedTime: '',
      dateOptions: [],
      selectedDate: '',
      selectedDateOption: '',
      showMessageBox: false,
      showConfirmButton: false,
      showCloseButton: false,
      showNextButton:false,
      messageContent: '',
      timeBooked: false,
      disableList: [], 
      mobile: false,
      windowWidth: null,
      name:"",

      
    };
  },

   async mounted() {

    let user = localStorage.getItem('user-info')
    user = JSON.parse(user);
    this.name = await user.name;
    
    for (let i = 0; i < this.numOfDays; i++) {
      const date = new Date(this.startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().slice(0, 10);
      const timeSlots = [
        { start: '10:00', end: '11:00', booked: false },
        { start: '11:00', end: '12:00', booked: false },
        { start: '12:00', end: '13:00', booked: false },
      ].map(slot => ({ ...slot, selected: false }));
      this.dateOptions.push({ date: dateStr, timeSlots });
    }
   },

   beforeMount () {
   
    async function dl() {
        let disableList =[];
        let response = await axios.get('http://localhost:3000/disable');
        let disableListFromApi = response.data.map(item => new Date(item.date));
        disableList = disableList.concat(disableListFromApi);
        console.log(disableList); // Zur Bestätigung, dass beide Datumsangaben enthalten sind
        return disableList;
  }

  dl().then(disableList => {
   
  let fp =  flatpickr(this.$refs.datepicker, {
      altInput: true,
      
      altFormat: "F j, Y",
      dateFormat: 'Y-m-d',
      inline:true,
      static:true,
      minDate: this.startDate.getTime() + 86400000,
      disable: disableList, 
     
      onClose: (selectedDates) => {
        if (selectedDates.length === 0) return;
        const selectedDate = selectedDates[0].toISOString().slice(0, 10);
        this.selectedDateOption = this.dateOptions.find(option => option.date === selectedDate);
      },
    });
    fp.set('disable', disableList);
    });
    
  },

  

  methods: {
    checkCustomerName() {
    // Debug-Ausgabe, um sicherzustellen, dass der Name aktualisiert wird
    console.log(this.customerName);
  },
      async isDisabled(date) { 
      
        let result = await this.searchDate(date);
        if (Array.isArray(result) && result.length > 2){
            axios.post(`http://localhost:3000/disable`, {
             date,
            });
        }
      }, 

      async booked(date, start) {
        // Rufen Sie die Daten vom Server ab
        const response = await axios.get(`http://localhost:3000/dates?date=${date}&start=${start}`);
        // Initialisieren Sie eine Variable für den Wert von booked
        let booked = false;
        // Überprüfen Sie, ob die Antwort leer ist oder nicht
        if (response.data.length > 0) {
          // Wenn nicht, lesen Sie den Wert von booked für das erste Element in der Antwort
          booked = response.data[0].booked;
        }
        // Geben Sie den Wert von booked zurück oder zeigen Sie ihn an
        return booked;
        
      },

     async checkBooked(){
      for (let time of this.timeSlots){
        // Rufen Sie die Methode booked auf und speichern Sie den Wert in einer Variablen
        let booked = await this.booked(this.$refs.datepicker.value,time.start);
        time.booked = booked; 
        
      }
    },

    async searchDate(date) {
    
        let url = `http://localhost:3000/dates?date=${date}`;
        const response = await axios.get(url);
        return response.data;
      
    },

    resetSelectedTimeSlots() {
      this.dateOptions.forEach(option => {
        option.timeSlots.forEach(slot => {
          slot.booked = false;
        });
      });
    },

    async confirmBooking() {
      const selectedDate = this.$refs.datepicker.value;
      let selectedDateOption = this.dateOptions.find(option => option.date === selectedDate);
      
      let selectedTimeSlot; //let hat Blockscope und muss vor dem if-block deklariert werden.
      if (selectedDateOption) { // Nur wenn selectedDateOption existiert, können wir auf seine Eigenschaften zugreifen
        selectedTimeSlot = selectedDateOption.timeSlots.find(slot => slot.start === this.selectedTime); 
      }

      if (!selectedDate || !selectedDateOption || !selectedTimeSlot) {
        const content = 'Bitte wählen Sie ein verfügbares Datum und eine verfügbare Zeit aus.';
        this.showMessage(content,false,false,true);
        return;
      } else{
        let content = `Möchten Sie den Termin am ${selectedDate} um ${selectedTimeSlot.start} Uhr buchen?`; // Hier verwenden wir selectedTimeSlot
        this.showMessage(content, true,false,false);
      }
    },



    

    bookConfirmed() {
    let selectedDate = this.$refs.datepicker.value;
      let selectedTimeSlot = this.selectedDateOption.timeSlots.find(slot => slot.start === this.selectedTime);
      
      axios.post(`http://localhost:3000/dates`, {
        date: selectedDate,
        start: selectedTimeSlot.start,
        end: selectedTimeSlot.end,
        booked: true,
        name: this.name
      }).then(() => {
        let content = `Termin am ${selectedDate} von ${selectedTimeSlot.start} - ${selectedTimeSlot.end} Uhr erfolgreich gebucht.`;
        this.showMessage(content, false,true,false);
        
        selectedTimeSlot.booked = true;
        this.resetSelectedTimeSlots();
        this.isDisabled(selectedDate);
      })

    },

    showMessage(content, confirmButton,closeButton,nextButton) {
      this.messageContent = content;
      this.showMessageBox = true;
      this.showConfirmButton = confirmButton;
      this.showCloseButton = closeButton;
      this.showNextButton = nextButton;
    },

    hideMessageBox() {
      this.showMessageBox = false;
      this.showConfirmButton = false;
      this.showCloseButton = false;
      this.showCloseButton = false;
      this.shownextButton = false;
      this.messageContent = '';
    },
    close(){
      this.$refs.datepicker._flatpickr.clear();
      this.selectedTime = '';
      this.selectedDateOption = null;
      this.hideMessageBox();

    },

    scrollTop() {
            const element = document.getElementById("contactScroll");
            element.scrollIntoView({ behavior: "smooth" });
            }
        }
   
      
};

</script>
