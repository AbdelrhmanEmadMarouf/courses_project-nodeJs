
const getCourses = async function getCourses(){
    let response = await fetch('http://localhost:5000/api/courses?limit=2&page=5') 
    let Courses = await response.json();
    console.log(Courses);
}

getCourses();