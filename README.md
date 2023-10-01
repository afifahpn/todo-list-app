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
1. Halaman Login
   ![image](https://github.com/afifahpn/todo-list-app/assets/55918778/b0420c8c-b97b-4efe-9c65-b5505d79cbaf)
2. Halaman Home
   ![image](https://github.com/afifahpn/todo-list-app/assets/55918778/6dcac616-2995-46d8-b20c-e7738bda7619)
3. Menambahkan Task
   ![image](https://github.com/afifahpn/todo-list-app/assets/55918778/1d91d71a-8c26-4895-9694-0316a69c10a8)
   ![image](https://github.com/afifahpn/todo-list-app/assets/55918778/f0597a82-5f1c-4ab6-931a-7819338cd6c6)
4. Mengedit Task
   ![image](https://github.com/afifahpn/todo-list-app/assets/55918778/ddc07d4c-ca4c-4ce9-9002-6a282609acc6)
   ![image](https://github.com/afifahpn/todo-list-app/assets/55918778/03db2e74-5d6d-4257-9a6f-5d4221edd83b)
5. menghapus Task
   ![image](https://github.com/afifahpn/todo-list-app/assets/55918778/568fa4e7-7798-4965-bf76-6be5019fa0a2)
   ![image](https://github.com/afifahpn/todo-list-app/assets/55918778/68f7ef14-683c-4349-aaf2-19bd3b1fc57c)
6. Mengubah Status Task
   ![image](https://github.com/afifahpn/todo-list-app/assets/55918778/4ddf1aab-3ba3-4b4e-b297-e5676ccc8e55)
7. Menampilkan Task Berdasarkan Project
   ![image](https://github.com/afifahpn/todo-list-app/assets/55918778/e6530746-6f30-49f8-9988-4330c537ddd0)
   ![image](https://github.com/afifahpn/todo-list-app/assets/55918778/bb284fbc-2b7b-4555-a675-99785d6c0b06)





# Future Work
