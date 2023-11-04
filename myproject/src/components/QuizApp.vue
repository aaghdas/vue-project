<template> 
<v-app id="app">
<HeaderLogedIn v-if="isLoggedIn" /><HeaderHome v-else />
<v-main id="content"> 
  
  <div v-if="!quizOver" class="quiz-container">
  <img class="quizlogo" src="../assets/quiz2.webp" >
    <div class="question-container" v-for="(question, index) in questions.slice(currentQuestion, currentQuestion + 2)" :key="question.id" >
      <p id="question">Frage {{ currentQuestion + index + 1 }} von {{ questions.length }}:&nbsp; {{ question.question }} </p>
      <div class="answer-container" v-for="(answer, answerIndex) in question.answers" :key="answerIndex">
        <input type="radio" :id="answer" :value="answer" :name="`question-${index}`" :disabled="submitted" v-model="userAnswers[`${currentQuestion + index}`]" @change="updateAnswer(currentQuestion + index)" />
        <label :for="answer">{{ answer }}</label>
      </div>
    </div>
    
      <v-btn class="quizbtn-absenden" color=rgb(0,255,128) v-if="currentQuestion + 2>= questions.length" @click="submitQuiz">Absenden</v-btn>
      <v-btn class="quizbtn-zurueck" color=rgb(0,255,128) @click="prevPage" :disabled="currentQuestion === 0"><v-icon>mdi-arrow-left-drop-circle</v-icon>&nbsp;Zurück</v-btn>
      <v-btn class="quizbtn-weiter" color=rgb(0,255,128) @click="submitAnswer" :disabled="submitted || currentQuestion + 2 >= questions.length">Weiter &nbsp;<v-icon>mdi-arrow-right-drop-circle</v-icon></v-btn>
     
      
  </div>

  <div v-else>
    <div class="result" v-if="this.score < 0.3">
      <img class="quizfailedLogo" src="../assets/quizfailed.gif" alt="Nicht bestanden Bild">
      <p id="result-text">{{ showResults() }}</p>
      <v-btn class="quizbtn-absenden" color=rgb(0,255,128) @click="restartQuiz">Quiz neustarten</v-btn>
    </div>
  
    <div class="result" v-else-if="this.score >= 0.3 && this.score < 0.8">
    <img class="quizfailedLogo" src="../assets/gutgemacht.gif" alt="Nicht bestanden Bild">
        <p id="result-text">{{ showResults() }}</p>
        <v-btn class="quizbtn-absenden" color=rgb(0,255,128) @click="restartQuiz">Quiz neustarten</v-btn>
    </div>
    <div class="result" v-else-if="this.score >= 0.8">
    <img class="quizfailedLogo" src="../assets/quizfirst.gif" alt="Nicht bestanden Bild">
        <p id="result-text">{{ showResults() }}</p>
        <v-btn class="quizbtn-absenden" color=rgb(0,255,128) @click="restartQuiz">Quiz neustarten</v-btn>
    </div>
  </div>  
  </v-main> 
    <FooterComponent />
</v-app> 
</template>

<script>
import HeaderHome from './HeaderHome.vue'
import HeaderLogedIn from './HeaderLogedIn.vue'
import FooterComponent from './FooterComponent.vue'
import { questions } from '../plugins/quizFragen.js'

export default {
  name: 'QuizApp',

  components: {
    HeaderHome,
    HeaderLogedIn,
    FooterComponent
  },

  data() {
    return {
      isLoggedIn: false,
      questions,
      currentQuestion: 0,
      userAnswers:{},
      score: 0,
      quizOver: false,
      submitted: false,
      showModal: false
    }
  },

  methods: {

     updateAnswer(questionIndex) {
  // Aktualisieren Sie die Benutzerantwort im Speicher
  const newValue = event.target.value;
  this.userAnswers = {
    ...this.userAnswers,
    [questionIndex]: newValue,
  };
},

    submitAnswer() {
  // Zurücksetzen der Punktzahl für die aktuellen Fragen
  let numCorrect = 0;
  
  // Überprüfen Sie, ob die Antwort richtig ist
  const currentAnswers = this.questions.slice(this.currentQuestion, this.currentQuestion + 2).map((question, index) => this.userAnswers[this.currentQuestion + index]);
  numCorrect = this.questions.slice(this.currentQuestion, this.currentQuestion + 2).filter((question, index) => question.correct === currentAnswers[index]).length;
  
  // Subtrahieren Sie die Punktzahl für die alten Antworten
  const oldAnswers = Object.values(this.userAnswers).slice(this.currentQuestion, this.currentQuestion + 2);
  numCorrect -= this.questions.slice(this.currentQuestion, this.currentQuestion + 2).filter((question, index) => question.correct === oldAnswers[index]).length;

  // Erhöhen Sie die Punktzahl um den aktuellen Wert
  this.score += numCorrect;
  
  // Zur nächsten Seite gehen
  this.currentQuestion += 2;
  
  // Überprüfen, ob das Quiz vorbei ist
  if (this.currentQuestion >= this.questions.length) {
    this.quizOver = true;
  }
  
  // Markieren Sie die aktuelle Frage als nicht eingereicht, damit sie später bearbeitet werden kann
  this.submitted = false;
},


    prevPage() {
      // Gehe zur vorherigen Seite
      this.currentQuestion -= 2;
    },

    nextPage() {
      // Gehe zur nächsten Seite
      this.currentQuestion += 2;
    },

    submitQuiz() {    
  // Berechnen Sie die Punktzahl
  const numCorrect = this.questions.filter((question, index) => question.correct === this.userAnswers[index]).length;
  this.score = numCorrect / this.questions.length;
  this.quizOver = true;
},

    restartQuiz() {
      // Setzen Sie alle Variablen zurück
      this.currentQuestion = 0;
      this.userAnswers = {};
      this.score = 0;
      this.quizOver = false;
      this.submitted = false;
    },

    showResults() {
      // Berechnen Sie den Prozentsatz der richtigen Antworten
      let percentage = Math.round((this.score) * 100);
      // Geben Sie eine Nachricht basierend auf dem Prozentsatz zurück
      if (percentage >= 80) {
        return `Herzlichen Glückwunsch! Du hast ${percentage}% der Fragen richtig beantwortet! 🎉`;
      } else if (percentage >= 50) {
        return `Gut gemacht! Du hast ${percentage}% der Fragen richtig beantwortet! 👍`;
      } else {
        return `Du hast nur ${percentage}% der Fragen richtig beantwortet!`;
      }
    }
  },

  async mounted() {
   
    let user = JSON.parse(localStorage.getItem('user-info'))
    if (user) {
      this.isLoggedIn = true;
    }
  }
};
</script>