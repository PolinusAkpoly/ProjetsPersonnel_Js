export const saveToLocalStorage = (key, value) => {
    if (typeof value === 'object') {
      value = JSON.stringify(value); // Convertit l'objet en chaîne JSON si nécessaire
    }
    localStorage.setItem(key, value);
  }

  export const getFromLocalStorage =(key) =>{
    const value = localStorage.getItem(key);
    try {
      return JSON.parse(value); // Tente de convertir la chaîne JSON en objet
    } catch (e) {
      return value; // Retourne la valeur brute si ce n'est pas un JSON valide
    }
  }

  export const removeFromLocalStorage = (key) =>{
    localStorage.removeItem(key);
  }






