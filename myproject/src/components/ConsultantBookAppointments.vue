<template>
  <div class="app-container">
        <v-app id="app-appointment" >

          <HeaderConsultant/>

          <div class="calandar-container"> <!-- Container für den Kalender und die Terminbuchung -->
                  <p id="contact-text"> <!-- Textabschnitt, der den Benutzer durch den Buchungsprozess führt -->
                    Hier kannst Du bequem und schnell in vier einfachen Schritten einen Termin buchen. Name des Terminteilnehmers eingeben, Datum und Zeit auswählen und schließlich den ausgewählten Termin bestätigen.</p>
                 
                    <!-- Eingabefeld für Name des Terminteilnehmers -->
                  <v-text-field 
                    
                    label="Name des Teilnehmers" 
                    onkeydown="return event.key != 'Enter';"  
                    type="name"
                    v-model="name"  
                  > 
                      <!-- label: Beschriftung des Eingabefelds -->
                      <!-- v-model="name" bindet den Wert des Eingabefelds an die Variable "name" -->
                      <!-- onkeydown="return event.key != 'Enter';" verhindert das Absenden des Formulars mit der Eingabetaste -->
                  </v-text-field>
                  
                  <div class="termin"> <!-- Container für das Datumseingabefeld -->
                   
                    <!-- Das Eingabefeld greift auf dem datepicker zu (ref), ermöglicht dem Benutzer, ein Datum einzugeben und ruft bei jeder Eingabe die Funktion checkBooked auf, um die Verfügbarkeit des gewählten Termins zu überprüfen --> 
                    <input  type="text" id="datepicker" ref="datepicker" @input= "checkBooked" placeholder="Datum Auswählen">
                  </div>
                  
                  <!-- Überprüfen, ob Zeitschlitze vorhanden sind -->
                  <div class="termin" v-if="timeSlots.length > 0">  
                    <!-- v-model="selectedTime" bindet den Wert des <select>-Elements an die selectedTime-Eigenschaft der Vue-Instanz.
                    Wenn ein Benutzer eine Option in der Dropdown-Liste auswählt, wird der Wert dieser Option automatisch der 
                    selectedTime-Eigenschaft zugewiesen. Umgekehrt, wenn der Wert von selectedTime geändert wird, wird die Auswahl in der 
                    Dropdown-Liste entsprechend aktualisiert. -->
                              <select size="4" class="termin-zeit" id="time" v-model="selectedTime"  > <!-- Einen Auswahlliste erstellen -->
                              
                                <option class="zeitwahl" value="1" >Zeit Auswählen &#128338;</option>
                                <!-- Für die Optionen in select-Menü wird das Array timeSlots durchitteriert und Start- und Endzeit anzeigt.
                                Falls time.booked Eigenschaft für jeweiliges Element des Arrays timeSlots true ist, wird diese Option deaktiviert(disabled)   -->
                                <option class="zeitwahl" v-for="time in timeSlots" :value="time.start" :key="time.start" :disabled="time.booked">{{ time.start }} - {{ time.end }}
                                  <!--  vor den Optionen, bei denen time.booked den wert true hat, wird string nicht verfügbar angezeigt. -->
                                  <span v-if="time.booked===true">  Nicht verfügbar</span>
                                </option>
                              </select>
                  </div>
                      <!-- Einen Button zum Bestätigen der Buchung hinzufügen, beim klicken wird die Methode confirmBooking aufgerufen -->
                      <v-btn class="termin-absenden" v-if="!showMessageBox" @click="confirmBooking">Termin Buchen</v-btn>
                
                      <div v-if="showMessageBox" class="message">
                        <p v-html="messageContent"></p>
                        <!-- Einen Button zur Buchung hinzufügen, beim klicken wird die Methode bookConfirmed aufgerufen, wobei die tatsächtliche Buchung ausgeführt  -->
                        <v-btn v-if="showConfirmButton" @click="bookConfirmed" class="confirmation-buttonJa">Bestätigen</v-btn>
                        <v-btn v-if="showConfirmButton" @click="hideMessageBox" class="confirmation-buttonNein">Abbrechen</v-btn>
                        <v-btn v-if="showCloseButton" @click="close" class="close-button">Vorgang beenden</v-btn>
                        <v-btn v-if="showNextButton" @click="close" class="close-button">Buchung fortfahren</v-btn>
                      </div>
          </div> 
            <FooterComponent/>
        </v-app>
  </div>
</template>

<script>

import  HeaderConsultant from './HeaderConsultant.vue'
import  FooterComponent from './FooterComponent'
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import axios from 'axios';

export default{
 name:'ConsultantBookAppointments',

 components:{
   HeaderConsultant,
   FooterComponent
 },

 /* Die data-Funktion in Vue.js verwenden, um ein Objekt zurückzugeben.
Dieses Objekt enthält alle Eigenschaften, die in der Vue-Komponente verfolgt oder beobachtet werden sollen.
Diese Eigenschaften sind reaktiv, d.h. Vue erkennt die Änderungen an diesen Eigenschaften und die Komponente automatisch neu rendert, 
wenn sie geändert werden. */
 data() {
    return {
      startDate: new Date(),
      numOfDays: 364,
      timeSlots: [ // Eine Liste von verfügbaren Zeitschlitzen, jedes Element ist ein Zeitschlitz mit Start- und Endzeit sowie dem boolischen Variable booked.
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

  /* Die mounted-Lifecycle-Hook-Funktion in Vue.js verwenden, die aufgerufen wird, 
  unmittelbar nachdem die Komponente an den DOM angehängt wurde. 
  Da die Komponente nun eingebunden ist, können wir auf die Eigenschaften zugreifen, die zur Komponenteninstanz gehören */
   
  async mounted() {  //jedes mal beim Laden der Seite müssen die Daten über verfügare Datum und Zeit aktualisiert werden.
    
    //Diese Methode erstellt eine Liste von Datumsoptionen (dateOptions), wobei jede Option ein bestimmtes Datum und die zugehörigen Zeitschlitze enthält. 
    for (let i = 0; i < this.numOfDays; i++) {  // Diese Schleife läuft für die Anzahl der Tage, die in this.numOfDays definiert sind. Für jeden Tag wird eine Reihe von Operationen durchgeführt.
      const date = new Date(this.startDate);  // Ein neues Datum basierend auf dem Startdatum erstellen
      date.setDate(date.getDate() + i); // Das Datum um die aktuelle Schleifeniteration erhöhen.Das Datum wird um i Tage erhöht. 
      //date.getDate() gibt den Tag des Monats (zwischen 1 und 31) für das angegebene Datum zurück.
      const timeSlots = [ // Eine Liste von Zeitschlitzen erstellen
        { start: '10:00', end: '11:00', booked: false }, // Jeden Zeitschlitz mit Startzeit, Endzeit und Buchungsstatus definieren
        { start: '11:00', end: '12:00', booked: false },
        { start: '12:00', end: '13:00', booked: false },
      ].map(slot => ({ ...slot, selected: false })); // Jeden Zeitschlitz klonen und eine `selected`-Eigenschaft hinzufügen
      this.dateOptions.push({ date: dateStr, timeSlots }); // Das Datum und die zugehörigen Zeitschlitze zu den Datumsoptionen Array hinzufügen
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
      minDate: this.startDate,
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

  created(){
            window.addEventListener('resize',this.checkScreen);
            this.checkScreen();

        },

  methods: {
     
      checkScreen(){
                this.windowWidth = window.innerWidth;
                if(this.windowWidth <= 1180){
                    this.mobile = true;
                    return;
                }
                
                this.mobile = false;
                this.mobileNav= false;
                return;
                
            },


      async isDisabled(date) { 
      
        let result = await this.searchDate(date);
        if (Array.isArray(result) && result.length > 2){
           
            
            axios.post(`http://localhost:3000/disable`, {
             date,
            });
            

        }
      }, 

   

     async checkBooked(){
      for (let time of this.timeSlots){
        // Rufen Sie die Methode booked auf und speichern Sie den Wert in einer Variablen
        let booked = await this.booked(this.$refs.datepicker.value,time.start);
        time.booked = booked; 
        
      }
    },

    async booked(date, start) {
  // Ruft die Daten vom Server ab, mit get HTTP Anforderung
  const response = await axios.get(`http://localhost:3000/dates?date=${date}&start=${start}`);
  // Initialisieren Sie eine Variable für den Wert von booked
  let booked = false;
  // Überprüft, ob die Antwort leer ist oder nicht
  if (response.data.length > 0) {
    // den Wert von booked für das erste Element in der Antwort lesen
    booked = response.data[0].booked;
  }
  // Gibt den Wert von booked zurück 
  return booked;
  
},
    

    async searchDate(date) {
    
        let url = `http://localhost:3000/dates?date=${date}`;
        const response = await axios.get(url);
        return response.data;
      
    },

    selectTimeSlot(dateOption, timeSlot) {
      if (timeSlot.booked) return;
      timeSlot.selected = !timeSlot.selected;
      dateOption.selected = dateOption.timeSlots.some(slot => slot.selected);
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
const selectedDateOption = this.dateOptions.find(option => option.date === selectedDate);

let selectedTimeSlot; // Hier deklarieren wir selectedTimeSlot zum ersten Mal außerhalb der if-Anweisung

if (selectedDateOption) {
  // Nur wenn selectedDateOption existiert, können wir auf seine Eigenschaften zugreifen
  selectedTimeSlot = selectedDateOption.timeSlots.find(slot => slot.start === this.selectedTime); // Hier weisen wir selectedTimeSlot einen Wert zu
  // ...
}

if (!selectedDate || !selectedDateOption || !selectedTimeSlot) {
  const content = 'Bitte wählen Sie ein verfügbares Datum und eine verfügbare Zeit aus.';
  this.showMessage(content,false,false,true);
  return;
}

else{
  let content = `Möchten Sie den Termin am ${selectedDate} um ${selectedTimeSlot.start} Uhr buchen?`; // Hier verwenden wir selectedTimeSlot
  this.showMessage(content, true,false,false);
}



    },

    bookConfirmed() {
      const selectedDate = this.$refs.datepicker.value;
      const selectedTimeSlot = this.selectedDateOption.timeSlots.find(slot => slot.start === this.selectedTime);

      axios.post(`http://localhost:3000/dates`, {
        date: selectedDate,
        start: selectedTimeSlot.start,
        end: selectedTimeSlot.end,
        booked: true,
        name:this.name
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


 <!-- Die Zeile onkeydown="return event.key != 'Enter';" ist ein Event-Handler in JavaScript, der auf das Drücken einer Taste reagiert (onkeydown).
event.key gibt den Wert der Taste zurück, die gedrückt wurde.

event.key != 'Enter' überprüft, ob die gedrückte Taste NICHT die Eingabetaste (Enter) ist.

return event.key != 'Enter'; gibt true zurück, wenn eine andere Taste als die Eingabetaste gedrückt wurde, 
und false, wenn die Eingabetaste gedrückt wurde.

  Wenn der Ausdruck event.key != 'Enter' true ergibt (d.h., die gedrückte Taste ist nicht die Enter), 
wird das keydown-Ereignis normal ausgeführt und die gedrückte Taste wird im Eingabefeld angezeigt.
  Wenn der Ausdruck event.key != 'Enter' false ergibt (d.h., die gedrückte Taste ist die Enter), 
wird das keydown-Ereignis unterbrochen und die Eingabetaste hat keine Auswirkung(das Formular wird nicht abgeschickt).

Durch dieser Zeile wird es verhindert, dass das Formular abgeschickt wird, wenn der Benutzer 
die Eingabetaste drückt, während er im Textfeld ist. Dies kann nützlich sein, um zu verhindern, dass das Formular versehentlich abgeschickt wird, bevor der 
Benutzer alle erforderlichen Informationen eingegeben hat. -->

<!-- das Html input-Tag nutzt Event-Listener @input und Atribut ref, um eine reaktive Benutzererfahrung zu ermöglichen. Dieses Eingabefeld Text akzeptiert --> 
<!-- ref ist ein spezielles Attribut in Vue.js, das einen direkten Zugriff auf dieses DOM-Element (datepicker)ermöglicht -->
<!-- Ein Vue.js-Event-Listener, der die Funktion "checkBooked" aufruft, wenn der Benutzer eine Eingabe in dieses Feld macht -->

<!-- const date = new Date(this.startDate); in js kann ein date objekt aus date string erstellt werden. 
  hier ist this.startDatum ein date objekt, aber weil als parameter an new date gegeben wurde, wird automatisch in
  string konvertiert. also es wird ein neues date objekt gleich wie statrtDatum erstellt.
in jeder itteration wird das date objekt date.setDate(date.getDate() + i); um i Tage erhöht. Bei der ersten Iteration bleibt das Datum unverändert (da i gleich 0 ist), bei der zweiten Iteration wird das Datum um einen Tag erhöht, bei der dritten Iteration um zwei Tage, und so weiter.
am ende wird eine liste aus dateoptions erstellt, die dateoptions bestehend aus datum und zugehörige timeslots enthölt.
z.b. 1 januar 10-11, 1 januar 11-12, 1 jan 12-13 usw. -->




