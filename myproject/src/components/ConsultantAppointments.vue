<template>
<v-app id="gallery-app" >
<HeaderConsultant/>
<div class="berater">
  <!-- Bereich für Sortier- und Filteroptionen -->
    <div class=messages-top-sector>
      <!-- Bereich für Sortieroptionen -->
      <div class="top-sector">
        <!-- Dropdown-Menü zum Sortieren von Terminen -->
        <label class="sort-label" for="sort"><v-icon class="sort-icon">mdi-sort</v-icon>Nach Datum sortieren</label>
        
        <!-- Ein 'select' Element mit der ID 'sort'. Bei einer Änderung der Auswahl wird die 'sortContacts' Funktion aufgerufen.
        in mounted funktion aktuellste zuerst sortiert, deswegen beim Laden der seite Änderung (@change)kann nur passieren wenn frühste zuerst ausgewählt wird  -->
        <select id="sort"  @change="sortContacts">
            <option class="filter-option">aktuellste zuerst</option>
            <option class="filter-option">frühste zuerst</option>   
        </select>
      </div>

      <!-- Bereich für Filteroptionen -->
      <div class="top-sector">
        <!-- Dropdown-Menü zum Filtern von Terminen nach Status all, read, unread-->
          <label class="read-label" for="read"><v-icon class="filter-icon">mdi-filter</v-icon>Nach Status filtern&nbsp;&nbsp;&nbsp;&nbsp; </label>
          
          <select id="read" v-model="readFilter">
            <!-- select Element mit einer Vue.js Direktive 'v-model', 
              die eine Zwei-Wege-Datenbindung zwischen dem ausgewählten Wert des Dropdown-Menüs und der 'readFilter' 
              Variable erstellt. -->
              
              <option value="all">Alle</option> <!-- hier wird readFilter Variable den Wert all haben -->
              <option value="read">Erledigt</option>  <!-- hier wird readFilter Variable den Wert read haben -->
              <option value="unread">Nicht erledigt</option>  <!-- hier wird readFilter Variable den Wert unread haben -->
          </select>
      </div>
    </div>
     <!-- Tabelle zur Anzeige der gefilterten Termine -->
    <table v-if="filteredContacts.length>0">
          <thead>
            <tr >
              
              <th>Termin</th> 
              <th>Name</th> 
              <th></th> 
            </tr>
          </thead>
          <tbody>
          <!-- Schleife über die gefilterten Termine und Anzeige jeder Zeile -->
            <tr  v-for="item in filteredContacts" :key="item.id">
                <td class="date-row">{{ formatDate(item.date) }}, {{ item.start }} - {{ item.end }} Uhr </td>
                <td class="date-text">  Termin mit: {{ item.name }} </td>
                <!-- Checkbox zum Markieren des Termins als erledigt -->
                <td class="read-termin"> <input  type="checkbox" v-model="item.isRead" /><label class="container">Als erledigt markieren</label></td>
                <!-- Button zum Löschen des Termins, click event ruft die Methode deleteAppointment auf -->
                <td><v-btn class="edit-termin" @click='deleteAppointment(item.date, item.start)'>Termin Löschen</v-btn></td> 
            </tr>
          </tbody>
        </table>
      
  </div>
   <FooterComponent/>   
  </v-app>
</template>

<script>

import axios from 'axios'
import HeaderConsultant from './HeaderConsultant.vue'
import FooterComponent from './FooterComponent.vue'

export default{
    name:'ConsultantAppointments',

    components:{
        
        HeaderConsultant,
        FooterComponent
    },
  

    data() {
    return {
      
      dates:[],
      readFilter: 'all'
    }
  },

 computed: {

  // Funktion zum Filtern der Termine basierend auf dem ausgewählten Filter
    filteredContacts() {
      // Die 'filter' Methode wird auf dem 'dates' Array aufgerufen. auf jedem element des arrays (date) wird die Bedingungen geprüft und so wird das array dates gefiltert.
      return this.dates.filter(date =>
        (this.readFilter === 'all' || date.isRead === (this.readFilter === 'read')) 
       /* Wenn der aktuelle Filter auf "all" gesetzt ist, dann wird das Element (date) in das neue Array
        aufgenommen, unabhängig vom Wert von date.isRead. 
        Wenn this.readFilter auf 'read' gesetzt ist, dann wird der Ausdruck this.readFilter === 'read' zu true. 
        Daher wird date.isRead === true und nur die Termine, bei denen isRead auf true gesetzt ist, in das gefilterte Array aufgenommen werden.
        Wenn this.readFilter auf 'unread' gesetzt ist und wird der Ausdruck this.readFilter === 'read' zu false.
        Daher wird date.isRead === false und nur die Termine, bei denen isRead auf false gesetzt ist, in das gefilterte Array aufgenommen werden. */
      )
    }
  },

  methods:{
    /* Funktion zum Sortieren der Termine basierend auf dem ausgewählten Sortierkriterium. 
    wenn 'aktuellste zuerst' wird absteigend und wenn 'frühste zuerst' wird aufsteigend sortiert.
    die sort Funktion auf dem dates Array aufgerufen wird. 
    Die sort Funktion nimmt zwei Elemente (a und b) und subtrahiert das Datum von b vom Datum von a.
    Wenn das Ergebnis positiv ist, wird a nach b sortiert. Wenn das Ergebnis negativ ist, wird a vor b sortiert. und umgekehrt für 'frühste zuerst' */
    sortContacts(event) { 
      if (event.target.value === 'aktuellste zuerst') { 
        this.dates = this.dates.sort(function(a, b) {
          return new Date(b.date) - new Date(a.date); 
        });
      } else if (event.target.value === 'frühste zuerst') {
        this.dates = this.dates.sort(function(a, b) {
          return new Date(a.date) - new Date(b.date); 
        });
      }
    },

    soertdescend(contacts){  //sortiert nur absteigend und gibt aktuellste zuerst. diese Funktion wird immer beim laden der Seite aufgerufen.
      this.contacts = contacts.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date); 
      });
    },
  
    // Funktion zum Formatieren des Datums
    formatDate(dateString) {
      const date = new Date(dateString); // Der String 'dateString' wird in ein Date-Objekt umgewandelt und in der Variable 'date' gespeichert.
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      /* Ein 'options' Objekt wird erstellt, das die Formatierungsoptionen für das Datum festlegt. 
      'weekday: 'short' z.B. 'Mon' für Montag) angezeigt wird.
      'year: 'numeric' Jahr in numerischer Form 
      'month: 'short' z.B. 'Jan' für Januar) 
      'day: 'numeric' der Tag des Monats in numerischer Form */
      return date.toLocaleDateString('de-DE', options);
      // Die Methode 'toLocaleDateString' wird auf dem 'date' Objekt aufgerufen, um das Datum als String in einem bestimmten Format zurückzugeben.
    },

    // Funktion zum Löschen eines Termins
  async deleteAppointment(date, time) {
    try {
      // Finde den Termin in local Array "this.dates" 
      const index = this.dates.findIndex(function (element) {
        return element.date === date && element.start === time;
      });

      if (index >= 0) {
        // nimm die id von dem Termin
        const id = this.dates[index].id;

        // http delete Anforderung für element aus dates array mit gegeenen id an server senden. dynamische endpunkt. 
        await axios.delete(`http://localhost:3000/dates/${id}`);

        // den Termin aus dem array dates löschen
        this.dates.splice(index, 1);
      }
    } catch (error) {
      console.error(error);
    }
}
    
  },
    
    async mounted() {  //die mounted-Funktion wird verwendet, um Termindaten vom Server abzurufen und diese Daten dann in der Komponente zu speichern und zu sortieren.
       
        try {  // Ein HTTP-GET-Request wird gesendet, um die Termindaten vom Server abzurufen
        let appointment = await axios.get('http://localhost:3000/dates');
        
        // Die abgerufenen Termindaten werden verarbeitet und in das 'dates'-Array eingefügt
        // Jeder Termin erhält zusätzlich eine Eigenschaft 'isRead' und mit dem Wert 'false' initialisiert.
        this.dates = appointment.data.map(date => {
        return {
          ...date ,
         isRead:false,
        }
      });
        
        } catch (error) { // Bei einem Fehler wird eine Fehlermeldung in der Konsole ausgegeben
        console.error(error);
        }

        // Die Termine im 'dates'-Array werden asteigend sortiert. aktuellste zuerst
        this.soertdescend(this.dates);
    }
   
};

</script>