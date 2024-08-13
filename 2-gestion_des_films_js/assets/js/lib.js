export const fileToUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        resolve(reader.result);
      };
  
      reader.onerror = reject;
  
      reader.readAsDataURL(file); // Utilisez readAsDataURL pour obtenir une URL base64
    });
  };

  export const setData = (key, value) => {
    if (typeof key !== 'string' || typeof value === 'undefined') {
        console.error('Key must be a string and value must be defined');
        return;
    }
    
    try {
        const jsonData = JSON.stringify(value);
        localStorage.setItem(key, jsonData);
    } catch (e) {
        console.error('Error storing data in local storage', e);
    }
}

export const getData = (key) => {
  if (typeof key !== 'string') {
      console.error('Key must be a string');
      return null;
  }
  
  try {
      const jsonData = localStorage.getItem(key);
      return jsonData ? JSON.parse(jsonData) : null;
  } catch (e) {
      console.error('Error retrieving data from local storage', e);
      return null;
  }
}

const dbName = 'MovieDatabase';
const storeName = 'Movies';

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

export const addDataToIndexedDB = async (data) => {
  
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(data);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const updateDataInIndexedDB = async (id, updatedData) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put({ ...updatedData, id });

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};


export const getAllDataFromIndexedDB = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const getDataFromIndexedDB = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(Number(id)); // Assurez-vous que l'ID est un nombre

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// export const deleteDataFromIndexedDB = async (id) => {
//   console.log(id);
//   try {
//     const db = await openDB();
//     return new Promise((resolve, reject) => {
//       const transaction = db.transaction([storeName], 'readwrite');
//       const store = transaction.objectStore(storeName);
//       const request = store.delete(id);

//       request.onsuccess = () => {
//         resolve();
//       };

//       request.onerror = () => {
//         reject(request.error);
//       };
//     });
//   } catch (error) {
//     console.error("Erreur lors de l'ouverture d'IndexedDB :", error);
//     throw error; // Relancer l'erreur pour qu'elle soit gérée par l'appelant
//   }
// };

export function deleteDataFromIndexedDB(key) {
  // Ouvrir la base de données
  var request = indexedDB.open(dbName);

  request.onerror = function(event) {
      console.log("Erreur d'ouverture de la base de données:", event.target.errorCode);
  };

  request.onsuccess = function(event) {
      var db = event.target.result;
      var transaction = db.transaction([storeName], "readwrite");
      var objectStore = transaction.objectStore(storeName);

      var deleteRequest = objectStore.delete(key);

      deleteRequest.onsuccess = function(event) {
          console.log("Élément supprimé avec succès!");
      };

      deleteRequest.onerror = function(event) {
          console.log("Erreur lors de la suppression de l'élément:", event.target.errorCode);
      };
  };
}


export const searchMovies = async (query, searchType) => {
  try {
    const movies = await getAllDataFromIndexedDB();
    if (!movies) {
      return [];
    }

    const lowerCaseQuery = query.toLowerCase();
    return movies.filter(movie => {
      if (searchType === 'title' && movie.title.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      if (searchType === 'realisateur' && movie.realisateur.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      if (searchType === 'annee' && movie.annee.toString().includes(lowerCaseQuery)) {
        return true;
      }
      return false;
    });
  } catch (error) {
    console.error('Error searching data in IndexedDB', error);
    return [];
  }
};














