// ============================================
// ІНСТРУКЦІЯ ПО ЗАПУСКУ
// ============================================

/*
7. Тестування API через curl або Postman:

   # Отримати всі новини
   GET http://localhost:3000/api/news

   # Отримати одну новину
   GET http://localhost:3000/api/news/1

   # Створити нову новину
   POST http://localhost:3000/api/news
   Body (JSON):
   {
     "title": "Моя нова стаття",
     "excerpt": "Короткий опис",
     "content": "Контент статті до 255 символів",
     "image": "https://picsum.photos/800/400",
     "author": "Ваше Ім'я"
   }

   # Оновити новину
   PUT http://localhost:3000/api/news/1
   Body (JSON):
   {
     "title": "Оновлений заголовок"
   }

   # Видалити новину
   DELETE http://localhost:3000/api/news/1
*/