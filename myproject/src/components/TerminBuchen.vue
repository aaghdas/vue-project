<template>

    <div class="calandar-container"> <!-- Container für den Kalender und die Terminbuchung -->
        <p id="contact-text"><!-- Textabschnitt, der den Benutzer durch den Buchungsprozess führt -->
          Hier kannst Du bequem den Termin für Dein erstes Beratungsgespräch buchen und Dich von unseren erfahrenen Experten kostenlos beraten lassen!
          Wir können dann Dir einen Hund aus unserem Tierheim vorstellen, der ein neues Zuhause sucht und Dir am besten passt. 
        </p >

       
        
        <div class="termin"><!-- Container für das Datumseingabefeld -->
        <!-- Das Eingabefeld greift auf dem datepicker zu (ref), ermöglicht dem Benutzer, ein Datum einzugeben und ruft bei jeder Eingabe die Funktion checkBooked auf(@input), um die Verfügbarkeit des gewählten Termins zu überprüfen --> 
        <!-- später wird this.$refs.datepicker.value verwendet, um den aktuellen Wert des input-Elements zu erhalten. -->
          <input  type="text" id="datepicker" ref="datepicker" @input= "checkBooked" placeholder="Datum Auswählen">
        </div>

        <!-- Überprüfen, ob Zeitschlitze vorhanden sind -->
        <div class="termin" v-if="timeSlots.length > 0">
                     <!-- v-model="selectedTime" bindet den Wert des <select>-Elements an die selectedTime-Eigenschaft der Vue-Instanz.
                    Wenn ein Benutzer eine Option in der Dropdown-Liste auswählt, wird der Wert dieser Option automatisch der 
                    selectedTime-Eigenschaft zugewiesen. Umgekehrt, wenn der Wert von selectedTime geändert wird, wird die Auswahl in der 
                    Dropdown-Liste entsprechend aktualisiert. -->
            <select size="4" class="termin-zeit" id="time" v-model="selectedTime"  >    
                <!-- erste option ist immer String zeit auswählen -->
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
              <p v-text="messageContent"></p> <!-- v-text direktiv für Anzeige des Strings -->
              <!-- Einen Button zur Buchung hinzufügen, beim klicken wird die Methode bookConfirmed aufgerufen, wobei die tatsächtliche Buchung ausgeführt  -->
              <v-btn v-if="showConfirmButton" @click="bookConfirmed" class="confirmation-buttonJa">Bestätigen</v-btn>
              <!-- Andere Buttons für Buchungsvorgang mit dem Aufruf der entsprechenden Methoden -->
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
/* Die data-Funktion in Vue.js verwenden, um ein Objekt zurückzugeben.
Dieses Objekt enthält alle Eigenschaften, die in der Vue-Komponente verfolgt oder beobachtet werden sollen.
Diese Eigenschaften sind reaktiv, d.h. Vue erkennt die Änderungen an diesen Eigenschaften und die Komponente automatisch neu rendert, 
wenn sie geändert werden. */
  data() {
    return {
      startDate: new Date(), //datum objekt erstellt und in Eigenschaft startdate gespeichert
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

    let user = localStorage.getItem('user-info') //holt die Daten aus dem lokalen Speicher des Browsers, die unter dem Schlüssel 'user-info' gespeichert sind und weißt das der variable user zu.
    user = JSON.parse(user); //konvertiert die JSON-Zeichenkette(user), die aus dem lokalen Speicher geholt wurde, in ein JavaScript-Objekt.
    this.name = await user.name; // weist den Wert von user.name der Eigenschaft name der Vue-Instanz zu.
    /* jedes mal beim Laden der Seite müssen die Daten über verfügare Datum und Zeit aktualisiert sein.
    Diese Methode erstellt eine Liste von Datumsoptionen (dateOptions), wobei jede Option ein bestimmtes Datum und die zugehörigen Zeitschlitze enthält. 
  */ 

  // erstellt eine Liste von Terminoptionen für ein ganzes Jahr (da this.numOfDays auf 364 gesetzt ist) //
    for (let i = 0; i < this.numOfDays; i++) { //eine Schleife, die für jeden Tag des Jahres durchläuft.
      const date = new Date(this.startDate); //erstellt ein neues Date-objekt für jeden Tag des Jahres, beginnend mit this.startDate
      date.setDate(date.getDate() + i);
       /* date.getDate() gibt den Tag des Monats (zwischen 1 und 31) für das angegebene Datum zurück.
       addiert die Variable i (die die aktuelle Iteration der Schleife repräsentiert)zum aktuellen Tag des 
       Monats. Wenn i zum Beispiel 1 ist, wird dies den nächsten Tag repräsentieren.
       setDate setzt den Tag des date-Objekts auf den berechneten Wert. Dies ändert das ursprüngliche date-Objekt. */
      const dateStr = date.toISOString().slice(0, 10); //konvertiert das Datum in eine Zeichenkette im ISO-Format (z.B. 2024-01-31) und schneidet sie auf die ersten 10 Zeichen zurecht, um nur das Datum ohne die Uhrzeit zu erhalten.
      //für jedes Datum-objekt erstellt eine Liste von Zeitschlitzen, jedes Element ist ein Objekt mit Eigenschaften start,end und booked.
      const timeSlots = [
        { start: '10:00', end: '11:00', booked: false },
        { start: '11:00', end: '12:00', booked: false },
        { start: '12:00', end: '13:00', booked: false },
      ].map(slot => ({ ...slot, selected: false })); 
      /* Die map()-Funktion wird verwendet, um über jeden Zeitschlitz in der timeslots Liste zu iterieren und
      ein neues Objekt zu erstellen, das alle Eigenschaften des ursprünglichen Zeitschlitzes sowie das zusätzliche 
      Attribut "selected" enthält. Der Ausdruck { ...slot, selected: false } verwendet den Spread-Operator (...) 
      um alle Eigenschaften des slot-Objekts in das neue Objekt zu kopieren und fügt dann das selected-Attribut hinzu. */
      this.dateOptions.push({ date: dateStr, timeSlots });
      // wird ein neues Objekt zur Liste this.dateOptions hinzugefügt. Dieses Objekt hat zwei Eigenschaften: date und timeSlots. timeSlots ist auch ein Schlüssel-Wert-Paar, bei dem timeSlots sowohl der Schlüssel als auch der Wert ist.
    }
   },

   beforeMount () {
    //erstellt eine Liste aus den deaktivierten Daten (disabled list)
    async function dl() {
      
        let disableList =[]; //erstellt eine leere Liste, die später verwendet wird, um die deaktivierten Daten zu speichern.
        
        // Sendet eine GET-Anfrage an 'http://localhost:3000/disable' und speichert die Antwort in Variable 'response'
        let response = await axios.get('http://localhost:3000/disable');
       
        /* nimmt die Daten aus der API(response.data), die eine Liste von Objekten ist, und erstellt 
        eine neue Liste von Date-Objekten. Jedes Element in response.data ist ein Objekt mit einer 
        date-Eigenschaft, die ein Datum als Zeichenkette repräsentiert. new Date(item.date) konvertiert diese 
        Zeichenkette in ein Date-Objekt. Die map()-Funktion wird verwendet, um über jedes Element in response.data zu 
        iterieren und eine neue Liste zu erstellen. Für jedes Element in response.data wird new Date(item.date) aufgerufen, 
        um ein neues Date-Objekt zu erstellen, das das Datum repräsentiert, das durch item.date angegeben wird.
        Schließlich wird die erstellte Liste von Date-Objekten der Variable disableListFromApi zugewiesen. */
        let disableListFromApi = response.data.map(item => new Date(item.date));
        disableList = disableList.concat(disableListFromApi); // die Liste der deaktivierten daten aus der API wird der bestehenden Liste disableList hinzugefügt.
        console.log(disableList); // Zur Bestätigung, dass beide Datumsangaben enthalten sind
        return disableList;
  }

  dl().then(disableList => {
   
  let fp = flatpickr(this.$refs.datepicker, {
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

  /* innerhalb der isDisabled methode wird searchDate methode aufgerufen. 
    Rückgabewert von searchdate ist ein Array von Datum-objekte, die deren date Eigenschaft das eingegebene Datum ist. 
    Wenn dieses Array nicht leer ist und mehr als 2 Elemente hat, also schon mehr als 2 Termine für dieses Datum gebucht sind, wird das Datum in disable Array gespeichert*/
      async isDisabled(date) { 
      
        let result = await this.searchDate(date);
        if (Array.isArray(result) && result.length > 2){
            axios.post(`http://localhost:3000/disable`, {
             date,
            });
        }
      }, 

      /* Die Methode booked nimmt date und start von Zeitschliz als Argument entgegen und prüft, ob in Array dates diese Datum/Zeit 
      gespeichert wurde (also schon gebucht ist).Danach gibt den Wert für boolische Variable booked zurück(wenn gebucht ist booked ist true)
      Die Methode sendet einen GET-Aufruf an das API. Wenn `response.data` ein nicht leeres Array ist, bedeutet dies, dass ein Termin an diesem Tag und um diese Zeit gebucht wurde.
      Da die gebuchten Termine im Array http://localhost:3000/dates gespeichert sind mit Eigenschaft booked=true.
      In diesem Fall wird `booked` auf den Wert von `response.data[0].booked` gesetzt, der `true` ist, wenn der Termin gebucht wurde.
      Falls `response.data` für das eingegebene Datum/Zeit leer ist, d.h. der Termin wurde noch nicht gebucht, booked wird den Wert false haben, 
      denn der if Bedingung wird nicht erfüllt und booked ist auf false initialisiert.
      */
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

       /* Die checkBooked-Methode überprüft, ob ein bestimmter Zeitschlitz an einem bestimmten Datum bereits gebucht wurde,
      und aktualisiert den gebuchten Status für den Zeitschlitze des Datums.time.booked = booked; 
      Die booked()-Methode für das ausgewählte Datum(aus dem datepicker) und alle Zeitschlitze in timeSlots Array aufgeruft.
      Der Rückgabewert wird dann der `booked`-Eigenschaft des entsprechenden Elements in der `timeSlots`-Liste zugewiesen. */
     async checkBooked(){
      for (let time of this.timeSlots){
        // Rufen Sie die Methode booked auf und speichern Sie den Wert in einer Variablen
        let booked = await this.booked(this.$refs.datepicker.value,time.start);
        time.booked = booked; 
        
      }
    },
 /* Die `searchDate`-Methode sucht nach bestimmten Daten in dates Array, indem sie eine HTTP GET-Anfrage an den Server sendet. 
    Wenn date Eigenschaft eines Elements in dates Array mit dem als Argument eingegebenen Datum übereinstimmt, bildet dann eine URL für dieses Element 
    und sendet eine get Anfrage an Server, speichert das gesuchte Datum in Variable response(Das `response`-Objekt ist eine Instanz der `AxiosResponse`-Klasse von Axios.)
    Ein Array von Datum-objekte ist Rückgabewert der Methode. So sieht ein Datum Objekt in http://localhost:3000/dates aus:
     {
      "date": "2023-10-28",
      "start": "10:00",
      "end": "11:00",
      "booked": true,
      "name": "ana",
      "id": 2
    } */
    async searchDate(date) {
    
        let url = `http://localhost:3000/dates?date=${date}`;
        const response = await axios.get(url);
        return response.data;
      
    },

    /* setzt die booked Eigenschaft für alle Zeitschlitze in der Auswahlliste zurück auf false, damit sie bei der nächsten Buchung wieder auswählbar sind.
    Array dateoptions ist ein verschachteltes Array von allen Daten ab dem nächsten Tag im datepicker. Jedes Element hat ein date Eigenschaft sowie ein Array bestehend aus allen Daten des datepickers mit jeweiligen Zeitschlitzen */
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

    /* diese Methode weist den Varianblen selectedDate und 
    selectedTimeSlot das ausgewählte Datum von datepicker bzw. die ausgewählte Zeit für den Termin zu, sendet eine HTTP post Anfrage im Array dates für
    den gebuchten Termin.
    Die axios.post() Methode gibt ein Promise-Objekt zurück, das sich auflöst, wenn die HTTP-Anfrage erfolgreich abgeschlossen ist. 
    Falls promise erfüllt ist(post Anfrage erfolgreich) wird eine Nachricht für die Bestätigung des erfolgreichen Buchung angezeigt.*/

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

    /* Die Methode für Nachrichten-Anzeige als ein Rahmen mit dem Textinhalt und den gewünschten Buttons(Bestätigen, Schließen und weiter).
    Die boolische Werte als Argumente der Methode bestimmen, ob der Nachrichtenrahmen eine der genannten Buttons beinhalten muss.
    content ist ein string für Nachrichteninhalt */
    showMessage(content, confirmButton,closeButton,nextButton) {
      this.messageContent = content;
      this.showMessageBox = true;
      this.showConfirmButton = confirmButton;
      this.showCloseButton = closeButton;
      this.showNextButton = nextButton;
    },

    // versteckt den Nachrichtenrahmen
    hideMessageBox() {
      this.showMessageBox = false;
      this.showConfirmButton = false;
      this.showCloseButton = false;
      this.showCloseButton = false;
      this.shownextButton = false;
      this.messageContent = '';
    },

    // reset datepicker und ausgewählte Zeit
    close(){
      this.$refs.datepicker._flatpickr.clear();
      this.selectedTime = '';
      this.selectedDateOption = null;
      this.hideMessageBox();

    },

    
        }
   
      
};

</script>
