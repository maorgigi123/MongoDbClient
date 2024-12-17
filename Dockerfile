# שלב 1: הגדרת תמונת בסיס
FROM node:18 AS build

# שלב 2: הגדרת תיקיית העבודה בתוך הקונטיינר
WORKDIR /app

# שלב 3: העתקת קבצי package.json ו package-lock.json (או yarn.lock) לתוך הקונטיינר
COPY package*.json ./

# שלב 4: התקנת הספריות של הפרויקט
RUN npm install

# שלב 5: העתקת כל הקבצים הנותרים לתוך הקונטיינר
COPY . .

# שלב 6: בניית הקוד לפרודקשן
RUN npm run build

# Step 7: Expose the port on which Vite will run (default is 4173)
EXPOSE 4173

# שלב 8: הרצת השרת ב-Production (הפעלת Vite עם אפשרות 'preview' לאחר הבנייה)
CMD ["npm", "run", "preview"]


# for build : docker build -t my-vite-app .
# for run :  docker run -p 4173:4173 my-vite-app   

#convarte to tar =>  docker save my-vite-app > my-vite-app.tar
# convarte to zip  zip my-vite-app.zip my-vite-app.tar

