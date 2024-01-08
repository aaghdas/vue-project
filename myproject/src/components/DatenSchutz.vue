<template  >

    <div class="datenschutz">
        <h1 class="datenschutz-title">   Datenschutzerklärung</h1><br/>
    <p> {{ string }}</p>
        
    </div>
    
    </template>
    
    <script>
    
     export default {
    
    name:'DatenSchutz',
    data(){
            return{
        string:
        "Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst.Alle Informationen, die Sie uns zur Verfügung stellen, werden vertraulich behandelt und ausschließlich gemäß den geltenden Datenschutzbestimmungen verwendet. Wir geben Ihre Daten nicht ohne Ihre Zustimmung an Dritte weiter und sorgen dafür, dass angemessene Sicherheitsmaßnahmen getroffen werden, um Ihre Daten vor unbefugtem Zugriff oder Missbrauch zu schützen."
            
    }
     }
};
    
    </script>