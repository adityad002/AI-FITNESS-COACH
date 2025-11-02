AI Fitness Coach 💪

A personalized, AI-powered fitness and nutrition assistant built with React, Vite, and the Gemini API. This app generates custom workout and diet plans, provides audio readouts, and generates images for exercises and meals.

Live Demo Link : https://ai-fitness-coach-nu.vercel.app/

🚀 Core Features

🧠 Personalized Plans: Generates 7-day workout and diet plans using the Gemini 2.5 Flash model based on user's goals, fitness level, and preferences.

🔊 AI-Powered Voice: Uses the Gemini TTS API to read workout and diet plans aloud with a natural-sounding voice.

🖼️ AI Image Generation: Utilizes the Imagen 3 API to generate realistic images of exercises and meals on click.

💾 Persistent State: Remembers your form data and your last generated plan using Local Storage.

🌗 Dark Mode: Sleek, modern UI with a persistent dark/light mode toggle.

✨ Polished UI: Fully responsive design built with Tailwind CSS and lucide-react for icons.

🛠️ Tech Stack

Category

Tool

Framework

React 18 (with Vite)

Styling

Tailwind CSS & lucide-react

AI Text & JSON

Google Gemini 2.5 Flash

AI Text-to-Speech

Google Gemini TTS

AI Image Gen

Google Imagen 3

Deployment

Vercel / Netlify

🏎️ Running Locally

Clone the repository:

git clone [https://github.com/](https://github.com/)[YOUR_USERNAME]/ai-fitness-coach.git
cd ai-fitness-coach


Install dependencies:

npm install


Set up your environment variables:
Create a new file named .env in the root of the project and add your API key:

VITE_GEMINI_API_KEY="YOUR_API_KEY_HERE"


You can get your key from Google AI Studio.

(Note: The VITE_ prefix is required by Vite.)

Run the development server:

npm run dev


The app will be available at http://localhost:5173.

🔐 API Configuration & Security

This project uses a .env file to securely manage the Google Gemini API key on the client side for development. The src/App.jsx file reads this key using import.meta.env.VITE_GEMINI_API_KEY.

The included .gitignore file is pre-configured to ignore all .env files, ensuring you do not accidentally commit your secret keys to GitHub.

⚠️ Important Note on Billing

The AI image generation feature (using Imagen 3) requires a Google Cloud project with billing enabled. The core plan generation (Gemini 2.5) and voice (Gemini TTS) features will work on the free tier, but image generation will fail with a 400 error until a billed account is linked to your API key's project.