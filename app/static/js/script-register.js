
const formRegistration = document.getElementById("form-registration");
const API_HOST = 'http://127.0.0.1:5000/api';

formRegistration.addEventListener("submit", function (event) {
    event.preventDefault();

    const xhr = new XMLHttpRequest();
    const url = API_HOST + "/auth/register";

    let nama = document.getElementById('nama').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirm_password = document.getElementById('confirm_password').value;

    const toastTrigger = document.getElementById("liveToastAdd");
    const toastBody = document.getElementById("toast-body");
    toastBody.innerHTML = "Form tidak boleh kosong";
    const toast = new bootstrap.Toast(toastTrigger);

    if (!nama || !email || !password || !confirm_password) return toast.show();

    if (password != confirm_password) {
        toastBody.innerHTML = "Password yang dimasukkan ";
        return toast.show();
    }

    const data = JSON.stringify({
        name: nama,
        email: email,
        password: password
    });
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.onreadystatechange = function () {
        if (this.status == 200) {
            const toastLiveSuccess = document.getElementById("liveToastSuccess");
            let toastMsgSuccess = document.getElementById("toast-body");
            toastMsgSuccess.innerHTML = "Data berhasil dimasukkan!";
            const toastSuccess = new bootstrap.Toast(toastLiveSuccess);
            toastSuccess.show();

            formRegistration.reset();
        } else {
            toastMsgError.innerHTML = this.response;
            toast.show();
        }
    };

    xhr.send(data);
});



// btnRegis.addEventListener("click", function(event){
//     event.preventDefault
//     let email = document.getElementById('email').value
//     let nama = document.getElementById('nama').value
//     let password = document.getElementById('password').value
//     let confirm_password = document.getElementById('confirm_password').value

//     // if((email && nama && password) != ''){
//     //     if(password == confirm_password){
//     //         alert("Registration is temporarily disabled")
//     //         // window.location.href = "http://127.0.0.1:5500/login.html"
//     //     }else{
//     //         alert("Mohon maaf password anda tidak sama")
//     //     }
//     // }else{
//     //     alert("Masukan data dengan benar!")
//     // }
// })