import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

# 1. Setup Parameters
num_days = 730 # 2 years of daily data
start_date = datetime(2024, 1, 1)
dates = [start_date + timedelta(days=i) for i in range(num_days)]

# We will simulate data for MOIL's largest mine: Balaghat
np.random.seed(42)

data = {
    'Date': dates,
    'Target_Production_MT': np.random.normal(1200, 50, num_days).astype(int),
}

df = pd.DataFrame(data)

# 2. Simulate Weather (Monsoon season in India: June - September)
def generate_rainfall(date):
    if date.month in [6, 7, 8, 9]:
        return np.random.exponential(scale=25.0) # Heavy rain
    else:
        return np.random.exponential(scale=2.0)  # Dry season

df['Rainfall_mm'] = df['Date'].apply(generate_rainfall).round(1)

# 3. Simulate Equipment Uptime (Percentage 0-100%)
df['Excavator_Uptime'] = np.clip(np.random.normal(92, 5, num_days) - (df['Rainfall_mm'] * 0.1), 40, 100)
df['LHD_Uptime'] = np.clip(np.random.normal(88, 8, num_days), 30, 100) 
df['Dumper_Uptime'] = np.clip(np.random.normal(90, 6, num_days) - (df['Rainfall_mm'] * 0.15), 30, 100)

# 4. Simulate Blasting Delays (Hours)
df['Blasting_Delay_Hours'] = np.where(
    df['Rainfall_mm'] > 40, 
    np.random.uniform(2, 6, num_days), 
    np.random.exponential(scale=0.5, size=num_days)
).round(1)

# 5. Calculate Actual Production based on constraints
production_efficiency = (df['Excavator_Uptime'] * 0.4 + df['LHD_Uptime'] * 0.4 + df['Dumper_Uptime'] * 0.2) / 100
weather_penalty = np.where(df['Blasting_Delay_Hours'] > 2, 0.85, 1.0) 

df['Actual_Production_MT'] = (df['Target_Production_MT'] * production_efficiency * weather_penalty).astype(int)

# 6. Define the Target Variable (Shortfall Flag for Classification)
# 1 = Shortfall (Missed target by > 10%), 0 = Normal
df['Is_Shortfall'] = np.where(df['Actual_Production_MT'] < (df['Target_Production_MT'] * 0.9), 1, 0)

# 7. Save to CSV dynamically so it works from anywhere
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, '..', 'data')
os.makedirs(DATA_DIR, exist_ok=True)

csv_path = os.path.join(DATA_DIR, 'historical_mining_data.csv')
df.to_csv(csv_path, index=False)

print(f"✅ Successfully generated '{csv_path}' with {len(df)} daily records.")
print(f"Total Shortfall Days Simulated: {df['Is_Shortfall'].sum()}")