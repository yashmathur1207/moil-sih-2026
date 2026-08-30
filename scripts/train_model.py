import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from xgboost import XGBClassifier
import os

# 1. Dynamic Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(SCRIPT_DIR, '..', 'data', 'historical_mining_data.csv')
MODEL_DIR = os.path.join(SCRIPT_DIR, '..', 'models')
os.makedirs(MODEL_DIR, exist_ok=True)

# 2. Load Data
if not os.path.exists(DATA_PATH):
    print(f"Error: Could not find {DATA_PATH}")
    exit()

df = pd.read_csv(DATA_PATH)

# 3. Select Features & Target
features = ['Rainfall_mm', 'Excavator_Uptime', 'LHD_Uptime', 'Dumper_Uptime', 'Blasting_Delay_Hours']
X = df[features]
y = df['Is_Shortfall']

# 4. Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5. Initialize & Train XGBoost
print("Training the XGBoost Predictive Model...")
model = XGBClassifier(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=4,
    random_state=42,
    eval_metric='logloss'
)

model.fit(X_train, y_train)

# 6. Evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"\n--- Model Evaluation ---")
print(f"Accuracy: {accuracy * 100:.2f}%\n")
print("Classification Report:")
print(classification_report(y_test, y_pred))

print("\n--- Feature Importance ---")
for feature, importance in zip(features, model.feature_importances_):
    print(f"{feature}: {importance:.3f}")

# 7. Save Model
MODEL_SAVE_PATH = os.path.join(MODEL_DIR, 'shortfall_model.json')
model.save_model(MODEL_SAVE_PATH)
print(f"\n✅ Model successfully saved to {MODEL_SAVE_PATH}")