# Financial Data Viewer

A full-stack app built with **Node.js**, **React**, and **MongoDB** to explore financial data of major companies.

## Overview

This application allows users to search for companies by ticker symbol and view:

-   Company profile information
-   Analyst grades
-   Historical price charts (past 2 years)

Data is fetched daily from [Financial Modeling Prep](https://financialmodelingprep.com/) APIs and stored in MongoDB.

---

## Features

-   🔍 **Search** companies by ticker
-   📊 **View** profile, grades, and price chart
-   ⏱ **Daily updates** from external APIs
-   💅 **Responsive UI** with Tailwind CSS
-   🐳 **Fully containerized** using Docker

---

## Quick Start (via Docker Compose)

You do **not** need to install Node.js or MongoDB manually.

### 1. **Clone the repository**

      git clone https://github.com/gal-s2/FinancialDataViewer.git
      cd Financial-Data-Viewer


### 2. **Set your API key:**

Open docker-compose.yml and replace
API_KEY=your_api_key_here
under the server environment section with your actual API key.

### 3. **Start the app:**

      docker-compose up --build

### 4. **Access the app:**

Open http://localhost:5173 in your browser.
The backend will print a message when data is finished loading:
"Server is running on port"
(can take a few minutes)
