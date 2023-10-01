# Latar Belakang Todo List App
Sistem todo list sederhana untuk memantau progress task yang dikerjakan oleh karyawan. Sistem ini menggunakan bahasa pemrograman python dengan framework flask dan database sqlite3

# Requirement/objective Todo List App
Membuat aplikasi Todo List yang dapat:

![FItur Aplikasi Todo App (2)](https://github.com/afifahpn/todo-list-app/assets/55918778/7d4e86c5-bc7f-4e58-b4b2-27536cad918b)

# Flowchart

![flow chart to do app](https://github.com/afifahpn/todo-list-app/assets/55918778/8e396b5a-2081-4698-81bc-b3b55d5ec315)

# Deskripsi Task
1. folder app berisikan beberapa folder inti dari aplikasi, folder tersebut yaitu:
   - folder auth untuk menampung routing dari authentikasi.
   - folder frontend  yang digunakan untuk mengatur route tampilan website.
   - folder models untuk menampung model database.
   - folder project untuk menampung routing dari project.
   - folder static berisikan folder css dan icon untuk menunjang tampilan pada website. Selain itu terdapat folder js sebagai frontend side yang menampilkan data dari folder routing.
   -  folder task untuk menampung routing dari task.
   -  folder templates berisikan html sebagai tampilan website.
   -  folder user untuk menampung routing dari user.
   -  module __init__.py, untuk menginisiasi blueprint agar route dapat digunakan pada website.
   -  module extension.py untuk menginisiasi SQLAlchemy, Migrate, dan JWTManager, agar siap digunakan.
2. folder migrations bertujuan untuk menampung versi dari perubahan databse.
3. file app.db, file ini muncul automatis setelah pertama kali menginisiasi database.
4. file config.py, module ini berisikan konfigurasi pada aplikasi, seperti jenis database yang digunakan.

# Cara Menggunakan Program

1. Download/pull file repo ke dalam satu direktori lokal.
2. Buka terminal dan sesuaikan lokasi direktori lokal.
3. Jalankan flask --app app run di terminal untuk menjalankan aplikasi
4. Database dan aplikasi sudah siap digunakan

# Hasil test Case


# Future Work
