# CareerSense AI

## Project Structure

- `backend/`: FastAPI application, Machine Learning logic, and Resume Parsing.
- `frontend/`: React application with animated dashboard.
- `ml/`: Scripts for training the ML model.

## Setup Instructions

### 1. Backend Setup

Navigate to the project directory:
```bash
cd backend
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the Model Training Script (Generates `career_model.pkl`):
```bash
python ../ml/train_model.py
```

Start the Backend Server:
```bash
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`.
Docs at `http://localhost:8000/docs`.

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the Development Server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## Features
- **Student Profile**: Enter marks and interests.
- **Resume Analysis**: Upload PDF/DOCX (Text supported locally) to extract skills.
- **Career Prediction**: ML model predicts career path based on profile.
- **Skill Gap Analysis**: Identifies missing skills and provides a roadmap.
- **Interactive Dashboard**: Visualizes data using Recharts.

## Notes
- The ML model is trained on synthetic data for demonstration.
- Resume parsing attempts to use SpaCy but falls back to keyword matching if models are not downloaded.
