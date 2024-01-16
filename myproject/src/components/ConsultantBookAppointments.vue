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
      name:"",
      
      
    };
  },

  
   
  beforeMount() {  //jedes mal beim Laden der Seite müssen die Daten über verfügare Datum und Zeit aktualisiert sein.
    
    //Diese Methode erstellt eine Liste von Datumsoptionen (dateOptions), wobei jede Option ein bestimmtes Datum und die zugehörigen Zeitschlitze enthält. 
    for (let i = 0; i < this.numOfDays; i++) {  // Diese Schleife läuft für die Anzahl der Tage, die in this.numOfDays definiert sind. Für jeden Tag wird eine Reihe von Operationen durchgeführt.
      const date = new Date(this.startDate);  // Ein neues Datum basierend auf dem Startdatum erstellen
      date.setDate(date.getDate() + i); // Das Datum um die aktuelle Schleifeniteration erhöhen.Das Datum wird um i Tage erhöht. 
      //date.getDate() gibt den Tag des Monats (zwischen 1 und 31) für das angegebene Datum zurück.
      let dateStr = date.toString();
      const timeSlots = [ // Eine Liste von Zeitschlitzen erstellen
        { start: '10:00', end: '11:00', booked: false }, // Jeden Zeitschlitz mit Startzeit, Endzeit und Buchungsstatus definieren
        { start: '11:00', end: '12:00', booked: false },
        { start: '12:00', end: '13:00', booked: false },
        ].map(slot => ({ ...slot, selected: false })); // Jeden Zeitschlitz klonen und eine `selected`-Eigenschaft mit dem initialen Wert false hinzufügen
      this.dateOptions.push({ date: dateStr, timeSlots }); // Das Datum und die zugehörigen Zeitschlitze zu den Datumsoptionen Array hinzufügen
      /* Jedes Element im dateOptions Array ist ein Objekt, das aus einem Datum (date) und einem Array von Zeitschlitzen (timeSlots) besteht.
       Jeder Zeitschlitz ist ebenfalls ein Objekt, das die Eigenschaften start, end, booked und selected hat. */
    }
    console.log("test-dateOptions Array :" +this.dateOptions[0].date);
    this.dateOptions[0].timeSlots.forEach(slot => {
      console.log(`Start: ${slot.start}, End: ${slot.end}, booked:${slot.booked}, selected: ${slot.selected}`);
    });
    console.log(`test first timeSlot in first date from dateoptions array : ${this.dateOptions[0].date}, ${JSON.stringify(this.dateOptions[0].timeSlots[0])}` );
  
    
    // Definiert eine asynchrone Funktion namens 'dl' 
    async function dl() {
        
        let response = await axios.get('http://localhost:3000/disable'); // Sendet eine GET-Anfrage an 'http://localhost:3000/disable' und speichert die Antwort in Variable 'response'
        let disableListFromApi = response.data.map(item => new Date(item.date)); // Wandelt die Daten aus der Antwort in ein Array von Datum-Objekten um. Im ursprünglichen disable Array hat jedes Element date und id eigenschaften. Im neuen Array(disableListFromApi) hat jedes Element nur date.
        this.disableList = this.disableList.concat(disableListFromApi); // Fügt das neue Array zur 'disableList', das in data als leeres Array initialisiert wurde, hinzu
        console.log(this.disableList); // die Änderungen an disbleList in Konsole prüfen
        return this.disableList; // die dl() Funktion gibt die 'disableList' zurück
    }
        dl().then(disableList => { //Die Methode .then() wird auf die Promise aus dl() angewendet und nimmt zwei Argumente: eine Callback-Funktion für den fullfiled Fall und eine Fehlermeldung für den rejected Fall von Promise

          /* Die Vue-Referenzen sind bereits in der beforeMount-Methode verfügbar. 
          Es wird auf die referenzierten DOM-Elemente über die `$refs`-Eigenschaft der Vue-Komponente zugegriefen und nicht auf die tatsächlichen DOM-Knoten.*/
            // Initialisierung von flatpickr 
          let fp =  flatpickr(this.$refs.datepicker, {
          altInput: true, // dient zur Anzeige des ausgewählten Datums im lesbaren Format für Benutzer(definiert durch altFormat), während das ursprüngliche Eingabefeld das ausgewählte Datum im maschinenlesbaren Format (definiert durch dateFormat) behält, das an den Server gesendet wird.
          altFormat: "F j, Y", //"F":Der vollständige Text des Monats z.B.Januar,  "j": Der Tag des Monats ohne führende Nullen z.B. 1 anstatt 01, "Y": Das Jahr in vier Ziffern z.B. 2024
          dateFormat: 'Y-m-d', //z.B. in der Form 2024-01-01 wird an Server gesendet.
          inline:true, // zeigt den Kalender dauerhaft an
          static:true, // positioniert den Kalender relativ zum übergeordneten Element und nicht zum Körper
          minDate: this.startDate, // setzt das früheste auswählbare Datum
          disable: disableList, // nimmt ein Array von Daten, die im Kalender deaktiviert werden sollen
          
          /* onClose ist eine Optionen in der flatpickr-Bibliothek, die aufgerufen wird, wenn der Datepicker geschlossen wird.
             selectedDates ist das Argument der Arrow-Funktion und ist ein Array von Daten, die vom Benutzer im Datepicker ausgewählt wurden.
          */
          onClose: (selectedDates) => {  
            if (selectedDates.length === 0) return; // Überprüft, ob das Array 'selectedDates' leer ist, wenn ja wird die Funktion sofort beendet und es wird nichts zurückgegeben.
          /* Wenn Daten ausgewählt wurden, wird das erste ausgewählte Datum genommen (selectedDates[0]),
           in einen ISO-String konvertiert und auf die ersten 10 Zeichen zugeschnitten, um nur das Datum ohne Uhrzeit zu erhalten.
           Dieser Wert wird dann selectedDate zugewiesen. */
            const selectedDate = selectedDates[0].toISOString().slice(0, 10); 
            this.selectedDateOption = this.dateOptions.find(option => option.date === selectedDate); // durchsucht this.dateOptions nach einem Objekt, dessen date-Eigenschaft dem ausgewählten Datum entspricht, und weist dieses Objekt this.selectedDateOption zu.
          },
          });
          fp.set('disable', disableList); // Setzt die 'disableList' für option disable in 'flatpickr' Konfiguration
          },
        error => {
          // die then Methode wirft eine Fehlermeldung, wenn dl() Promise scheitert. 
          console.error("Ein Fehler ist aufgetreten: ", error);
        });
    
  },

  methods: {


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
        return response.data;  // das JSON-Objekt, das die Daten enthält.
    },
    
    /* innerhalb der isDisabled methode wird searchDate methode aufgerufen. 
    Rückgabewert von searchdate ist ein Array von Datum-objekte, die deren date Eigenschaft das eingegebene Datum ist. 
    Wenn dieses Array nicht leer ist und mehr als 2 Elemente hat, also schon mehr als 2 Termine für dieses Datum gebucht sind, wird das Datum in disable Array gespeichert*/
    async isDisabled(date) { 
        let result = await this.searchDate(date);
        if (Array.isArray(result) && result.length > 2){    //prüft ob result ein Array mit Länge größer als 2 ist. 
            axios.post(`http://localhost:3000/disable`, {date,}); // in Array disable haben die Elemente 2 Eigenschaft, date und id, deswegen komma nach date.
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
    
    /* <!-- Die checkBooked-Methode überprüft, ob ein bestimmter Zeitschlitz an einem bestimmten Datum bereits gebucht wurde,
      und aktualisiert den gebuchten Status für den Zeitschlitze des Datums.time.booked = booked; 
      Die booked()-Methode für das ausgewählte Datum(aus dem datepicker) und alle Zeitschlitze in timeSlots Array aufgeruft.
      Der Rückgabewert wird dann der `booked`-Eigenschaft des entsprechenden Elements in der `timeSlots`-Liste zugewiesen.   */
    async checkBooked(){
      for (let time of this.timeSlots){ 
        // Ruft die Methode booked auf und speichert den Wert in einer Variablen booked.
        let booked = await this.booked(this.$refs.datepicker.value,time.start);
        // Der Rückgabewert wird dann der `booked`-Eigenschaft des entsprechenden Elements in der `timeSlots`-Liste zugewiesen
        time.booked = booked; 
        
      }
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
      } else{
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

    /* Diese Methode ist für Nachrichten-Anzeige als ein Rahmen mit dem Textinhalt und den gewünschten Buttons für Bestätigen, Schließen und weiter.
    die boolische Werte als Argumente der Methode bestimmen, ob der Nachrichtenrahmen ein Button beinhalten muss oder nicht. */
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
      this.$refs.datepicker._flatpickr.clear(); // Der Flatpickr-Instanz, die mit dem 'datepicker' ref verbunden ist, wird angewiesen, das ausgewählte Datum zu löschen.
      this.selectedTime = ''; // Die Variable 'selectedTime' wird auf einen leeren String gesetzt
      this.selectedDateOption = null; // Die Variable 'selectedDateOption' wird auf 'null' gesetzt.
      this.hideMessageBox(); // Die Funktion 'hideMessageBox' wird aufgerufen, um die Nachrichtenbox zu verstecken.
    },

    
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
  hier ist this.startDatum ein date objekt, aber weil als parameter an new date gegeben wurde, wird automatisch in string konvertiert. 
Also es wird ein neues date objekt gleich wie statrtDatum erstellt.
In jeder itteration wird das date objekt date.setDate(date.getDate() + i); um i Tage erhöht. Bei der ersten Iteration bleibt das Datum 
unverändert (da i gleich 0 ist), bei der zweiten Iteration wird das Datum um einen Tag erhöht, bei der dritten Iteration um zwei Tage, und so
weiter. Am Ende wird eine liste aus dateoptions erstellt, Jedes Element im dateOptions Array ist ein Objekt, das aus einem Datum (date) 
und einem Array von Zeitschlitzen (timeSlots) besteht. Jeder Zeitschlitz ist ebenfalls ein Objekt, das die Eigenschaften start, end, booked und selected hat. -->


<!-- Ausgabe der toIsoString Methode: z.B. 2024-01-01T00:00:00.000Z , was das Datum und die Uhrzeit zum Zeitpunkt der Erstellung des Date-Objekts repräsentiert.
Die Ausgabe hat folgendes Format: YYYY-MM-DDTHH:mm:ss.sssZ, wobei:

YYYY-MM-DD das Datum repräsentiert (Jahr-Monat-Tag)
T ist ein Trennzeichen, das das Datum von der Uhrzeit trennt
HH:mm:ss.sss repräsentiert die Uhrzeit (Stunden:Minuten:Sekunden.Millisekunden)
Z zeigt an, dass die Zeit in der koordinierten Weltzeit (UTC) angegeben ist
.toISOString() immer die Zeit in UTC zurückgibt, unabhängig von der Zeitzone des ursprünglichen Date-Objekts. -->

<!-- find() ist eine eingebaute Methode in JavaScript, die auf Arrays angewendet wird. Als Parameter bekommt eine Funktion, 
  die sogennante Testfunction. In diesem code Testfunction ist eine Arrow Function. 
  Die Arrow function option => option.date === selectedDate nimmt ein Argument option und gibt true oder false zurück,
  abhängig davon, ob option.date gleich selectedDate ist. Hier ist option ein Element aus dem dateOptions Array, weil find Methode 
  auf dem dateOptions Array angewendet wird und überpruft die Elemente aus diesem Array. Zusammengefasst:
this.dateOptions.find(option => option.date === selectedDate) durchläuft jedes Element im Array dateOptions und gibt das erste Element zurück,
 für das die bereitgestellte Funktion true zurückgibt. -->

<!--Die Funktion Array.isArray() ist eine eingebaute Funktion in JavaScript, die überprüft, ob der übergebene Wert ein Array ist.
In Array.isArray(result), ist Array das globale Array-Objekt in JavaScript, das eine Reihe von Methoden und Eigenschaften bereitstellt, 
die man verwenden kann, wenn man mit Arrays arbeitet. isArray() ist eine dieser Methoden und result ist der Wert, den überprüft wird.
Wenn result ein Array ist, gibt Array.isArray(result) true zurück. Wenn result kein Array ist, gibt die Funktion false zurück. -->