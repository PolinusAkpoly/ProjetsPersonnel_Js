export const generateUniqueId = () =>{
    const timestamp = Date.now().toString(36); // Convertit le timestamp en base 36
    const randomNum = Math.random().toString(36).substring(2, 15); // Génère un nombre aléatoire en base 36
    return timestamp + randomNum;
  }

 




















