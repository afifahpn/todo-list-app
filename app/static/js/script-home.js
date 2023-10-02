const API_HOST = 'http://127.0.0.1:5000/api';

let getIsLogin = localStorage.getItem("access_token");
if (!getIsLogin) {
    window.location.href = "/auth/login"; //
}

// Drag N Drop
function allowDrop(event) {
    event.preventDefault();
}
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    event.target.appendChild(document.getElementById(data));
    const dataId = event.srcElement.lastChild.id;

    checkStatus(dataId);
}

function updateStatus(id, status){
    // ajax call
    const xhr = new XMLHttpRequest();
    const url = API_HOST + "/tasks/status/"+id;

    const data = JSON.stringify({
        status: !status
    });

    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.setRequestHeader(
        "Authorization",
        `Bearer ${localStorage.getItem("access_token")}`
    );

    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            const response = JSON.parse(this.response);
            // console.log(response);
            location.reload();
        }
    };
    return xhr.send(data);
}

// ketika memindahkan task tertentu, harus mendapatkan status terlebih dahulu
function checkStatus(id){
    const xhr = new XMLHttpRequest();
    const url = API_HOST + "/tasks/"+id;

    xhr.open("GET", url, true);
    xhr.setRequestHeader(
        "Authorization",
        `Bearer ${localStorage.getItem("access_token")}`
    );

    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            const response = JSON.parse(this.response);
            updateStatus(id, response.data.status);
        }
    };
    return xhr.send();
}

const todoItem = document.getElementById('todo');
const doneItem = document.getElementById("done");
const task_project = document.getElementById("task_project");


// menampilkan data
window.onload = function () {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        window.location.href = "../auth/login";
    }

    // current_project();
    
    data_task();
    pilih_project();
    pilih_project_add();
    pilih_project_edit();
}

function data_task(){
    // ajax call
    const task_project_value = task_project.value;
    if(task_project_value == 'Pilih Project'){
        while(todoItem.firstChild){
            todoItem.removeChild(todoItem.firstChild)
        }
        while(doneItem.firstChild){
            doneItem.removeChild(doneItem.firstChild)
        }
        const url = API_HOST + "/tasks/";

        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader(
            "Authorization", 
            `Bearer ${localStorage.getItem('access_token')}`);
        // ngecek datanya dapet atau tidak
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // check data apakah sudah ada di local storage, 
                // harus di jsonparse, karena semua data yg disimpan di local storage bentuknya string, makanya harus di parse agar kembali ke bentuknya aslinya
                const tasks = JSON.parse(this.response);

                tasks["data"].forEach((task) => {
                    // render ke html
                    let article = document.createElement('article');
                    let badgeDelete = document.createElement('a');
                    let badgeEdit = document.createElement('a');
                    let badgeProject = document.createElement('span');
                    let p = document.createElement("p");
                    let h4 = document.createElement("h4");
                    h4.appendChild(document.createTextNode(task.title));
                    h4.setAttribute("id",task.task_id);
                    p.appendChild(document.createTextNode(task.description));

                    article.setAttribute("class", 'border p-3 mt-3');
                    article.setAttribute("ondragstart", 'drag(event)');
                    article.setAttribute("draggable", 'true');
                    article.setAttribute("id", task.task_id);

                    badgeDelete.setAttribute('href', "#");
                    badgeDelete.setAttribute('class', "badge bg-danger");
                    badgeDelete.setAttribute('style', "text-decoration:none");
                    badgeDelete.setAttribute('data-id', task.task_id);
                    badgeDelete.setAttribute("data-bs-toggle", 'modal');
                    badgeDelete.setAttribute("data-bs-target", '#myModalDelete');

                    badgeEdit.setAttribute('href', "#");
                    badgeEdit.setAttribute('class', "mx-1 badge bg-warning");
                    badgeEdit.setAttribute('style', "text-decoration:none; color:black;");
                    badgeEdit.setAttribute('data-id', task.task_id);
                    badgeEdit.setAttribute("data-title", task.title);
                    badgeEdit.setAttribute("data-desc", task.description);
                    badgeEdit.setAttribute("data-bs-toggle", 'modal');
                    badgeEdit.setAttribute("data-bs-target", '#myModalEdit');

                    badgeProject.setAttribute('class', "float-end badge bg-primary");
                    badgeProject.setAttribute('style', "text-align: right");
                    badgeProject.setAttribute("data-id", task.project_id);

                    article.appendChild(badgeProject);
                    article.appendChild(h4);
                    article.appendChild(p);
                    article.appendChild(badgeEdit);
                    article.appendChild(badgeDelete);
                    badgeDelete.appendChild(document.createTextNode("Delete"));
                    badgeEdit.appendChild(document.createTextNode("Edit"));
                    badgeProject.appendChild(document.createTextNode(task.project_title));

                    // untuk value option saat menambahkan task
                    // const option = document.createElement("option");
                    // option.text = task.project_title;
                    // option.value = task.project_id;
                    // pilih_project.appendChild(option);

                    if(task.status == true){
                        article.setAttribute("style", "text-decoration: line-through")
                        doneItem.appendChild(article);
                    } else {
                        todoItem.appendChild(article);
                    }
                });
            }
        }
        // kirim request
        xhr.send();
    } else {
        while(todoItem.firstChild){
            todoItem.removeChild(todoItem.firstChild)
        }
        while(doneItem.firstChild){
            doneItem.removeChild(doneItem.firstChild)
        }
        const url = API_HOST + "/tasks/project/" + task_project.value;
        

        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader(
            "Authorization", 
            `Bearer ${localStorage.getItem('access_token')}`);
        // ngecek datanya dapet atau tidak
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // check data apakah sudah ada di local storage, 
                // harus di jsonparse, karena semua data yg disimpan di local storage bentuknya string, makanya harus di parse agar kembali ke bentuknya aslinya
                const tasks = JSON.parse(this.response);
                
                tasks["data"].forEach((task) => {
                    // render ke html
                    article = document.getElementById('article');

                    const article_new = document.createElement('article');
                    let badgeDelete = document.createElement('a');
                    let badgeEdit = document.createElement('a');
                    let badgeProject = document.createElement('span');
                    let p = document.createElement("p");
                    let h4 = document.createElement("h4");
                    h4.appendChild(document.createTextNode(task.title));
                    h4.setAttribute("id",task.task_id);
                    p.appendChild(document.createTextNode(task.description));

                    article_new.setAttribute("class", 'border p-3 mt-3');
                    article_new.setAttribute("ondragstart", 'drag(event)');
                    article_new.setAttribute("draggable", 'true');
                    article_new.setAttribute("id", task.task_id);

                    badgeDelete.setAttribute('href', "#");
                    badgeDelete.setAttribute('class', "badge bg-danger");
                    badgeDelete.setAttribute('style', "text-decoration:none");
                    badgeDelete.setAttribute('data-id', task.task_id);
                    badgeDelete.setAttribute("data-bs-toggle", 'modal');
                    badgeDelete.setAttribute("data-bs-target", '#myModalDelete');

                    badgeEdit.setAttribute('href', "#");
                    badgeEdit.setAttribute('class', "mx-1 badge bg-warning");
                    badgeEdit.setAttribute('style', "text-decoration:none; color:black;");
                    badgeEdit.setAttribute('data-id', task.task_id);
                    badgeEdit.setAttribute("data-title", task.title);
                    badgeEdit.setAttribute("data-desc", task.description);
                    badgeEdit.setAttribute("data-bs-toggle", 'modal');
                    badgeEdit.setAttribute("data-bs-target", '#myModalEdit');

                    badgeProject.setAttribute('class', "float-end badge bg-primary");
                    badgeProject.setAttribute('style', "text-align: right");
                    badgeProject.setAttribute("data-id", task.project_id);

                    article_new.appendChild(badgeProject);
                    article_new.appendChild(h4);
                    article_new.appendChild(p);
                    article_new.appendChild(badgeEdit);
                    article_new.appendChild(badgeDelete);
                    badgeDelete.appendChild(document.createTextNode("Delete"));
                    badgeEdit.appendChild(document.createTextNode("Edit"));
                    badgeProject.appendChild(document.createTextNode(task.project_title));

                    if(task.status == true){
                        article_new.setAttribute("style", "text-decoration: line-through")
                        doneItem.appendChild(article_new);
                    } else {
                        todoItem.appendChild(article_new);
                    }
                });
            }
        }
        // kirim request
        xhr.send();
    }
}

// fungsi untuk menampilkan option project berdasarkan user
function pilih_project(){
    const xhr = new XMLHttpRequest();
    const url = API_HOST + "/projects";

    xhr.open("GET", url, true);
    xhr.setRequestHeader(
        "Authorization",
        `Bearer ${localStorage.getItem("access_token")}`
    );

    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            const project = JSON.parse(this.response);

            project["data"].forEach((task) => {
                const option = document.createElement("option");
                option.text = task.title;
                option.value = task.project_id;
                task_project.appendChild(option);
            });
        }
    };
    return xhr.send();
}

function pilih_project_add(){
    const pilih_project = document.getElementById("pilih_project");

    const xhr = new XMLHttpRequest();
    const url = API_HOST + "/projects";

    xhr.open("GET", url, true);
    xhr.setRequestHeader(
        "Authorization",
        `Bearer ${localStorage.getItem("access_token")}`
    );

    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            const project = JSON.parse(this.response);

            project["data"].forEach((task) => {
                const option = document.createElement("option");
                option.text = task.title;
                option.value = task.project_id;
                pilih_project.appendChild(option);
            });
        }
    };
    return xhr.send();
}

function pilih_project_edit(){
    const pilih_project = document.getElementById("edit-project");

    const xhr = new XMLHttpRequest();
    const url = API_HOST + "/projects";

    xhr.open("GET", url, true);
    xhr.setRequestHeader(
        "Authorization",
        `Bearer ${localStorage.getItem("access_token")}`
    );

    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            const project = JSON.parse(this.response);

            project["data"].forEach((task) => {
                const option = document.createElement("option");
                option.text = task.title;
                option.value = task.project_id;
                pilih_project.appendChild(option);
            });
        }
    };
    return xhr.send();
}

// fungsi add
const addForm = document.getElementById("add-form");
// tambah event listener untuk trigger button submit
addForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const xhr = new XMLHttpRequest();
    const url = API_HOST + "/tasks";

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const project_id = document.getElementById('pilih_project').value;

    // konfigurasi toast
    const toastAdd = document.getElementById('liveToastAdd');
    const toastBodyAdd = document.getElementById('toast-body-add');
    const toast = new bootstrap.Toast(toastAdd);

    // validasi input
    if(title == ""){
        toastBodyAdd.innerHTML = "Isian title tidak boleh kosong";
        toast.show();
    } 
    if(description == ""){
        toastBodyAdd.innerHTML = "Isian deskripsi tidak boleh kosong";
        toast.show();
    }
    if(project_id == ""){
        toastBodyAdd.innerHTML = "Isian Pilih Project tidak boleh kosong";
        toast.show();
    }

    let new_data = JSON.stringify({
        title:title,
        description:description,
        project_id:project_id
    });

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem('access_token')}`);
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            // const modalAdd = document.getElementById("modalTambah");
            const modalTambah = bootstrap.Modal.getInstance("#myModalAdd");
            modalTambah.hide();
            addForm.reset();
            // refresh form
            location.reload();
        } else {
            // konfigurasi toast
            const toastLive = document.getElementById('liveToast');
            const toastMsg = document.getElementById('toast-body');
            const toast = bootstrap.Toast(toastLive);
            toastMsg.innerHTML = "data berhasil dimasukkan";
            toast.show();
        }
    }
    xhr.send(new_data);
});

//fungsi edit
const modalEdit = document.getElementById("myModalEdit");
// akan muncul ketika terbuka
modalEdit.addEventListener("show.bs.modal",function(event) {
    let dataId = event.relatedTarget.attributes["data-id"];
    const xhr = new XMLHttpRequest();
    const url = API_HOST + "/tasks/"+ dataId.value;
    // check apakah datanya sudah ada atau belum

    // 1. ngambil htmlnya
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem('access_token')}`);
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            // ambil datanya dulu
            const tasks = JSON.parse(this.response);
            const oldTitle = document.getElementById('edit-title');
            const oldProject = document.getElementById('edit-project');
            const oldDesc = document.getElementById('edit-description');
            // 2. assign old value to form
            oldTitle.value = tasks.data.title;
            oldProject.value = tasks.data.project_id;
            oldDesc.value = tasks.data.description;
            console.log(tasks.data.project_id)
        } else {
            console.log(this.response);
        }
    };
    xhr.send();

    const editForm = document.getElementById("edit-form");
    editForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const xhr = new XMLHttpRequest();
        const url = API_HOST + "/tasks/"+ dataId.value;
        // check apakah datanya sudah ada atau belum

        let newTitle = document.getElementById('edit-title').value;
        let newProject = document.getElementById('edit-project').value;
        let newDesc = document.getElementById('edit-description').value;

         // konfigurasi toast
        const toastEdit = document.getElementById('liveToastEdit');
        const toastBodyEdit = document.getElementById('toast-body-edit');
        const toast = new bootstrap.Toast(toastEdit);

        // validasi input
        if (newTitle == "" || newDesc == "" || newProject == "Pilih Project"){
            toastBodyEdit.innerHTML = "Tidak boleh ada data yang kosong";
            toast.show();
        }

        let newTask = JSON.stringify({
            title: newTitle,
            description: newDesc,
            project_id: newProject
        });

        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem('access_token')}`);
        xhr.onreadystatechange = function(){
            if(this.readyState==4 &&this.status == 200){
                const modalEdit = bootstrap.Modal.getInstance("#myModalEdit");
                modalEdit.hide();
                editForm.reset();
                location.reload();
            } else {
                toastBodyEdit.innerHTML = this.response;
                toast.show();
            }
        };
        xhr.send(newTask);
    });
});

//fungsi menghapus
modalDelete = document.getElementById("myModalDelete");
modalDelete.addEventListener("show.bs.modal", (event) => {
    const dataId = event.relatedTarget.attributes["data-id"];
    const deleteForm = document.getElementById("delete-form");
    // const data = JSON.parse(localStorage.getItem("data"));
    // let diffTask = data.filter(function (d) {
    //     return d.id != dataId.value
    // });
    deleteForm.addEventListener('submit', function(event) {
        event.preventDefault();

        let xhr= new XMLHttpRequest();
        let url = API_HOST+"/tasks/"+dataId.value;
        // localStorage.setItem("data", JSON.stringify(diffTask));
        xhr.open("DELETE", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem('access_token')}`);
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                const response = JSON.parse(this.response);
                const modalDeleteHide = bootstrap.Modal.getInstance("#myModalDelete");

                const alertLoc = document.getElementById("alert-loc");
                const alertEl = document.createElement("div");
                alertEl.setAttribute("class", "alert alert-success");
                alertEl.setAttribute("role", "alert");
                alertEl.innerHTML = response.message;

                alertLoc.append(alertEl);

                document.getElementById(dataId.value).classList.add('d-none');
                modalDeleteHide.hide();
            }
        };
        xhr.send();
    });
});

const logout = document.getElementById("logout");
logout.addEventListener("click", function (e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    let url = "http://127.0.0.1:5000/api/auth/logout";
    xhr.open("POST", url, true);
    // xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.setRequestHeader(
        "Authorization",
        `Bearer ${localStorage.getItem('access_token')}`
    );
    xhr.onreadystatechange = function () {
        if(this.response == "Token has expired"){
            localStorage.removeItem("access_token");
            window.location.href = "../auth/login";
        }

        if (this.readyState == 4 && this.status == 200) {
            localStorage.removeItem("access_token");
            window.location.href = "../auth/login";
        } else {
            // alert("Ada Kesalahan");
            // alert(this.response);
            // if(this.response == "Token has expired"){
                
            // }
            localStorage.removeItem("access_token");
            window.location.href = "../auth/login";
        }
    };
    xhr.send();

    //remove token from locasStorage
});

//FUNGSI UNTUK MEREFRESH TOKEN
function refreshToken(){
    let xhr = new XMLHttpRequest();
    let url = "http://127.0.0.1:5000/api/auth/refresh";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem('access_token')}`);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.response)
            localStorage.setItem("access_token", response.access_token)
        }
    };
    xhr.send();
}
// run refresh token every 15 minutes
setInterval(refreshToken, 900000)

//fugnsi untuk jam
let p = document.getElementById("jam")
function myTime() {
    let jam = new Date()
    p.innerHTML = jam.toLocaleTimeString([], {
        hour12: false
    })
}
setInterval(myTime, 1000)


