<template>

    <!--vor dem Erscheinen des Elements wird beforeEnter Methode und während des Erscheinens wird enter Methode aufgerufen.
    mit appear wird immer beim ersten rendern der komponente die transition verwendet. Mehr dazu sehe unten -->
<transition appear  @before-enter="beforeEnter" @enter="enter" > 
<slot />  <!-- Slot für die Platzierung von Inhalt aus der übergeordneten Komponente. Mehr dazu sehe unten -->
</transition>
</template>

<script>

    export default{
        name: 'AppearTransition',

        props:{ // Props (kurz für properties/Eigenschaften) sind benutzerdefinierte Attribute, die man an eine Komponente übergeben kann. -->
            duration:{ // Dauer der Übergangseffekte
                type:Number, // von Datentyp Number
                default: 1500,   //standardmäßig auf 1.5 Sekunde eingesetzt
            },
            delay:{  //Verzögerung vor Beginn der Übergangseffekte
                type: Number,
                default: 50,
            },
            transition: Array,  // Datentyp Array für die Übergangseffekte(Verschiebung Translation) mehr sehe unten.
        },

        methods:{
            beforeEnter(el){
                el.style.opacity = 0;  //vor dem Erscheinen opacity auf 0 eingesetzt.

                if(this.transition)
                    el.style.transform = 'translate('+this.transition.join(',')+')';

            },

            enter(el){

                /* Diese Zeile deklariert und initialisiert eine Variable namens transitions und weist ihr einen String zu,
                 der eine CSS-Übergangsregel darstellt. Diese Regel legt fest, dass eine Änderung der 
                 opacity-Eigenschaft über eine Dauer von ${this.duration} Millisekunden und mit einer
                  Verzögerung von ${this.delay} Millisekunden stattfinden soll. */
                let transitions = `opacity ${this.duration}ms ease-in-out ${this.delay}ms`; //mit ease-in-out startet und endet die Animation langsam, und ist nur in der Mitte schnell1. 
                if (this.transition) {  //wenn transition-prop vorhanden
                    transitions += `, transform ${this.duration}ms ease-in-out ${this.delay}ms`;  //die transitions-Variable mit der +=-Operation aktualisieren. Die transform-CSS-Eigenschaft wird die transitions-Variable hinzugefügt
                    el.style.transform = `translate(${this.transition.join(', ')})`;
                    /* el.style.transform: Hier wird die CSS-Eigenschaft transform des Elements el festgelegt. 
                    translate(${this.transition.join(', ')}): Hier wird die translate-Funktion verwendet, die eine 2D-Verschiebung des Elements bewirkt. 
                    ${this.transition.join(', ')}: Dies ist ein Template-Literal in JavaScript, das einen String erzeugt. 
                    this.transition ist ein Array, das die Werte für die Verschiebung enthält. 
                    Die join-Methode wird verwendet, um das Array in einen durch Kommas getrennten String umzuwandeln, 
                    der als Argument für die translate-Funktion dient. */
                }
                el.style.transition = transitions;  /* in der vorigen Zeile wird el.style.transform zuerst auf das Element verwendet, 
                um den Anfangszustand der Transformation festzulegen. Danach wird el.style.transition verwendet, um zu definieren, 
                wie diese Transformation im Laufe der Zeit animiert werden soll. */
                setTimeout(()=> {    //legt der Endzustand des Elementes fest. opacity auf 1 (komplett sichtbar) und transformation zurücksetzen(Animation beenden).Die setTimeout-Funktion wird in diesem Kontext verwendet, um sicherzustellen, dass die Änderungen an den CSS-Eigenschaften opacity und transform zurücksetzen erst nach der Animation vorgenommen werden.
                    el.style.opacity = 1;
                    el.style.transform = '';
                });  // setTimeout ohne einen zweiten Parameter (die Verzögerungszeit) aufrufen, wird die Funktion so bald wie möglich ausgeführt, aber immer noch nachdem der aktuelle Codeblock abgeschlossen ist. 
            }
        }

    }
</script>

<!-- In Vue.js ist <transition> eine eingebaute Komponente, die automatisch CSS-Übergänge und Animationen anwendet, 
    wenn Elemente ein- und ausgeblendet werden. Die Attribute appear, @before-enter und @enter sind spezielle Hooks,
     die von der <transition>-Komponente bereitgestellt werden. appear ist ein spezielles Attribut, das angibt, ob die Übergangseffekte beim ersten Rendern des Elements angewendet werden sollen.
    
    @before-enter ist ein Ereignishandler, der eine Methode aufruft, bevor das Element erscheint (also bevor die enter-Phase beginnt).
    z.B. hier wird die Opazität auf 0 gesetzt (unsichtbar wird)und eine Transformationsregel angewendet, wenn die transition-Prop vorhanden ist.
    
    @enter ist ein Ereignishandler, der eine Methode aufruft, wenn das Element erscheint (also während der enter-Phase). z.B. hier wird die Opazität auf 1 gesetzt (vollständig sichtbar) und die 
    Transformationsregel zurückgesetzt. -->


  <!--  In Vue.js ist <slot /> ein spezielles Tag, das als Platzhalter für Inhalte dient. 
    Es wird in der Vorlage einer Komponente verwendet, um anzugeben, wo die Inhalte eingefügt werden sollen, die man in die Komponente einfügen.
    Wenn man eine Vue-Komponente verwenden und zusätzlichen Inhalt innerhalb des Tags der Komponente bereitstellen möchte, 
    wird dieser Inhalt in das <slot /> der Komponentenvorlage eingefügt. Hier z.B. wird die vorliegende Komponente in anderen Komponenten verwendet
    um Animation darzustellen, der Plazhalter für das zu animiertenden Element ist  <slot /> -->

   <!--  transition: Array, transition ist eine Prop (Eigenschaft), die von der übergeordneten Komponente an die untergeordnete Komponente übergeben wird.
     Der Typ dieser Prop ist ein Array. In diesem Fall ist die transition-Prop ein Array von Werten, die die Übergangseffekte (z.B die Verschiebung in der translate-Funktion) bestimmen.
    Ein Beispiel wie transition in homepage für Animation des Textes verwendet wird:
     <AppearTransition :transition="['-300px',0]">
        <div id="homeText"><p>Unsere Hunde suchen neues Zuhause und nette  Spazieren BegleiterInnen</p></div>
    </AppearTransition> 
    -->

    <!-- Die Begriffe ease-in und ease-out sind spezifische Arten von Timing-Funktionen in CSS-Animationen und -Übergängen.
        ease-in: Diese Timing-Funktion sorgt dafür, dass die Animation langsam startet und dann an Geschwindigkeit gewinnt.
        Sie wird oft verwendet, wenn ein Element in die Ansicht eintritt1.
        ease-out: Diese Timing-Funktion sorgt dafür, dass die Animation schnell startet und dann langsamer wird.
         Sie wird oft verwendet, wenn ein Element die Ansicht verlässt1.
        ease-in-out: Diese Timing-Funktion ist eine Kombination aus ease-in und ease-out. 
        Die Animation startet und endet langsam, und ist nur in der Mitte schnell1. Dies gibt den Übergängen weiche Kanten und fühlt sich im Allgemeinen gut an. -->

        <!--  die transform-CSS-Eigenschaft definiert, die eine Transformation (wie z.B. Verschiebung, Skalierung, Drehung) auf ein Element anwendet. -->

         <!-- In JavaScript, wenn Sie setTimeout ohne einen zweiten Parameter (die Verzögerungszeit) aufrufen, wird die Funktion so bald wie möglich ausgeführt, aber immer noch nachdem der aktuelle Codeblock abgeschlossen ist. Dies wird oft als “asynchron” bezeichnet, weil es unabhängig vom Rest des Codes ausgeführt wird.