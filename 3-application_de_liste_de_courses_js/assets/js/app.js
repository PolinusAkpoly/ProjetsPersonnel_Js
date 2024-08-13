import { getFromLocalStorage, removeFromLocalStorage, saveToLocalStorage } from "../lib/localeStorage.services.js";
import { generateUniqueId } from "../lib/utile.js";

const courses = getFromLocalStorage('courses');

const tableBody = document.getElementById('contentCourses');
const inputArticle = document.getElementById('inputArticle');

const protocol = window.location.protocol; // "http:" or "https:"
const host = window.location.hostname; // "127.0.0.1"
const port = window.location.port; // "5500"

const displaycourses = (courses) => {


    courses.forEach((course, index) => {
        const row = document.createElement('tr');

        if (course.isbuy) {
            const idChamp = document.createElement('td');
            idChamp.textContent = index + 1;
            idChamp.classList.add('marque')
            row.appendChild(idChamp);

            const nameChamp = document.createElement('td');
            nameChamp.textContent = course.name;
            nameChamp.classList.add('marque')
            row.appendChild(nameChamp);

            const createdAtChamp = document.createElement('td');
            createdAtChamp.textContent = new Date(course.created_at).toLocaleString();
            createdAtChamp.classList.add('marque')
            row.appendChild(createdAtChamp);

            const isbuyChamp = document.createElement('td');
            // isbuyChamp.innerHTML = course.isbuy ? 'Oui' : 'Non';
            isbuyChamp.innerHTML = `<button id="supprimer" data-id="${course._id}">Supprimer</button>`

            row.appendChild(isbuyChamp);

        } else {
            const idChamp = document.createElement('td');
            idChamp.textContent = index + 1;
            row.appendChild(idChamp);

            const nameChamp = document.createElement('td');
            nameChamp.textContent = course.name;
            row.appendChild(nameChamp);

            const createdAtChamp = document.createElement('td');
            createdAtChamp.textContent = new Date(course.created_at).toLocaleString();
            row.appendChild(createdAtChamp);

            const isbuyChamp = document.createElement('td');
            // isbuyChamp.innerHTML = course.isbuy ? 'Oui' : 'Non';
            isbuyChamp.innerHTML = `<button id="marquer" data-id="${course._id}">Marquer</button>
                                    <button id="supprimer" data-id="${course._id}">Supprimer</button>`
            row.appendChild(isbuyChamp);
        }


        tableBody?.appendChild(row);
    });
}

if (courses) {
    displaycourses(courses);
}


document.getElementById('ajoutButton')?.addEventListener('click', () => {

    const path = "formModal.html"; // Your path to the HTML file

    const url = `${protocol}//${host}:${port}/${path}`;

    window.location.replace(url)
})

document.getElementById('submit')?.addEventListener('click', (event) => {
    event.preventDefault()
    const data = {};

    data._id = generateUniqueId();
    data.name = inputArticle.value;
    data.isbuy = false;
    data.created_at = new Date();


    const datas = courses ? courses : [];
    datas.unshift(data);
    saveToLocalStorage('courses', datas);

    const path = "index.html"; // Your path to the HTML file

    const url = `${protocol}//${host}:${port}/${path}`;

    window.location.replace(url)

})

const buttonsSupprimer = document.querySelectorAll('#supprimer');
buttonsSupprimer.forEach(buttonSupprimer => {
    buttonSupprimer?.addEventListener('click', (event) => {
        event.preventDefault()
        const _id = event.target.getAttribute('data-id');
        // console.log(_id);

        const newCourses = courses.filter((course) => course._id !== _id);
        // console.log(newCourses);
        saveToLocalStorage('courses', newCourses);

        window.location.reload()
    })
});
const buttonsMarquer = document.querySelectorAll('#marquer');
buttonsMarquer.forEach(marquer => {
    marquer?.addEventListener('click', (event) => {
        event.preventDefault()
        const _id = event.target.getAttribute('data-id');
        console.log(_id);

        const newCourses = courses.map((course) => {

            if (course._id === _id) {
                course.isbuy = true;

                console.log(course);

            }

            return course;
        });
        // console.log(newCourses);

        saveToLocalStorage('courses', newCourses);

        window.location.reload()

    })
});

document.getElementById('articlesAcheter')?.addEventListener('click', () => {

    const datasArticlesAcheter = courses.filter((course) => course.isbuy === true)
    console.log(datasArticlesAcheter);

    tableBody.innerHTML = "";
    datasArticlesAcheter?.forEach((course, index) => {


        const row = document.createElement('tr');


        const idChamp = document.createElement('td');
        idChamp.textContent = index + 1;
        idChamp.classList.add('marque')
        row.appendChild(idChamp);

        const nameChamp = document.createElement('td');
        nameChamp.textContent = course.name;
        nameChamp.classList.add('marque')
        row.appendChild(nameChamp);

        const createdAtChamp = document.createElement('td');
        createdAtChamp.textContent = new Date(course.created_at).toLocaleString();
        createdAtChamp.classList.add('marque')
        row.appendChild(createdAtChamp);

        const isbuyChamp = document.createElement('td');
        // isbuyChamp.innerHTML = course.isbuy ? 'Oui' : 'Non';
        isbuyChamp.innerHTML = `<button id="supprimer" data-id="${course._id}">Supprimer</button>`
        row.appendChild(isbuyChamp);

        tableBody?.appendChild(row);

    })

})

document.getElementById('articlesNonAcheter')?.addEventListener('click', () => {

    const datasArticlesNonAcheter = courses.filter((course) => course.isbuy === false)
    console.log(datasArticlesNonAcheter);

    tableBody.innerHTML = "";
    datasArticlesNonAcheter?.forEach((course, index) => {


        const row = document.createElement('tr');


        const idChamp = document.createElement('td');
        idChamp.textContent = index + 1;
        //  idChamp.classList.add('marque')
        row.appendChild(idChamp);

        const nameChamp = document.createElement('td');
        nameChamp.textContent = course.name;
        //  nameChamp.classList.add('marque')
        row.appendChild(nameChamp);

        const createdAtChamp = document.createElement('td');
        createdAtChamp.textContent = new Date(course.created_at).toLocaleString();
        //  createdAtChamp.classList.add('marque')
        row.appendChild(createdAtChamp);

        const isbuyChamp = document.createElement('td');
        // isbuyChamp.innerHTML = course.isbuy ? 'Oui' : 'Non';
        isbuyChamp.innerHTML = `<button id="marquer" data-id="${course._id}">Marquer</button>
                                    <button id="supprimer" data-id="${course._id}">Supprimer</button>`
        row.appendChild(isbuyChamp);

        tableBody?.appendChild(row);

    })

})

document.getElementById('deletAllCourses')?.addEventListener('click', () => {
    removeFromLocalStorage('courses');
   
    
    window.location.reload();
})








