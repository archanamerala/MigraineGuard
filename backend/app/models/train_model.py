import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import os

print("="*60)
print("🚀 TRAINING MIGRAINE PREDICTION MODEL")
print("="*60)

# Load data
print("\n📊 Loading dataset...")
train_df = pd.read_csv('../../data/migraine_train.csv')
test_df = pd.read_csv('../../data/migraine_test.csv')

# Separate features and target
feature_columns = ['sleep_hours', 'stress_level', 'activity_level', 'screen_time',
                   'temperature', 'humidity', 'pressure', 'air_quality',
                   'caffeine_intake', 'water_intake', 'meals_skipped']

X_train = train_df[feature_columns]
y_train = train_df['migraine_occurred']
X_test = test_df[feature_columns]
y_test = test_df['migraine_occurred']

print(f"Training samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")
print(f"\nClass distribution:")
print(f"  No Migraine: {(y_train == 0).sum()} ({((y_train == 0).sum()/len(y_train)*100):.1f}%)")
print(f"  Migraine: {(y_train == 1).sum()} ({((y_train == 1).sum()/len(y_train)*100):.1f}%)")

# Scale features
print("\n⚙️ Scaling features...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train model
print("\n🤖 Training Random Forest model...")
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1,
    verbose=1
)

model.fit(X_train_scaled, y_train)

# Evaluate
print("\n📈 Evaluating model...")
y_pred = model.predict(X_test_scaled)
y_pred_proba = model.predict_proba(X_test_scaled)

accuracy = accuracy_score(y_test, y_pred)
print(f"\n✅ Model Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")

print("\n📊 Classification Report:")
print(classification_report(y_test, y_pred, target_names=['No Migraine', 'Migraine']))

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
print("\n📊 Confusion Matrix:")
print(f"              Predicted")
print(f"              No    Yes")
print(f"Actual No    {cm[0,0]:4d}  {cm[0,1]:4d}")
print(f"       Yes   {cm[1,0]:4d}  {cm[1,1]:4d}")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': feature_columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\n🎯 Feature Importance (Top factors for migraine prediction):")
print("-" * 40)
for idx, row in feature_importance.iterrows():
    percentage = row['importance'] * 100
    bar = '█' * int(percentage) + '░' * (50 - int(percentage))
    print(f"  {row['feature']:20s} {bar} {percentage:.1f}%")

# Create models directory if it doesn't exist
os.makedirs('app/models/saved', exist_ok=True)

# Save model and scaler
print("\n💾 Saving model...")
joblib.dump(model, '../models/saved/migraine_model.pkl')
joblib.dump(scaler, '../models/saved/scaler.pkl')
joblib.dump(feature_columns, '../models/saved/feature_columns.pkl')

# Save feature importance for later use
feature_importance.to_csv('app/models/saved/feature_importance.csv', index=False)

print("\n✅ Model saved successfully!")
print("📁 Location: app/models/saved/")
print("   - migraine_model.pkl (trained model)")
print("   - scaler.pkl (feature scaler)")
print("   - feature_columns.pkl (feature names)")
print("   - feature_importance.csv (importance scores)")
print("="*60)

# Quick test with sample data
print("\n🧪 Quick test with sample data:")
sample = np.array([[
    6.5,  # sleep_hours
    8,    # stress_level
    4,    # activity_level
    9,    # screen_time
    25,   # temperature
    65,   # humidity
    1008, # pressure
    55,   # air_quality
    3,    # caffeine_intake
    4,    # water_intake
    2     # meals_skipped
]])

sample_scaled = scaler.transform(sample)
pred = model.predict(sample_scaled)[0]
prob = model.predict_proba(sample_scaled)[0][1]

print(f"Sample prediction: {'Migraine' if pred == 1 else 'No Migraine'}")
print(f"Risk probability: {prob*100:.1f}%")
print("="*60)
