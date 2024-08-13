
// import { movies } from "./dataMovies.js";
import { addDataToIndexedDB, fileToUrl, getAllDataFromIndexedDB,getDataFromIndexedDB, getData, updateDataInIndexedDB, setData, deleteDataFromIndexedDB, searchMovies } from "./lib.js";




const tbody = document.getElementById('movies-table-body');

const movies = await getAllDataFromIndexedDB()
console.log(movies[3].posterImageUrl);

movies?.forEach(movie => {
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${movie.title}</td>
    <td>${movie.realisateur}</td>
    <td>${movie.annee}</td>
    <td>${movie.genre}</td>
    <td><img src="${movie.posterImageUrl}" alt="${movie.title} Poster"></td>
    <td>
     <video id="videotd" width = '100px' controls autoplay>
      <source src="${movie.videoUrl}" type="video/mp4">
    </video>
    
    </td>
    <td>${new Date(movie.created_at).toLocaleString()}</td>
    <td>${new Date(movie.updated_at).toLocaleString()}</td>
    <td>
    <button class="voirButton" data-id="${movie.id}">Voir</button>
    <button class="modifierButton" data-id="${movie.id}">Modifier</button>
    <button class="supprimerButton" data-id="${movie.id}">Supprimer</button>
    </td>
  `;

  tbody.appendChild(row);
});

// Ajout de movies
const formModal = document.getElementById('formModal');
const buttonAjouter = document.getElementById('buttonAjouter');
const cancelformModal = document.getElementById('cancelformModal');
const inputsFile = document.querySelectorAll('input[type="file"]');
const movieForm = document.getElementById('movieForm');
const prevImage = document.getElementById('prevImage');
const prevVideo = document.getElementById('prevVideo');
const submit = document.getElementById('submit');
const update = document.getElementById('update');
const canceldetaillMovie = document.getElementById('canceldetaillMovie');
const detaillMovie = document.getElementById('detaillMovie');

const posterImageUrl = document.getElementById('posterImageUrl');
const videoUrl = document.getElementById('videoUrl');
const title = document.getElementById('title');
const realisateur = document.getElementById('realisateur');
const annee = document.getElementById('annee');
const genre = document.getElementById('genre');




const openFormaddMovies = () => {
  formModal.classList.remove('d-none');
}
buttonAjouter.onclick = openFormaddMovies;

const closeFormModal = () => {
  formModal.classList.add('d-none');
  window.location.reload()

}
cancelformModal.onclick = closeFormModal;

const closedetaillMovie = () => {
  detaillMovie.classList.add('d-none');
}
canceldetaillMovie.onclick = closedetaillMovie

// previsualisation img et video
const handleChangeInputFile = async (event) => {
  const file = event.target.files[0];

  // console.log(file);
  if (file) {
    const fileUrl = await fileToUrl(file);

    if (file.type.startsWith('image/')) {
      // console.log("image----" + fileUrl);


      // const img = document.createElement('img');
      // img.src = fileUrl;
      // img.style.width = '100%';
      // img.style.height = '100px';
      // prevImage.appendChild(img);
      prevImage.innerHTML = `<img src="${fileUrl}" width = '100%' height = '100px' alt="">`;

    } else {

      // const video = document.createElement('video');
      // video.setAttribute('controls', ''); // Ajoute les contrôles de la vidéo
      // video.setAttribute('autoplay', '');
      // video.style.width = '100%';
      // video.style.height = '300px';

      // const source = document.createElement('source');
      // source.src = fileUrl;
      // source.type = "video/mp4";
      // source.style.width = '100%';
      // source.style.height = '300px';

      // video.appendChild(source);




      if (prevVideo) {
        // prevVideo.appendChild(video);
        prevVideo.innerHTML = `<video controls autoplay width = '100%' height = '300px'>
                               <source src="${fileUrl}" type="video/mp4" width = '100%' height = '300px'></source>
                               </video>`
      } else {
        console.error('Element with id "prevVideo" not found');
      }

    }

  }


  if (posterImageUrl.value && videoUrl.value && !movieId) {
    submit.classList.remove('d-none')
  }

}

inputsFile.forEach(input => {
  input.onchange = handleChangeInputFile
})



// soumission du formulaire
let movieId;
const handleSubmit = async (event) => {
  event.preventDefault()
  // const idMovieUpdate = getData("idMovieUpdated")

  if (movieId) {
    const movieUpdated = getData('movieUpdated')
    console.log(movieId);
    const formData = new FormData(event.target);


    const data = {};

    formData.forEach(async (value, key) => {

      // if (key === 'posterImageUrl' || key === 'videoUrl') {
      //  console.log(value.name);
      //    if (value.name === '') {
      //     data[key] = movieUpdated.posterImageUrl
      //    }

      //   // data[key] = await fileToUrl(value);

      // } else {
      //   data[key] = value;
      // }
      if (key === 'posterImageUrl') {
        console.log(value.name);
        if (value.name === '') {
          data[key] = movieUpdated.posterImageUrl
        } else{
          data[key] = await fileToUrl(value);
        }
      } else if (key === 'videoUrl') {
        console.log(value.name);
        if (value.name === '') {
          data[key] = movieUpdated.videoUrl
        } else{
          data[key] = await fileToUrl(value);
        }
      } else {
        data[key] = value;
      }
      
    });
    data['created_at'] = "";
    data['updated_at'] = new Date();

    console.log(data);

    try {
      
      await updateDataInIndexedDB(movieId, data);
      console.log('Data Updated with success');
      
    } catch (error) {
      console.error('Error Updated data in IndexedDB', error);
    }

  } else {
    const formData = new FormData(event.target);

    console.log(formData);
    const data = {};

    formData.forEach(async (value, key) => {
      data[key] = value;
      // if (key === 'posterImageUrl' || key === 'videoUrl') {
      //   data[key] = await fileToUrl(value);
      // } else {
      //   data[key] = value;
      // }

    });
    data['posterImageUrl'] = await fileToUrl(data.posterImageUrl);
    data['videoUrl'] = await fileToUrl(data.videoUrl);

    data['created_at'] = new Date();
    data['updated_at'] = "";

    // if (Object.keys(data).length === (Object.keys(movies[0]).length - 1)) {
    //   document.getElementById('submit').addEventListener('click', function() {
    //     window.location.reload(); // Actualise la page
    //   });
    // }
    try {
      await addDataToIndexedDB(data);
      console.log('Data stored with success');
    } catch (error) {
      console.error('Error storing data in IndexedDB', error);
    }
  }


  window.location.reload()
  // submit.onclick = window.location.reload()


}
movieForm.onsubmit = handleSubmit

// button voir 

document.querySelectorAll('.voirButton').forEach(button => {

  button.addEventListener('click', async function () {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    const movieId = this.getAttribute('data-id');
    // console.log(movieId);
    // console.log(typeof movieId);
    const detaillMovie = document.getElementById('detaillMovie');
    detaillMovie.classList.remove('d-none');

    try {
      const dataMovie = await getDataFromIndexedDB(movieId);
      if (dataMovie) {
        // console.log(dataMovie);
        const movieTable_left = document.getElementById('movieTable_left');
        const video = document.getElementById('viewVideo');

        movieTable_left.innerHTML = `
        <tr>
        <th>Title:</th>
        <th>${dataMovie.title}</th>
      </tr>
      <tr>
        <th>Realisateur:</th>
        <th>${dataMovie.realisateur}</th>
      </tr>
      <tr>
        <th>Année:</th>
        <th>${dataMovie.annee}</th>
      </tr>
      <tr>
        <th>Genre:</th>
        <th>${dataMovie.genre}</th>
      </tr>
      <tr>
        <th>Poster Image:</th>
        <th><img src="${dataMovie.posterImageUrl}"  alt="Poster"></th>
      </tr>
      <tr>
        <th>Created at:</th>
        <th>${new Date(dataMovie.created_at).toLocaleString()}</th>
      </tr>
      <tr>
        <th>Updated at:</th>
        <th>${new Date(dataMovie.updated_at).toLocaleString()}</th>
      </tr>
        `;
        const source = document.createElement('source');
        const src = String(dataMovie.videoUrl)
        source.src = src;
        source.type = "video/mp4";
        source.style.width = '780px';
        source.style.height = '300px';

        video.appendChild(source);


      } else {
        detaillMovie.innerHTML = '<p>Movie not found</p>';
      }
    } catch (error) {
      console.error('Error getting data by ID from IndexedDB', error);
      detaillMovie.innerHTML = '<p>Error retrieving movie details</p>';
    }
  });
});

document.querySelectorAll('.modifierButton').forEach(button => {
  button.addEventListener('click', async function () {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    movieId = this.getAttribute('data-id');
    // setData("idMovieUpdated", movieId)
    openFormaddMovies()
    const title = document.getElementById('title');
    const realisateur = document.getElementById('realisateur');
    const annee = document.getElementById('annee');
    const genre = document.getElementById('genre');
    


    if (movieId) {
      update.classList.remove("d-none")
      try {
        const movie = await getDataFromIndexedDB(movieId)

        if (movie) {
          setData('movieUpdated', movie)
          //           title.defaultValue = movie.title;
          //           realisateur.defaultValue = movie.realisateur;
          //           annee.defaultValue = movie.annee;
          //           genre.defaultValue = movie.genre;
          //           posterImageUrl.defaultValue = movie.posterImageUrl;
          //           videoUrl.defaultValue = movie.videoUrl;


          title.value = movie.title;
          realisateur.value = movie.realisateur;
          annee.value = movie.annee;
          genre.value = movie.genre;


          if (movie.posterImageUrl) {

            const img = document.createElement('img');
            img.src = movie.posterImageUrl;
            img.style.width = '100%';
            img.style.height = '100px';
            prevImage.appendChild(img);


          }
          if (movie.videoUrl) {
            const video = document.createElement('video');
            video.setAttribute('controls', ''); // Ajoute les contrôles de la vidéo
            video.setAttribute('autoplay', '');
            video.style.width = '100%';
            video.style.height = '300px';

            const source = document.createElement('source');
            source.src = movie.videoUrl;
            source.type = "video/mp4";
            source.style.width = '100%';
            source.style.height = '300px';

            video.appendChild(source);

            if (prevVideo) {
              prevVideo.appendChild(video);
            } else {
              console.error('Element with id "prevVideo" not found');
            }

          }

        }



      } catch (error) {
        console.log(error);
      }

    }


  });
});


document.querySelectorAll('.supprimerButton').forEach(button => {
  button.addEventListener('click', async function () {
    const idMovieDelete = this.getAttribute('data-id');
    const deleteMovieModale = document.getElementById('deleteMovieModale');
    const contentDeleteModal = document.getElementById('contentDeleteModal');

    try {
      const movieDeleted = await getDataFromIndexedDB(idMovieDelete);
      deleteMovieModale.classList.remove('d-none');
      contentDeleteModal.innerHTML = `
        <div class="header">Delete Movie</div>
        <hr>
        <div class="content">Are you sure you want to delete: <strong>${movieDeleted.title}</strong>?</div>
        <video width='200px' height='100px' controls autoplay>
          <source src="${movieDeleted.videoUrl}" type="video/mp4">
        </video>
        <hr>
        <div class="footer">
          <button id="canceldeleteMovie" class="cancel">Cancel</button>
          <button class="supprimerButton" id="confirmeDeleteMovie">Confirm Delete</button>
        </div>
      `;

      document.getElementById('canceldeleteMovie').onclick = () => deleteMovieModale.classList.add('d-none');
      document.getElementById('confirmeDeleteMovie').onclick = async () => {
        try {
          await deleteDataFromIndexedDB(idMovieDelete);
          console.log(`Movie with id ${idMovieDelete} deleted successfully`);
          deleteMovieModale.classList.add('d-none');
          // Optional: Refresh the table or remove the row from the DOM
          window.location.reload();
        } catch (error) {
          console.log(error);
        }
      };
    } catch (error) {
      console.log(error);
    }
  });
});


// document.querySelectorAll('.supprimerButton').forEach(button => {
//   button.addEventListener('click', async function () {
//     const idMovieDelete = this.getAttribute('data-id');
//     const deleteMovieModale = document.getElementById('deleteMovieModale');
//     const contentDeleteModal = document.getElementById('contentDeleteModal');

//     try {
//       const movieDeleted = await getDataFromIndexedDB(idMovieDelete);
//       deleteMovieModale.classList.remove('d-none');
//       contentDeleteModal.innerHTML = `
//         <div class="header">Delete Movie</div>
//         <hr>
//         <div class="content">Are you sure to delete: <strong>${movieDeleted.title}</strong>?</div>
//         <video width='200px' height='100px' controls autoplay>
//           <source src="${movieDeleted.videoUrl}" type="video/mp4">
//         </video>
//         <hr>
//         <div class="footer">
//           <button id="canceldeleteMovie" class="cancel">Cancel</button>
//           <button class="supprimerButton" id="confirmeDeleteMovie">Confirm Delete</button>
//         </div>
//       `;

//       document.getElementById('canceldeleteMovie').onclick = () => deleteMovieModale.classList.add('d-none');
//       document.getElementById('confirmeDeleteMovie').onclick = async () => {
//         try {
//           console.log(idMovieDelete);
//           await deleteDataFromIndexedDB(idMovieDelete);
//           console.log(`Movie with id ${idMovieDelete} deleted successfully`);
//           // window.location.reload();
//         } catch (error) {
//           console.log(error);
//         }
//       };
//     } catch (error) {
//       console.log(error);
//     }
//   });
// });


// search

document.getElementById('searchButton').addEventListener('click', async () => {
  const searchType = document.getElementById('searchType').value;
  const query = document.getElementById('query').value;
  const searchError = document.getElementById('searchError');
  const movieNotFound = document.getElementById('movieNotFound');
  // const tbody = document.getElementById('movies-table-body');
  
  console.log("searchType:", searchType);
  console.log("query:", query);

  if (!searchType || !query.trim()) {
    searchError.classList.remove('d-none');
    return;
  }
  
  searchError.classList.add('d-none');
  
  const results = await searchMovies(query, searchType);
  
  if (results.length === 0) {
    tbody.innerHTML = "";
    movieNotFound.innerHTML = "<p>No movies found.</p>";
    return;
  }

  console.log(results);

  tbody.innerHTML = ""; 
  movieNotFound.innerHTML = ""; 

  results.forEach(movie => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${movie.title}</td>
      <td>${movie.realisateur}</td>
      <td>${movie.annee}</td>
      <td>${movie.genre}</td>
      <td><img src="${movie.posterImageUrl}" alt="${movie.title} Poster"></td>
      <td>
        <video id="videotd" width='100px' controls autoplay>
          <source src="${movie.videoUrl}" type="video/mp4">
        </video>
      </td>
      <td>${new Date(movie.created_at).toLocaleString()}</td>
      <td>${new Date(movie.updated_at).toLocaleString()}</td>
      <td>
        <button class="voirButton" data-id="${movie.id}">Voir</button>
        <button class="modifierButton" data-id="${movie.id}">Modifier</button>
        <button class="supprimerButton" data-id="${movie.id}">Supprimer</button>
      </td>
    `;

    tbody.appendChild(row);
  });
});


