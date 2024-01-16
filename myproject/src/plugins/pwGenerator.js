export default 
function generatePassword() { 
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "#?!@$%^&*-_,.;";
    const length = 12;
  
    
    let starkesPassword = "";
  
    
    for (let i = 0; i < length; i++) {
      
      const category = Math.floor(Math.random() * 4);
  
      
      let char;
      switch (category) {
        case 0:
          char = lowerCase[Math.floor(Math.random() * lowerCase.length)];
          break;
        case 1:
          char = upperCase[Math.floor(Math.random() * upperCase.length)];
          break;
        case 2:
          char = numbers[Math.floor(Math.random() * numbers.length)];
          break;
        case 3:
          char = symbols[Math.floor(Math.random() * symbols.length)];
          break;
      }
  
      
      starkesPassword += char;
    }
  
    
    if (
      /(?=.*[a-z])/.test(starkesPassword) && 
      /(?=.*[A-Z])/.test(starkesPassword) && 
      /(?=.*[0-9])/.test(starkesPassword) && 
      /(?=.*[#?!@$%^&*-])/.test(starkesPassword) 
    ) {
      
      return starkesPassword;
    } else {
      
      return generatePassword();
    }
  }
 