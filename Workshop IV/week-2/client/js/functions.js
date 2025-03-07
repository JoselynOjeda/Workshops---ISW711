function createTeacher() {
    const firstName = document.getElementById('first_name').value;
    const lastName = document.getElementById('last_name').value;
    const cedula = document.getElementById('cedula').value;
    const age = document.getElementById('age').value;

    fetch('http://localhost:3001/api/teachers', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            cedula: cedula,
            age: age
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
    })
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Profesor creado exitosamente',
        });
        document.getElementById('first_name').value = '';
        document.getElementById('last_name').value = '';
        document.getElementById('cedula').value = '';
        document.getElementById('age').value = '';
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear al profesor: ' + error.message,
        });
    });
}

function getTeachers() {
    fetch('http://localhost:3001/api/teachers')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
    })
    .then(data => {
        const table = document.getElementById('resultTable');
        // Limpia el cuerpo de la tabla antes de agregar nuevos datos
        while (table.rows.length > 1) {  // Asegúrate de no eliminar el encabezado
            table.deleteRow(1);
        }
        data.forEach(teacher => {
            const row = table.insertRow(-1); // Inserta una fila al final de la tabla
            row.insertCell(0).textContent = teacher._id; // ID del profesor
            row.insertCell(1).textContent = teacher.first_name; // Nombre del profesor
            row.insertCell(2).textContent = teacher.last_name; // Apellido del profesor
            row.insertCell(3).textContent = teacher.cedula; // Cédula del profesor
            row.insertCell(4).textContent = teacher.age; // Edad del profesor
        });
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `No se pudo obtener la lista de profesores: ${error.message}`,
        });
    });
}

function getCourses() {
    const token = sessionStorage.getItem('authorization'); // Obtener el token del sessionStorage

    fetch('http://localhost:3001/api/courses', {
        method: 'GET',
        headers: {
            'Authorization': token, // Enviar el token en el header de Authorization
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        const table = document.getElementById('coursesTable');
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
        data.forEach(course => {
            const row = table.insertRow();
            row.insertCell(0).textContent = course.name;
            row.insertCell(1).textContent = course.code;
            row.insertCell(2).textContent = course.description;
            row.insertCell(3).textContent = course.teacher ? `${course.teacher.first_name} ${course.teacher.last_name}` : 'Sin asignar';
            
            const actions = row.insertCell(4);
            actions.innerHTML = `<button class="btn btn-info btn-sm" onclick="editCourse('${course._id}')">Editar</button>
                                 <button class="btn btn-danger btn-sm" onclick="deleteCourse('${course._id}')">Eliminar</button>`;
        });
    })
    .catch(error => {
        console.error('Failed to fetch courses:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `No se pudo obtener la lista de cursos: ${error.message}`,
        });
    });
}


function editCourse(courseId) {
    window.location.href = `editCourse.html?courseId=${courseId}`;
}


function loadTeachers() {
    const url = 'http://localhost:3001/api/teachers'; // URL de la API
    const selectElement = document.getElementById('profesor'); 

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); 
        selectElement.length = 1; 

        // Añade cada profesor como una opción al select
        data.forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher._id;
            option.textContent = `${teacher.first_name} ${teacher.last_name} (${teacher._id})`; // Incluyendo el ID en el texto visible
            selectElement.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Failed to fetch teachers:', error);
        alert(`Failed to fetch teachers: ${error.message}`);
    });
}

function createCourse() {
    const name= document.getElementById('name').value;
    const code = document.getElementById('code').value;
    const descrip = document.getElementById('description').value;
    const prof = document.getElementById('profesor').value;

    if (!name || !code || !descrip || !prof) {
        Swal.fire({
            icon: 'warning',
            title: 'Falta información',
            text: 'Por favor, completa todos los campos antes de guardar.',
        });
        return;
    }

    fetch('http://localhost:3001/api/courses', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            code: code,
            description: descrip,
            teacher: prof
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
    })
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Curso ha sido creado exitosamente',
        });
        document.getElementById('name').value = '';
        document.getElementById('code').value = '';
        document.getElementById('description').value = '';
        document.getElementById('profesor').value = '';
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear el curso: ' + error.message,
        });
    });
}

function deleteCourse(courseId) {
    fetch(`http://localhost:3001/api/courses/${courseId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP status ${response.status}`);
        if(response.status === 204) {  // Si no hay contenido, maneja apropiadamente
            Swal.fire('Eliminado', 'El curso ha sido eliminado correctamente.', 'success').then(() => {
                // Actualizar la lista de cursos o redirigir, según necesites
                window.location.reload();  // Por ejemplo, recargar la página o actualizar lista
            });
        }
        return response.json(); // solo intenta parsear JSON si la respuesta lo incluye
    })
    .catch(error => {
        Swal.fire('Error', 'No se pudo eliminar el curso: ' + error.message, 'error');
    });
}

// functions.js
function fetchCourses() {
    const token = sessionStorage.getItem('authorization');
    fetch('http://localhost:3001/api/courses', {
        method: 'GET', // Especifica el método, si no es especificado, 'GET' es el método por defecto
        headers: {
            'Authorization': token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

