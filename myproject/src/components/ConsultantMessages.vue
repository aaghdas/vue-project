
<!-- 
 eine Vue.js-Komponente, die eine Benutzeroberfläche für die Anzeige und Verwaltung von Kontakten 
 bereitstellt. Es ermöglicht das Sortieren, Suchen und Filtern von Kontakten und zeigt Details zu 
 jedem Kontakt in einer Tabelle an. Wenn keine Kontakte gefunden werden, wird eine entsprechende 
 Meldung angezeigt. Die Komponente verwendet auch separate Komponenten für Kopf- und Fußzeile (HeaderConsultant und FooterComponent).
-->
<template> 
<v-app id="gallery-app" >
<HeaderConsultant/>
<div class="berater">
  <div class=messages-top-sector> <!-- Div für die oberen Sektoren (Sortieren, Suchen, Filtern) -->
       <!-- Sortiersektor -->
      <div class="top-sector">
        <label class="sort-label" for="sort"><v-icon class="sort-icon">mdi-sort</v-icon>Nach Datum sortieren</label>
        <select id="sort"  @change="sortContacts"> <!-- Bei Änderung wird die Methode sortContacts aufgerufen -->
            <option>aktuellste zuerst</option>
            <option>frühste zuerst</option>
        </select>
      </div>
       <!-- Suchsektor -->
      <div class="top-sector">
      <label class="search-label" for="search"><v-icon class="search-icon">mdi-account-search</v-icon>Nach Name suchen&nbsp;&nbsp; </label>
      <input id="search" v-model="searchQuery" type="text" @keyup="searchContacts"> <!-- Bei Tastendruck wird die Methode searchContacts aufgerufen -->
      </div>

      <!-- Filtersektor -->
      <div class="top-sector">
          <label class="read-label" for="read"><v-icon class="filter-icon">mdi-filter</v-icon>Nach Status filtern&nbsp;&nbsp;&nbsp;&nbsp; </label>
          
          <select id="read" v-model="readFilter"> <!-- Auswahlliste mit 3 Optionen. Bei Änderung wird der Wert von readFilter aktualisiert -->
              
              <option value="all">Alle</option>
              <option value="read">Gelesen</option>
              <option value="unread">Nicht gelesen</option>
          </select>
      </div> 
  </div> 
   <!-- Html-Tabelle zur Darstellung der eingerichteten Kontakte -->
    <table v-if="filteredContacts.length>0"> 
      <!-- Im CSS code wird durch thead tr { position: absolute; top: -9999px; left: -9999px; } 
      die Tabellenkopfzeile außerhalb des sichtbaren Bereichs des Bildschirms verschoben. 
      Es ist eine Methode, um Inhalte für Screenreader zugänglich zu machen, aber sie für visuelle Benutzer
      auszublenden. Es ist eine Methode, um die Barrierefreiheit der Webseite zu verbessern.  -->
      <thead>
            <tr>
                <th></th>
                <th></th>
                <th>Von:</th>
                <th>Telefonnummer:</th>
                <th>Email:</th>
                <th>Nachricht:</th>
            </tr>
        </thead>
        <tbody>
             <tr v-for="item in filteredContacts" :key="item.id">  <!-- Iteriert über jeden Kontakt in filteredContacts -->             
                <!-- Vue.js-Ausdrucksinterpolation.Die Methode formatDate wird aufgerufen, um Datumsformat zu ändern. z.B. von  "2024-02-01T13:16:36.000Z" in "Fr., 1. Feb. 2024" umwandeln -->
                <td class="date-row">{{ formatDate(item.datumZeit) }}</td> 
                <!-- Checkbox zum Markieren als gelesen -->
                <td class="read"> <input  type="checkbox" v-model="item.isRead" /><label class="container">Als gelesen markieren</label></td>
                <td>Von: {{ item.name }}</td>
                <td>Bundesland: {{ item.state }}</td>
                <td>Telefonnummer: {{ item.phone }}</td>
                <td>Email-Adresse: {{ item.email }}</td>
                <td class="message-row">Nachricht:<br/>{{ item.message }}</td>  
            </tr>
        </tbody>
    </table>
    <!-- Meldung, wenn keine Kontakte gefunden wurden --> 
    <p class="no-result" v-else>Keine Kontakte gefunden... bitte Suche anpassen</p>
</div> 
<FooterComponent/> 
  </v-app>
</template>

<script>
import axios from 'axios'
import HeaderConsultant from './HeaderConsultant.vue'
import FooterComponent from './FooterComponent.vue'

export default {
  name: 'ConsultantMessages',

  components:{
        
        HeaderConsultant,
        FooterComponent
    },
  
  data() {
    return {
      contacts:[],
      searchQuery: '',
      readFilter: 'all'
    }
  },
  
  async mounted() {
    try {
      let response = await axios.get('http://localhost:3000/contacts');
      this.contacts =  response.data.map(contact => {
        return {
          ...contact ,
         isRead:false,
        }
      });
      
      console.log(this.contacts);
    } catch (error) {
      console.error(error);
    }
    
    this.soertdescend(this.contacts);
  },
  
  computed: {
    filteredContacts() {
      return this.contacts.filter(contact =>
        (this.readFilter === 'all' || contact.isRead === (this.readFilter === 'read')) &&
        (this.searchQuery ? contact.name && contact.name.toLowerCase().startsWith(this.searchQuery.toLowerCase()) : true)
        // Überprüfe ob der Kontaktname vorhanden ist, um den undefined Fehler zu vermeiden
      )
    }
  },
  
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('de-DE', options);
    },

    soertdescend(contacts){
      this.contacts = contacts.sort(function(a, b) {
        return new Date(b.datumZeit) - new Date(a.datumZeit); 
      });
    },
  
    sortContacts(event) { 
      if (event.target.value === 'aktuellste zuerst') {
        this.contacts = this.contacts.sort(function(a, b) {
          return new Date(b.datumZeit) - new Date(a.datumZeit); 
        });
      } else if (event.target.value === 'frühste zuerst') {
        this.contacts = this.contacts.sort(function(a, b) {
          return new Date(a.datumZeit) - new Date(b.datumZeit); 
        });
      }
    },
  
    searchContacts() {
      console.log('searching contacts...');
    }
  }
};

</script>