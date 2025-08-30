# 🎟 Event Hub

A web application to create, view, and manage events. Users can browse all events, create their own, and delete events they have created. The app also supports booking tickets for events.

# Frontend
---
**The app is deployed using render**

Here is the link [EventHub](https://eventhub-hxlf.onrender.com)
## 🚀 Features

- 🔑 **Authentication**
  - User signup, login, and logout with JWT-based authentication
  - Securely stores user session in context

- 🎭 **Events**
  - Browse a list of available events
  - View detailed event information
  - Book tickets for events (requires login)

- 🎟 **Tickets**
  - View all your booked tickets
  - Cancel tickets with one click

- 🎨 **UI**
  - Clean and responsive interface
  - Custom styling with CSS modules

---

## Screenshots

![Dashboard](frontend/src/assets/eventhub-dashboard.png)
*All events displayed in a responsive grid*

![Event Detail](frontend/src/assets/events_details.png)
*Book tickets or see event details*

![Create Event](frontend/src/assets/createevent.png)
*Form to create a new event*

---

## 🛠 Tech Stack

- **React 18** + **Vite** ⚡
- **React Router** – navigation
- **Context API** – authentication state
- **Fetch API** – data fetching
- **CSS** – custom styling
- **Backend API** – [Event Hub backend](https://group5-events-app.onrender.com)

---

## 📦 Installation & Setup

Clone the repo and install dependencies:

```bash
git clone https://github.com/Moringa-SDF-PT10/group5-events-app.git
cd frontend
npm install
```

Run the development server:

```bash
npm run dev
```

By default, the app will run on `http://localhost:5173`.

---



## 📂 Project Structure

```
frontend/
│── public/              # Static assets
│── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route pages (Home, EventDetails, MyTickets, etc.)
│   ├── context/         # Auth context + hooks
│   ├── App.jsx          # Main app
│   ├── main.jsx         # Entry point
│── package.json
│── vite.config.js
│── README.md
```

---

## 👨‍💻 Available Pages

- `/` – Home
- `/events` - All events
- `/events/:id` – Event details + booking
- `/my-tickets` – View and cancel booked tickets
- `/login` – Login page
- `/signup` – Signup page

---

## ✅ Todo / Improvements

- [ ] Add search & filter for events
- [ ] Improve ticket UI with QR codes
- [ ] Add user profile page

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes
4. Push and open a Pull Request

---

# Backend


![Python](https://img.shields.io/badge/python-3.10-blue?logo=python)
![Flask](https://img.shields.io/badge/flask-2.3-black?logo=flask)
![SQLAlchemy](https://img.shields.io/badge/sqlalchemy-2.0-red?logo=python)
![License](https://img.shields.io/badge/license-MIT-green)

Backend service for the **Events App**, built with **Flask**, **SQLAlchemy**, and **Flask-Migrate**.
It provides a RESTful API for managing **Users**, **Events**, and **Tickets**.


The frontend is a **React app** (built separately) that consumes this API.

---

## 🚀 Features

- 🔑 User registration & authentication (hashed passwords)
- 📅 Create & manage events
- 🎫 Ticket registration (with quantity support)
- 💳 Ticket payment & status updates
- 📂 JSON responses for all endpoints
- 🛠️ Flask-Migrate for database migrations

---

## 📦 Tech Stack

- **Backend:** Flask, SQLAlchemy, Flask-Migrate
- **Database:** SQLite (development), can extend to PostgreSQL/MySQL

- **Frontend:** React (Seperate project folders same repo)

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repo
```bash
git clone https://github.com/Moringa-SDF-PT10/group5-events-app.git
cd events-app-backend
```
## 2️⃣ Create a Virtual Environment

We recommend using **Pipenv** to manage dependencies and virtual environments.

```bash
# Install pipenv if not already installed
pip install pipenv

# Install dependencies and create virtual environment
pipenv install

# Activate the virtual environment
pipenv shell
```

## 3️⃣ Install Dependencies

Once inside the virtual environment, install all required packages using the `requirements.txt` file:


```bash
pip install -r requirements.txt
```

## 4️⃣ Set Up the Database

Since the `instance/` folder (with the SQLite database) and the `migrations/` directory are already included in this repository, you **do not need to run migrations** unless you are setting up the database from scratch.

-  If setting up from scratch:

Run the following commands to initialize and migrate your database:


```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```


## 5️⃣ (Optional) Seed with Sample Data

To populate the database with sample users, events, and tickets, run:


```bash
python seed.py
```

## 6️⃣ 🟢 Default Port (5000)

Start the Flask development server with:


```bash
flask run
```
## 📡 API Endpoints
Below are the available endpoints grouped by resource:

---

### 🔐 Auth
- `POST /auth/signup` → Register as a new user and receive an authentication token

- `POST /auth/login` → Log using credentials and  token


---

### 🎶 Events

- `GET /events` → Fetch all events
- `POST /events` → Create a new event
- `GET /events/<id>` → Fetch details of a specific event
- `PATCH /events/<id>` → Update an event
- `DELETE /events/<id>` → Delete an event


---

### 🎫 Tickets

- `POST /tickets` → Create a new ticket
- `PATCH /tickets/<id>/confirm` → Confirm a ticket (mark as paid/confirmed)
- `PATCH /tickets/<id>/cancel` → Cancel a ticket

---
## 📖 Example Request

### Signup

- `POST /auth/signup` → Register as a new user and receive an authentication token

**Request Body:**
```json
{
  "username": "Rowney",
  "email": "rowney@example.com",
  "password": "mypassword123"
}
```
**Response:**
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1NjM2MDMwMCwianRpIjoiZTYxNTg1ZWMtMDAwYy00ZGM1LWExYWEtYjEwZGYwNjRkMTE0IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MywibmJmIjoxNzU2MzYwMzAwLCJjc3JmIjoiZDM1NmYxMDYtNjFjYS00N2FiLWEzYjItYzJhNWYzMTNhNmM3IiwiZXhwIjoxNzU2NDQ2NzAwfQ.KrgcB97JaI_CgwvK8kmlnklEnXYtHrR6kVpeWFM5nM0",
    "message": "User created",
    "user": {
        "created_at": "2025-08-28T05:51:39.981240",
        "email": "rowney@example.com",
        "id": 3,
        "username": "Rowney"
    }
}
```

## 🛠️ Development Notes
-  Passwords are stored using Werkzeug’s hash utils.

-  Database migrations are handled by Flask-Migrate.

-  Ticket model enforces unique user-event pairs.

## 📞 Contact

For questions, support, or contributions regarding this project, please feel free to reach out to our development team:

| Team Member | Email Address | Role |
|-------------|---------------|------|
| **Marion Maghanga** | 📧 [marion.maghanga@student.moringaschool.com](mailto:marion.maghanga@student.moringaschool.com) | Full Stack Developer |
| **Rowney Ouma** | 📧 [rowney.ouma@student.moringaschool.com](mailto:rowney.ouma@student.moringaschool.com) | Full Stack Developer |
| **Farouk Abdi** | 📧 [farouk.abdi@student.moringaschool.com](mailto:farouk.abdi@student.moringaschool.com) | Full Stack Developer |
| **Elvis Mbuthia** | 📧 [elvis.mbuthia@student.moringaschool.com](mailto:elvis.mbuthia@student.moringaschool.com) | Full Stack Developer |


## 📜 License

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

This project is licensed under the **MIT License** – see the [LICENSE](./LICENSE) file for details.
