from flask import Flask, request, jsonify
from flask_cors import CORS
from xgboost import XGBClassifier
import pandas as pd
import os

app = Flask(__name__)
CORS(app) # Allow frontend to communicate with this API

# 1. Load the trained XGBoost Model
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, '..', 'models', 'shortfall_model.json')

model = XGBClassifier()
if os.path.exists(MODEL_PATH):
    model.load_model(MODEL_PATH)
    print("✅ Model successfully loaded into Flask.")
else:
    print(f"⚠️ Error: Could not find model at {MODEL_PATH}")

# 2. Define the Decision Engine for Corrective Actions
def generate_corrective_actions(data):
    actions = []
    if data['LHD_Uptime'] < 75:
        actions.append("Critical: LHD Uptime is low. Deploy backup underground LHD units from Sector B to maintain ore haulage.")
    if data['Excavator_Uptime'] < 80:
        actions.append("Warning: Surface excavator efficiency dropping. Schedule immediate preventative maintenance on primary excavators.")
    if data['Blasting_Delay_Hours'] > 2.0:
        actions.append("Action: Blasting delayed due to weather/drilling. Extend operational shift by 2 hours to recover target tonnage.")
    if data['Rainfall_mm'] > 30:
        actions.append("Alert: Heavy rainfall detected. Initiate dewatering pumps in open-cast pits to prevent flooding delays.")
    
    if not actions:
        actions.append("Operations are nominal. Maintain current schedule.")
        
    return actions

# 3. Create the Prediction API Endpoint
@app.route('/api/predict-shortfall', methods=['POST'])
def predict_shortfall():
    try:
        # Get JSON data from the frontend (e.g., from sliders on the dashboard)
        incoming_data = request.json
        
        # Ensure all required features are present
        features = ['Rainfall_mm', 'Excavator_Uptime', 'LHD_Uptime', 'Dumper_Uptime', 'Blasting_Delay_Hours']
        for feature in features:
            if feature not in incoming_data:
                return jsonify({'error': f'Missing feature: {feature}'}), 400

        # Convert to a DataFrame (XGBoost expects a 2D array/DataFrame)
        df = pd.DataFrame([incoming_data], columns=features)
        
        # Make the prediction (1 = Shortfall, 0 = Normal)
        prediction = int(model.predict(df)[0])
        
        # Get probability/confidence score
        probabilities = model.predict_proba(df)[0]
        confidence = float(probabilities[1] if prediction == 1 else probabilities[0]) * 100

        # Generate actionable advice based on the input data
        corrective_actions = generate_corrective_actions(incoming_data) if prediction == 1 else ["Operations are stable."]

        # Return the JSON response to the frontend
        return jsonify({
            'is_shortfall': True if prediction == 1 else False,
            'confidence_percentage': round(confidence, 1),
            'corrective_actions': corrective_actions,
            'input_data_received': incoming_data
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 4. Create a Health Check Endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'API is running', 'model_loaded': os.path.exists(MODEL_PATH)})

if __name__ == '__main__':
    # Run on port 5001
    app.run(debug=True, host='0.0.0.0', port=5001)