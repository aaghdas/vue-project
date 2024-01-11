<template  >

    <div class="datenschutz">
        <!-- Überschrift für die AGB -->
        <h1 class="datenschutz-title">   Allgemeine Geschäftsbedingungen(AGB)</h1><br/>

        <!-- Absatz, der den Text für die AGB enthält, der aus der Datenobjekt "string" stammt -->
        <p> {{ string }}</p>  <!-- Variable Interpolation in Vue js-->
        
    </div>
    
    </template>
    
    <script>
    
     export default {
    
    name:'AGB',  // Name der Komponente registrieren
    data(){ 
            return{
        string:   // Zeichenkette, die den Textinhalt für die AGB enthält 
        "Durch die Nutzung unserer Dienste erklären Sie sich mit den folgenden Allgemeinen Geschäftsbedingungen einverstanden: Unsere Dienste dürfen ausschließlich in Übereinstimmung mit den geltenden Gesetzen und Vorschriften genutzt werden. Jegliche Verstöße gegen diese Bedingungen können zur Kündigung Ihres Kontos führen. Wir übernehmen keine Verantwortung für Verluste oder Schäden, die durch die Nutzung unserer Dienste entstehen. Die Nutzung unserer Dienste geschieht auf eigenes Risiko. "
            
    }
     }
    };
    
    </script>