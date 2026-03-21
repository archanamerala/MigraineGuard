import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Activity, Cloud, TrendingUp, Shield, Download, Sparkles, BarChart3, Bell, Smartphone } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur rounded-full p-4">
                <Brain className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              AI-Powered
              <span className="block">Migraine Prediction</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Predicting migraines before they strike using advanced AI and lifestyle data
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition transform hover:scale-105"
              >
                Try Prediction Tool
              </Link>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">About Our Project</h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Revolutionary AI system that predicts migraine attacks before they occur, empowering individuals 
            to take proactive measures and improve their quality of life.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Brain className="w-8 h-8 text-blue-600" />}
              title="AI & Machine Learning"
              description="Advanced neural networks analyze patterns in your lifestyle and health data"
            />
            <FeatureCard
              icon={<Cloud className="w-8 h-8 text-blue-600" />}
              title="Weather Integration"
              description="Environmental factors like temperature, humidity, and air pressure"
            />
            <FeatureCard
              icon={<Activity className="w-8 h-8 text-blue-600" />}
              title="Lifestyle Tracking"
              description="Sleep patterns, diet, stress levels, and physical activity monitoring"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-blue-600" />}
              title="Predictive Analytics"
              description="Hour-by-hour migraine risk forecasting with personalized insights"
            />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">The Problem</h2>
            <p className="text-lg text-gray-600 text-center mb-8">
              Migraines are a debilitating neurological disorder affecting millions worldwide. 
              Traditional approaches focus on treatment after onset, leaving patients reactive rather than proactive.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl font-bold text-blue-600 mb-2">39M</div>
                <div className="text-gray-600">Americans affected</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl font-bold text-blue-600 mb-2">85%</div>
                <div className="text-gray-600">Prediction accuracy</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-gray-600">Real-time monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Powerful Features</h2>
          <p className="text-gray-600 text-center mb-12">Comprehensive AI-driven features designed to predict, prevent, and manage migraines</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PowerFeature icon={<BarChart3 className="w-6 h-6" />} title="Hour-by-Hour Forecasting" description="Real-time migraine risk predictions updated every hour, just like weather forecasts" />
            <PowerFeature icon={<Brain className="w-6 h-6" />} title="Personalized AI Predictions" description="Machine learning models adapt to your unique triggers and patterns over time" />
            <PowerFeature icon={<Bell className="w-6 h-6" />} title="Proactive Suggestions" description="Actionable recommendations like hydration, rest, or environment adjustments" />
            <PowerFeature icon={<Smartphone className="w-6 h-6" />} title="Smart Device Integration" description="Automatic environment control with smart lights, thermostats, and reminders" />
            <PowerFeature icon={<Activity className="w-6 h-6" />} title="Pattern Recognition" description="Advanced analytics identify subtle correlations in lifestyle and environmental data" />
            <PowerFeature icon={<Shield className="w-6 h-6" />} title="Preventive Care Focus" description="Shift from reactive treatment to proactive prevention" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <Step number={1} title="Data Collection" description="Gather lifestyle data and environmental factors" />
            <Step number={2} title="AI Analysis" description="Machine learning analyzes patterns in your data" />
            <Step number={3} title="Risk Prediction" description="Generate hour-by-hour migraine risk forecasts" />
            <Step number={4} title="Proactive Alerts" description="Receive personalized suggestions to prevent attacks" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control?</h2>
          <p className="text-xl mb-8">Join thousands of users who prevent migraines with AI</p>
          <Link to="/auth" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-block">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const PowerFeature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition">
    <div className="text-blue-600">{icon}</div>
    <div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

const Step: React.FC<{ number: number; title: string; description: string }> = ({ number, title, description }) => (
  <div className="text-center">
    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
      {number.toString().padStart(2, '0')}
    </div>
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default Landing;