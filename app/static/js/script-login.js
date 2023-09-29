// Harcode login
const API_HOST = 'http://127.0.0.1:5000/api';
const formLogin = document.getElementById("form-login");

// formLogin.addEventListener("submit", (event)=>{
//     event.preventDefault();
// })

window.onload = function(){
    formLogin.addEventListener("submit", function(e) {
        e.preventDefault();

        let xhr= new XMLHttpRequest();
        let url = API_HOST+"/auth/login";

        let email = document.getElementById('login-email').value;
        let password = document.getElementById('login-password').value;

        const toastTrigger = document.getElementById("liveToastAdd");
        const toastBody = document.getElementById("toast-body"); 
        toastBody.innerHTML = "Email/Password Salah";
        const toast = new bootstrap.Toast(toastTrigger); 

        // validation
        if(email == '' || password =='' ) return toast.show();

        // Call Login API
        const data = JSON.stringify({
            email:email,
            password:password
        });

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem('access_token')}`);
        xhr.onreadystatechange = function(){
            if(this.status == 200){
                const data = JSON.parse(this.response);
                localStorage.setItem("access_token", data.access_token);
                window.location.href = "http://127.0.0.1:5000";
            } else {
                toastBody.innerHTML = this.response;
                toast.show();
            }
        }

        xhr.send(data);
    });
}



