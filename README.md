# AdminSchool — Backend (NestJS + MongoDB + JWT)

Bu backend maxsus **AdminSchool** React frontendi uchun yozilgan. Frontenddagi
`src/utils/axiosInstance.jsx` va barcha modullar (`Home`, `Contact`, `Events`, `Gallery`)
qanday so'rov (request) yuborsa — backend xuddi shunday javob (response) qaytaradi.
Hech qanday frontend kodini o'zgartirish shart emas — faqat `baseURL`ni o'z serveringizga
ko'rsating.

## 1. O'rnatish

```bash
cd backend
npm install
cp .env.example .env
```

`.env` faylini oching va kerak bo'lsa qiymatlarni o'zgartiring:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/adminschool
JWT_SECRET=super_maxfiy_kalit_shu_yerga_yoz
JWT_EXPIRES_IN=1d
ADMIN_LOGIN=admin
ADMIN_PASSWORD=admin12345
FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:5000
```

> **Muhim:** Server birinchi marta ishga tushganda, agar bazada birorta ham admin
> bo'lmasa, `ADMIN_LOGIN` / `ADMIN_PASSWORD` asosida standart admin avtomatik
> yaratiladi. Shu login/parol bilan frontenddagi Login sahifasidan kirishingiz mumkin.
> Xavfsizlik uchun productionga chiqarishdan oldin buni albatta o'zgartiring.

## 2. Ishga tushirish

```bash
# development (fayl o'zgarishlarini kuzatib turadi)
npm run start:dev

# production
npm run build
npm run start:prod
```

Server manzili: `http://localhost:5000/api`

## 3. Frontend bilan bog'lash

Frontenddagi `src/utils/axiosInstance.jsx` faylida:

```js
const api = axios.create({
    baseURL: 'https://api.39ortomekteb.info/api',
});
```

shu qatorni o'z serveringiz manziliga o'zgartiring, masalan development uchun:

```js
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});
```

Boshqa hech narsani o'zgartirish shart emas — barcha endpoint nomlari, so'rov (request)
va javob (response) formatlari frontend kodiga to'liq mos qilib yozilgan.

## 4. API endpoint'lar ro'yxati

Barcha endpoint'lar `/api` prefiksi bilan ishlaydi. 🔒 belgisi — JWT token
(`Authorization: Bearer <token>`) talab qilinishini bildiradi.

### Auth
| Method | Endpoint | Body | Javob |
|---|---|---|---|
| POST | `/admin/login` | `{ login, password }` | `{ accessToken }` |

### Teachers (Home moduli)
| Method | Endpoint | Body | Izoh |
|---|---|---|---|
| GET | `/teachers` | — | `{ success, data: [...] }` |
| POST 🔒 | `/teachers/create` | `{ full_name, subject, type, image, resume }` | O'qituvchi qo'shish |
| DELETE 🔒 | `/teachers/delete/:id` | — | O'qituvchini o'chirish |

### Contact
| Method | Endpoint | Body | Izoh |
|---|---|---|---|
| GET | `/contact` | — | `{ success, data: [...] }` |
| POST | `/contact/create` | `{ name, message }` | Yangi fikr qo'shish |
| PUT 🔒 | `/contact/update/:id` | `{ name, message }` | Fikrni tahrirlash |
| DELETE 🔒 | `/contact/delete/:id` | — | Fikrni o'chirish |

### Blog / Events
| Method | Endpoint | Body | Izoh |
|---|---|---|---|
| GET | `/blog` | — | `{ success, data: [...] }` (har bir elementda `body` — JSON string: `{image, date}`) |
| POST 🔒 | `/blog/create` | `{ title, body }` | `body` = `JSON.stringify({image, date})` |
| DELETE 🔒 | `/blog/delete/:id` | — | Voqeani o'chirish |

### Gallery
| Method | Endpoint | Body | Izoh |
|---|---|---|---|
| GET | `/gallery` | — | `{ success, data: [...] }` |
| POST 🔒 | `/gallery/create` | `{ image }` | Rasm qo'shish |
| DELETE 🔒 | `/gallery/delete/:id` | — | Rasmni o'chirish |

### Upload
| Method | Endpoint | Body | Javob |
|---|---|---|---|
| POST 🔒 | `/upload` | `multipart/form-data`, field: `file` | `{ file: "https://res.cloudinary.com/.../adminschool/<fayl>" }` |

Fayllar **Cloudinary**'ga yuklanadi (doimiy saqlanadi — Render/Vercel kabi
serverlar qayta ishga tushganda fayllar o'chib ketmasligi uchun). Buning uchun
`.env`da quyidagi 3 ta qiymat to'ldirilgan bo'lishi kerak:

```
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Bu qiymatlarni [cloudinary.com](https://cloudinary.com)da bepul ro'yxatdan
o'tib, Dashboard sahifasidan olasiz.

## 5. Loyiha tuzilishi

```
src/
  auth/        -> login, JWT, admin avto-seed
  teachers/    -> Home moduli (o'qituvchilar)
  contact/     -> Fikr-mulohazalar
  blog/        -> Voqealar/Events
  gallery/     -> Galereya
  upload/      -> Fayl yuklash (rasm, PDF)
  common/      -> JWT guard
```

## 6. Deploy qilishda eslatma

- MongoDB'ni production'da MongoDB Atlas yoki o'z serveringizda ishga tushiring
  va `MONGO_URI`ni shunga mos yangilang.
- `BASE_URL`ni serveringizning haqiqiy domenига (masalan
  `https://api.39ortomekteb.info`) o'zgartiring — aks holda yuklangan fayllar
  linki noto'g'ri chiqadi.
- `JWT_SECRET`ni albatta uzun va tasodifiy qiymatga o'zgartiring.
