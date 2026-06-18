import os
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Optional
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from backend.src.config import get_settings

settings = get_settings()
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "crime_model.joblib")
ENCODERS_PATH = os.path.join(MODEL_DIR, "encoders.joblib")

class MLEngine:
    def __init__(self):
        self.model = None
        self.encoders = None
        self.accuracy = None
        self.feature_importances = None
        self._load_or_train()
    
    def _load_or_train(self):
        """Load existing model or train a new one."""
        if os.path.exists(MODEL_PATH) and os.path.exists(ENCODERS_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                self.encoders = joblib.load(ENCODERS_PATH)
                print("ML model loaded from disk.")
                return
            except Exception:
                pass
        
        self._train_model()
    
    def _train_model(self):
        """Train a RandomForest model on synthetic but realistic data."""
        print("Training ML model...")
        
        np.random.seed(42)
        n = 10000
        
        # Generate realistic training data
        hours = np.random.randint(0, 24, n)
        districts = np.random.randint(1, 26, n)
        crime_types = np.random.choice(
            ["THEFT", "BATTERY", "CRIMINAL DAMAGE", "NARCOTICS", "ASSAULT", 
             "BURGLARY", "MOTOR VEHICLE THEFT", "ROBBERY", "DECEPTIVE PRACTICE"],
            n,
            p=[0.25, 0.15, 0.12, 0.10, 0.10, 0.08, 0.08, 0.07, 0.05]
        )
        arrest = np.random.choice([True, False], n, p=[0.25, 0.75])
        
        # Compute priority based on crime severity + context
        def get_priority(hour, district, crime_type, arrest_made):
            score = 0
            # Crime type severity
            severity = {
                "THEFT": 1, "DECEPTIVE PRACTICE": 1, "NARCOTICS": 2,
                "CRIMINAL DAMAGE": 2, "BATTERY": 3, "ASSAULT": 3,
                "BURGLARY": 4, "MOTOR VEHICLE THEFT": 4, "ROBBERY": 5
            }
            score += severity.get(crime_type, 2)
            
            # Time factor (night crimes more severe)
            if hour >= 22 or hour <= 5:
                score += 1.5
            elif hour >= 18 or hour <= 6:
                score += 0.5
            
            # District factor (higher districts in Chicago have more crime)
            if district in [1, 11, 7, 10, 15]:
                score += 1.0
            
            # Arrest reduces priority (already handled)
            if arrest_made:
                score -= 0.5
            
            if score < 2.5:
                return "Low"
            elif score < 4.0:
                return "Medium"
            elif score < 5.5:
                return "High"
            else:
                return "Critical"
        
        priorities = [get_priority(h, d, ct, a) for h, d, ct, a in zip(hours, districts, crime_types, arrest)]
        
        # Add noise to prevent overfitting
        noise_rate = 0.15
        noise_mask = np.random.rand(n) < noise_rate
        priority_classes = ["Low", "Medium", "High", "Critical"]
        priorities = np.array(priorities)
        priorities[noise_mask] = np.random.choice(priority_classes, size=noise_mask.sum())
        
        # Encode features
        df = pd.DataFrame({
            "hour": hours,
            "district": districts,
            "crime_type": crime_types,
            "arrest": arrest
        })
        
        encoders = {}
        for col in ["crime_type"]:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])
            encoders[col] = le
        
        target_encoder = LabelEncoder()
        target_encoder.fit(priority_classes)
        y = target_encoder.transform(priorities)
        encoders["priority"] = target_encoder
        
        X = df[["hour", "district", "crime_type", "arrest"]]
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model = RandomForestClassifier(n_estimators=100, max_depth=10, min_samples_split=5, random_state=42)
        model.fit(X_train, y_train)
        
        y_pred = model.predict(X_test)
        self.accuracy = accuracy_score(y_test, y_pred)
        
        self.feature_importances = dict(zip(X.columns, model.feature_importances_))
        
        self.model = model
        self.encoders = encoders
        
        # Save model
        os.makedirs(MODEL_DIR, exist_ok=True)
        joblib.dump(model, MODEL_PATH)
        joblib.dump(encoders, ENCODERS_PATH)
        
        print(f"Model trained. Accuracy: {self.accuracy:.2%}")
    
    def predict(self, hour: int, district: int, crime_type: str, arrest_history: bool) -> Dict:
        """Make a prediction."""
        if self.model is None or self.encoders is None:
            raise ValueError("Model not loaded")
        
        # Encode crime type
        crime_type_enc = self.encoders["crime_type"]
        if crime_type in crime_type_enc.classes_:
            ct_encoded = crime_type_enc.transform([crime_type])[0]
        else:
            ct_encoded = 0  # Default to first class
        
        features = [[hour, district, ct_encoded, int(arrest_history)]]
        pred = self.model.predict(features)[0]
        probs = self.model.predict_proba(features)[0]
        
        priority_encoder = self.encoders["priority"]
        priority = priority_encoder.inverse_transform([pred])[0]
        confidence = float(probs[pred])
        
        probabilities = {}
        for idx, prob in enumerate(probs):
            class_name = priority_encoder.inverse_transform([idx])[0]
            probabilities[class_name] = float(prob)
        
        return {
            "priority": priority,
            "confidence": confidence,
            "probabilities": probabilities,
            "feature_importances": self.feature_importances,
        }
    
    def get_stats(self) -> Dict:
        return {
            "accuracy": self.accuracy,
            "feature_importances": self.feature_importances,
            "model_loaded": self.model is not None,
        }
