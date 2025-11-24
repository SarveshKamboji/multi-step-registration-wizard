# Multi-step Account Registration Wizard (HTML + JS + JSP + MySQL)

This project is a **multi-step user registration form** with client-side validation, AJAX submission, and a JSP + MySQL backend.  
It demonstrates how to collect personal details, account details, and additional information in steps, validate them on the client, and finally submit them to the server **without reloading the page**.

---

## 🚀 Features

- 3-step registration wizard:
  - **Step 1:** Personal details (name, email, phone, country, DOB)
  - **Step 2:** Account details (username, password, security question & answer, terms checkbox)
  - **Step 3:** Extra info (short bio, newsletter)
- Client-side validation using **vanilla JavaScript**
- **AJAX submission** using `XMLHttpRequest` (no jQuery)
- Backend using **JSP** with **MySQL** database
- Status banner with clear success / error messages
- Clean UI built with plain **HTML + CSS**

> Note: In this version, profile picture and resume are used only on the frontend (preview & validation).  
> The data inserted into the database is textual fields (no file storage).

---

## 🧱 Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **AJAX:** `XMLHttpRequest`
- **Backend:** JSP (Java Server Pages) on Apache Tomcat
- **Database:** MySQL
- **Environment:** XAMPP (Tomcat + MySQL)

---

## 📁 Folder Structure

```text
newproject/
├─ index.html        # Main UI – multi-step form
├─ styles.css        # Styling for the wizard, banner, buttons, etc.
├─ app.js            # Form logic, validation, AJAX submission
├─ register.jsp      # Backend JSP – inserts data into MySQL
└─ README.md         # Project documentation

<img width="588" height="179" alt="image" src="https://github.com/user-attachments/assets/7743bf3f-98a4-4a50-8b64-bdbaea610082" />

CREATE DATABASE registrationdb1;
USE registrationdb1;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    country VARCHAR(10),
    dob DATE,
    username VARCHAR(50),
    password VARCHAR(255),
    securityQuestion VARCHAR(50),
    securityAnswer VARCHAR(255),
    bio TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


## 🧱 ScreenShots

![WhatsApp Image 2025-11-24 at 16 27 59_c1b31acd](https://github.com/user-attachments/assets/7d827bd3-7da9-4b6a-88d2-ab7f0afb4335)

![WhatsApp Image 2025-11-24 at 16 29 06_c495d4ac](https://github.com/user-attachments/assets/73f66256-0911-49ed-a60f-63014c970260)

![WhatsApp Image 2025-11-24 at 16 30 32_e3921c06](https://github.com/user-attachments/assets/46bd1e72-39e4-48d1-9898-1bcb4cff253f)

<img width="1638" height="141" alt="image" src="https://github.com/user-attachments/assets/7d26862b-0b73-4ca9-a34f-f5dc4cbf0e24" />

