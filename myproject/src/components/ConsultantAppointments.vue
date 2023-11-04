<template>
<v-app id="gallery-app" >
<HeaderConsultant/>
<div class="berater">
    <div class=messages-top-sector>
      <div class="top-sector">
        <label class="sort-label" for="sort"><v-icon class="sort-icon">mdi-sort</v-icon>Nach Datum sortieren</label>
        <select id="sort"  @change="sortContacts">
            <option class="filter-option">aktuellste zuerst</option>
            <option class="filter-option">frühste zuerst</option>   
        </select>
      </div>

      <div class="top-sector">
          <label class="read-label" for="read"><v-icon class="filter-icon">mdi-filter</v-icon>Nach Status filtern&nbsp;&nbsp;&nbsp;&nbsp; </label>
          
          <select id="read" v-model="readFilter">
              
              <option value="all">Alle</option>
              <option value="read">Erledigt</option>
              <option value="unread">Nicht erledigt</option>
          </select>
      </div>
    </div>
    <table v-if="filteredContacts.length>0">
          <thead>
            <tr >
              
              <th>Termin</th> 
              <th>Name</th> 
              <th></th> 
            </tr>
          </thead>
          <tbody>
          
            <tr  v-for="item in filteredContacts" :key="item.id">
            
              
                <td class="date-row">{{ formatDate(item.date) }}, {{ item.start }} - {{ item.end }} Uhr </td>
                <td class="date-text">  Termin mit: {{ item.name }} </td>
                <td class="read-termin"> <input  type="checkbox" v-model="item.isRead" /><label class="container">Als erledigt markieren</label></td>
                
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
    filteredContacts() {
      return this.dates.filter(date =>
        (this.readFilter === 'all' || date.isRead === (this.readFilter === 'read')) 
      )
    }
  },

  methods:{

    sortContacts() { 
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

    soertdescend(contacts){
      this.contacts = contacts.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date); 
      });
    },
  
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('de-DE', options);
    },

  async deleteAppointment(date, time) {
    try {
      // Find the appointment in the local "this.dates" array
      const index = this.dates.findIndex(function (element) {
        return element.date === date && element.start === time;
      });

      if (index >= 0) {
        // Get the ID of the appointment from the local array
        const id = this.dates[index].id;

        // Remove the appointment from the database
        await axios.delete(`http://localhost:3000/dates/${id}`);

        // Remove the appointment from the local array
        this.dates.splice(index, 1);
      }
    } catch (error) {
      console.error(error);
    }
}
    
  },
    
    async mounted() {
       
        try {
        let appointment = await axios.get('http://localhost:3000/dates');
        this.dates = appointment.data.map(date => {
        return {
          ...date ,
         isRead:false,
        }
      });
        
        } catch (error) {
        console.error(error);
        }

        this.soertdescend(this.dates);
    }
   
};

</script>