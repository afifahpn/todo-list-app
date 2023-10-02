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
            console.log(response);
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

const list_project = document.getElementById('list_project');

// menampilkan data
window.onload = function () {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        window.location.href = "../auth/login";
    }

    data_project();
}

// fungsi untuk menampilkan option project berdasarkan user

function data_project(){
    const xhr = new XMLHttpRequest();
    const url = API_HOST + "/projects";

    xhr.open("get", url, true);
    xhr.setRequestHeader(
        "Authorization", 
        `Bearer ${localStorage.getItem('access_token')}`);
    // ngecek datanya dapet atau tidak
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // check data apakah sudah ada di local storage, 
            // harus di jsonparse, karena semua data yg disimpan di local storage bentuknya string, makanya harus di parse agar kembali ke bentuknya aslinya
            const projects = JSON.parse(this.response);

            projects["data"].forEach((project) => {
                
                // render ke html
                let article = document.createElement('article');
                let badgeDelete = document.createElement('a');
                let badgeEdit = document.createElement('a');
                let badgeProject = document.createElement('span');
                let p = document.createElement("p");
                let h4 = document.createElement("h4");
                h4.appendChild(document.createTextNode(project.title));
                h4.setAttribute("id",project.project_id);
                p.appendChild(document.createTextNode(project.description));

                article.setAttribute("class", 'border p-3 mt-3');
                article.setAttribute("id", project.project_id);

                badgeDelete.setAttribute('href', "#");
                badgeDelete.setAttribute('class', "badge bg-danger");
                badgeDelete.setAttribute('style', "text-decoration:none");
                badgeDelete.setAttribute('data-id', project.project_id);
                badgeDelete.setAttribute("data-bs-toggle", 'modal');
                badgeDelete.setAttribute("data-bs-target", '#myModalDelete');

                badgeEdit.setAttribute('href', "#");
                badgeEdit.setAttribute('class', "mx-1 badge bg-info");
                badgeEdit.setAttribute('style', "text-decoration:none");
                badgeEdit.setAttribute('data-id', project.project_id);
                badgeEdit.setAttribute("data-title", project.title);
                badgeEdit.setAttribute("data-desc", project.description);
                badgeEdit.setAttribute("data-bs-toggle", 'modal');
                badgeEdit.setAttribute("data-bs-target", '#myModalEdit');

                article.appendChild(h4);
                article.appendChild(p);
                article.appendChild(badgeEdit);
                article.appendChild(badgeDelete);
                badgeDelete.appendChild(document.createTextNode("Delete"));
                badgeEdit.appendChild(document.createTextNode("Edit"));

                list_project.appendChild(article);
            });
        }
    }
    // kirim request
    xhr.send();
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
    const url = API_HOST + "/projects";

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

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
    let new_data = JSON.stringify({
        title:title,
        description:description
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
    const url = API_HOST + "/projects/"+ dataId.value;
    // check apakah datanya sudah ada atau belum

    // 1. ngambil htmlnya
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem('access_token')}`);
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            // ambil datanya dulu
            const data = JSON.parse(this.response);
            const oldTitle = document.getElementById('edit-title');
            const oldDesc = document.getElementById('edit-description');
            // 2. assign old value to form
            oldTitle.value = data.data.title;
            oldDesc.value = data.data.description;
            console.log(data.title);
        } else {
            console.log(this.response);
        }
    };
    xhr.send();

    const editForm = document.getElementById("edit-form");
    editForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const xhr = new XMLHttpRequest();
        const url = API_HOST + "/projects/"+ dataId.value;
        // check apakah datanya sudah ada atau belum

        let newTitle = document.getElementById('edit-title').value;
        let newDesc = document.getElementById('edit-description').value;

         // konfigurasi toast
        const toastEdit = document.getElementById('liveToastEdit');
        const toastBodyEdit = document.getElementById('toast-body-edit');
        const toast = new bootstrap.Toast(toastEdit);

        // validasi input
        if (newTitle == "" || newDesc == ""){
            toastBodyEdit.innerHTML = "Tidak boleh ada data yang kosong";
            toast.show();
        }

        let newTask = JSON.stringify({
            title: newTitle,
            description: newDesc
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
        let url = API_HOST+"/projects/"+dataId.value;
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
        if (this.readyState == 4 && this.status == 200) {
            localStorage.removeItem("access_token");
            window.location.href = "../auth/login";
        } else {
            alert(this.response);
        }
    };
    xhr.send();

    //remove token from locasStorage
});

//fugnsi untuk jam
let p = document.getElementById("jam")
function myTime() {
    let jam = new Date()
    p.innerHTML = jam.toLocaleTimeString([], {
        hour12: false
    })
}
setInterval(myTime, 1000)


