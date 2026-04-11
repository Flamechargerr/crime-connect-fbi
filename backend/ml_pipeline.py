from __future__ import annotations

from dataclasses import dataclass
from threading import Lock
from typing import Dict, List, Tuple

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


FEATURE_NAMES = [
    "prior_offenses",
    "evidence_items",
    "witness_count",
    "financial_red_flags",
    "digital_footprint_score",
    "violent_history_score",
    "cross_border_activity",
    "active_warrants",
]

CLASS_NAMES = ["low", "medium", "high"]


@dataclass
class ModelBundle:
    pipeline: Pipeline
    accuracy: float
    training_rows: int
    test_rows: int


_model_bundle: ModelBundle | None = None
_model_bundle_lock = Lock()


def build_training_dataset(records: int = 10_000, random_state: int = 42) -> Tuple[np.ndarray, np.ndarray]:
    rng = np.random.default_rng(random_state)
    prior_offenses = rng.poisson(2.8, records)
    evidence_items = rng.poisson(4.5, records)
    witness_count = rng.poisson(2.1, records)
    financial_red_flags = rng.poisson(1.2, records)
    digital_footprint_score = rng.uniform(0.0, 1.0, records)
    violent_history_score = rng.uniform(0.0, 1.0, records)
    cross_border_activity = rng.binomial(1, 0.22, records)
    active_warrants = rng.poisson(0.9, records)

    X = np.column_stack(
        [
            prior_offenses,
            evidence_items,
            witness_count,
            financial_red_flags,
            digital_footprint_score,
            violent_history_score,
            cross_border_activity,
            active_warrants,
        ]
    )

    weighted_score = (
        0.9 * prior_offenses
        + 0.5 * evidence_items
        + 0.45 * witness_count
        + 0.85 * financial_red_flags
        + 2.0 * digital_footprint_score
        + 2.3 * violent_history_score
        + 1.7 * cross_border_activity
        + 1.4 * active_warrants
    )
    noisy_score = weighted_score + rng.normal(0.0, 1.0, records)
    low_threshold, high_threshold = np.quantile(noisy_score, [0.38, 0.72])
    y = np.digitize(noisy_score, bins=[low_threshold, high_threshold])

    return X.astype(np.float64), y.astype(np.int64)


def train_risk_classifier(records: int = 10_000, random_state: int = 42) -> ModelBundle:
    X, y = build_training_dataset(records=records, random_state=random_state)
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=random_state,
        stratify=y,
    )

    pipeline = Pipeline(
        [
            ("scaler", StandardScaler()),
            (
                "model",
                LogisticRegression(
                    random_state=random_state,
                    max_iter=1000,
                ),
            ),
        ]
    )
    pipeline.fit(X_train, y_train)
    predictions = pipeline.predict(X_test)
    accuracy = float(accuracy_score(y_test, predictions))

    return ModelBundle(
        pipeline=pipeline,
        accuracy=accuracy,
        training_rows=len(X_train),
        test_rows=len(X_test),
    )


def get_model_bundle() -> ModelBundle:
    global _model_bundle
    if _model_bundle is not None:
        return _model_bundle
    with _model_bundle_lock:
        if _model_bundle is None:
            _model_bundle = train_risk_classifier(records=10_000, random_state=42)
    return _model_bundle


def predict_case_risk(features: Dict[str, float]) -> Dict[str, object]:
    model_bundle = get_model_bundle()
    model = model_bundle.pipeline.named_steps["model"]
    scaler = model_bundle.pipeline.named_steps["scaler"]

    row = np.array([[features[name] for name in FEATURE_NAMES]], dtype=np.float64)
    probabilities = model_bundle.pipeline.predict_proba(row)[0]
    predicted_index = int(np.argmax(probabilities))
    predicted_label = CLASS_NAMES[predicted_index]
    confidence = float(probabilities[predicted_index])

    scaled_row = scaler.transform(row)[0]
    class_coefficients = model.coef_[predicted_index]
    contributions = class_coefficients * scaled_row
    top_factor_indexes = np.argsort(np.abs(contributions))[::-1][:3]
    top_factors = {FEATURE_NAMES[i]: float(contributions[i]) for i in top_factor_indexes}

    # Weighted expected risk score from class probabilities:
    # low=0.2, medium=0.55, high=0.95
    risk_score = float(
        probabilities[0] * 0.2
        + probabilities[1] * 0.55
        + probabilities[2] * 0.95
    )

    return {
        "risk_label": predicted_label,
        "risk_score": round(risk_score, 4),
        "confidence": round(confidence, 4),
        "class_probabilities": {CLASS_NAMES[i]: round(float(probabilities[i]), 4) for i in range(len(CLASS_NAMES))},
        "top_factors": top_factors,
        "model_accuracy": round(model_bundle.accuracy, 4),
    }


def get_model_metadata() -> Dict[str, object]:
    model_bundle = get_model_bundle()
    return {
        "model_name": "CrimeConnectSyntheticRiskClassifier",
        "algorithm": "Multinomial Logistic Regression",
        "training_records": model_bundle.training_rows + model_bundle.test_rows,
        "training_rows": model_bundle.training_rows,
        "test_rows": model_bundle.test_rows,
        "accuracy": round(model_bundle.accuracy, 4),
        "feature_names": FEATURE_NAMES,
        "classes": CLASS_NAMES,
    }
