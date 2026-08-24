# APEX MARKET 🚀

Apex Market is a high-end, full-stack e-commerce web application designed to deliver a seamless and modern shopping experience. It features curated collections ranging from official sports jerseys to cutting-edge electronics and smart home appliances, complete with dynamic search, pagination, and automated VIP newsletter onboarding.

---

## ✨ Key Features

- **Curated Collections:** Dedicated sections for **Sportswear**, **Electronics**, **Appliances**, and **Mobiles**.
- **Dynamic Search & Pagination:** Fast client-side search filtering and structured pagination for product catalogs.
- **Interactive Product Grid:** Detailed product cards featuring ratings, pricing, badges, and smooth routing to individual product pages.
- **VIP Newsletter Subscription:** Automated welcome email delivery system using **Nodemailer** that sends a curated catalog overview directly to subscribers' inboxes.
- **Modern UI/UX:** Clean, responsive light-mode aesthetic built with custom CSS and modern iconography.

---

## 🛠️ Technologies Used

### **Frontend**
* **React** (with Vite for blazing-fast development)
* **React Router DOM** (for client-side routing)
* **TanStack React Query** (for efficient server-state management and caching)
* **Axios** (for HTTP client requests)
* **Lucide React** (for modern vector icons)

### **Backend**
* **Node.js & Express.js** (REST API backend)
* **MongoDB** (Database for storing product and catalog collections)
* **Nodemailer** (For handling automated email dispatch on user subscription)

---

## 📦 Prerequisites

Before running this project on your local machine, ensure you have the following installed:

1. **[Node.js](https://nodejs.org/)** (v18 or higher recommended — includes `npm`)
2. **[Git](https://git-scm.com/)** (for cloning the repository)
3. **MongoDB** (Either running locally via MongoDB Compass/Community Server or a cloud cluster via MongoDB Atlas)
4. A Code Editor like **[Visual Studio Code (VS Code)](https://code.visualstudio.com/)**

---

## ⚙️ Getting Started & Installation

Follow these steps to set up and run Apex Market locally:

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/apex-market.git](https://github.com/your-username/apex-market.git)
cd apex-market

2. Backend Setup
Navigate to your backend directory (or root, depending on your folder structure):
cd backend
npm install

Create a .env file in the backend root directory and add your environment variables:
Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

Start the backend server:
Bash 
nodemon server.js


3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies:

Bash
cd frontend
npm install
Start the Vite development server:

Bash
npm run dev


