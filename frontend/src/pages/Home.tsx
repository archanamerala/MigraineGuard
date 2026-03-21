import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Brain, Cloud, TrendingUp, Shield, Download, AlertCircle, Moon, Coffee, Droplets, Thermometer, Wind } from 'lucide-react';
import PredictionTool from '../components/PredictionTool';

const Home: React.FC = () => {
  const [showPrediction, setShowPrediction] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">
              Predict and Prevent Migraines with AI
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              MigraineGuard uses machine learning to analyze 11 different factors 
              and predict your migraine risk with <span className="font-bold text-white">95.85% accuracy</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition transform hover:scale-105"
              >
                Get Started Free
              </Link>
              <button
                onClick={() => setShowPrediction(!showPrediction)}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition transform hover:scale-105"
              >
                {showPrediction ? 'Hide Prediction Tool' : 'Try Prediction Tool'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
            <StatItem value="95.85%" label="Accuracy" />
            <StatItem value="11" label="Factors" />
            <StatItem value="10,000" label="Samples" />
            <StatItem value="24/7" label="Monitoring" />
          </div>
        </div>
      </section>

      {/* Prediction Tool (conditionally shown) */}
      {showPrediction && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <PredictionTool />
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">How MigraineGuard Helps You</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Our AI-powered platform analyzes your lifestyle and environment to give you personalized insights
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-8 h-8 text-blue-600" />}
              title="AI-Powered Predictions"
              description="Random Forest model with 95.85% accuracy analyzes sleep, stress, weather, and more."
            />
            <FeatureCard
              icon={<Activity className="w-8 h-8 text-blue-600" />}
              title="Lifestyle Tracking"
              description="Log your daily activities, sleep patterns, stress levels, and meals."
            />
            <FeatureCard
              icon={<Cloud className="w-8 h-8 text-blue-600" />}
              title="Weather Integration"
              description="Automatic weather data for temperature, humidity, pressure, and air quality."
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-blue-600" />}
              title="Detailed Analytics"
              description="Interactive charts showing your risk trends and patterns over time."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-blue-600" />}
              title="Personalized Insights"
              description="Get recommendations based on your unique triggers and history."
            />
            <FeatureCard
              icon={<Download className="w-8 h-8 text-blue-600" />}
              title="Export Data"
              description="Download your logs and reports to share with your healthcare provider."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <Step number={1} title="Sign Up" description="Create your free account in seconds" />
            <Step number={2} title="Log Data" description="Track your lifestyle and migraine episodes" />
            <Step number={3} title="Get Predictions" description="Receive daily risk assessments" />
            <Step number={4} title="Prevent" description="Take action based on insights" />
          </div>
        </div>
      </section>

      {/* Feature Importance Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Top Migraine Risk Factors</h2>
          <p className="text-gray-600 text-center mb-12">Based on our ML model analysis of 10,000+ samples</p>
          <div className="max-w-2xl mx-auto">
            <RiskFactor factor="Stress Level" percentage={43.2} color="bg-red-500" />
            <RiskFactor factor="Sleep Hours" percentage={22.2} color="bg-blue-500" />
            <RiskFactor factor="Meals Skipped" percentage={8.3} color="bg-yellow-500" />
            <RiskFactor factor="Caffeine Intake" percentage={6.5} color="bg-purple-500" />
            <RiskFactor factor="Screen Time" percentage={5.4} color="bg-green-500" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Take Control?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of users who prevent migraines with AI</p>
          <Link
            to="/auth"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-block"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <div className="text-2xl font-bold text-blue-600">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

const Step: React.FC<{ number: number; title: string; description: string }> = ({
  number,
  title,
  description
}) => (
  <div className="text-center">
    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
      {number}
    </div>
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const RiskFactor: React.FC<{ factor: string; percentage: number; color: string }> = ({ 
  factor, 
  percentage, 
  color 
}) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="font-medium">{factor}</span>
      <span className="text-blue-600 font-bold">{percentage}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className={`${color} h-2.5 rounded-full transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

export default Home;