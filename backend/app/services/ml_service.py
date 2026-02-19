import pickle
import numpy as np
import os
import pandas as pd

class CareerPredictor:
    def __init__(self):
        self.model_path = os.path.join(os.path.dirname(__file__), "../models_data/career_model.pkl")
        self.model = None
        self._load_model()

    def _load_model(self):
        try:
            if os.path.exists(self.model_path):
                with open(self.model_path, "rb") as f:
                    self.model = pickle.load(f)
                print("Model loaded successfully.")
            else:
                print(f"Model not found at {self.model_path}. Please train the model first.")
        except Exception as e:
            print(f"Error loading model: {e}")

    def predict(self, input_data: dict):
        if self.model is None:
            return {"predicted_career": "Education Error", "probabilities": []}
            
        try:
            # Match the training features
            features = [
                input_data.get('math_score', 0),
                input_data.get('programming_score', 0),
                input_data.get('communication_score', 0),
                input_data.get('problem_solving_score', 0),
                input_data.get('interest_coding', 0),
                input_data.get('interest_design', 0),
                input_data.get('interest_management', 0)
            ]
            
            prediction = self.model.predict([features])[0]
            
            # Extract probabilities
            class_names = self.model.classes_
            probabilities = self.model.predict_proba([features])[0]
            
            prob_list = [
                {"name": name, "prob": round(float(prob) * 100, 2)}
                for name, prob in zip(class_names, probabilities)
            ]
            
            # Sort by probability descending
            prob_list = sorted(prob_list, key=lambda x: x['prob'], reverse=True)
            
            return {
                "predicted_career": prediction,
                "probabilities": prob_list
            }
        except Exception as e:
            print(f"Prediction error: {e}")
            return {"predicted_career": "Processing Error", "probabilities": []}

career_predictor = CareerPredictor()
