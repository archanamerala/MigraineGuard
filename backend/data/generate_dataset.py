import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split

# Set random seed
np.random.seed(42)

# Number of samples
n_samples = 10000

# Generate features
sleep_hours = np.random.normal(7, 1.5, n_samples).clip(0, 12)
stress_level = np.random.uniform(1, 10, n_samples)
activity_level = np.random.uniform(1, 10, n_samples)
screen_time = np.random.normal(6, 2, n_samples).clip(0, 16)
temperature = np.random.normal(22, 5, n_samples).clip(-5, 40)
humidity = np.random.uniform(30, 90, n_samples)
pressure = np.random.normal(1013, 10, n_samples)
air_quality = np.random.uniform(0, 100, n_samples)
caffeine_intake = np.random.poisson(2, n_samples)
water_intake = np.random.normal(6, 2, n_samples).clip(0, 15)
meals_skipped = np.random.choice([0, 1, 2, 3], n_samples, p=[0.3, 0.4, 0.2, 0.1])

# Generate target (migraine risk)
risk_prob = (
    0.3 * (stress_level / 10) +
    0.25 * ((8 - sleep_hours) / 8) +
    0.15 * (screen_time / 16) +
    0.1 * ((30 - abs(temperature - 22)) / 30) +
    0.1 * (caffeine_intake / 5) +
    0.1 * (meals_skipped / 3)
)
risk_prob = risk_prob.clip(0, 1)
migraine_occurred = (risk_prob > 0.3).astype(int)

# Create DataFrame
df = pd.DataFrame({
    'sleep_hours': sleep_hours,
    'stress_level': stress_level,
    'activity_level': activity_level,
    'screen_time': screen_time,
    'temperature': temperature,
    'humidity': humidity,
    'pressure': pressure,
    'air_quality': air_quality,
    'caffeine_intake': caffeine_intake,
    'water_intake': water_intake,
    'meals_skipped': meals_skipped,
    'migraine_occurred': migraine_occurred
})

# Split and save
train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)
train_df.to_csv('data/migraine_train.csv', index=False)
test_df.to_csv('data/migraine_test.csv', index=False)

print("="*50)
print("✅ DATASET CREATED SUCCESSFULLY!")
print("="*50)
print(f"Training samples: {len(train_df)}")
print(f"Testing samples: {len(test_df)}")
print(f"Migraine occurrence rate: {df['migraine_occurred'].mean()*100:.1f}%")
print("\nFeature correlations with migraine:")
print(df.corr()['migraine_occurred'].sort_values(ascending=False))
print("="*50)