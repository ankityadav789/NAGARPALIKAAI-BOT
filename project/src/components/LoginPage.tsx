import React, { useState } from 'react';
import { Building2, Mail, User, ArrowRight, Shield, Clock, CheckCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, name: string) => Promise<boolean>;
  isLoading: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isLoading }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await onLogin(email, name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  const features = [
    { icon: Clock, title: '24/7 Available', description: 'Round-the-clock municipal support' },
    { icon: Shield, title: 'Secure & Private', description: 'Your data is protected and confidential' },
    { icon: CheckCircle, title: 'Quick Resolution', description: 'Fast complaint processing and updates' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Nagar Palika</h1>
                <p className="text-green-600 font-medium">AI Assistant</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Smart Municipal
              <span className="block text-green-600">Services</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              Experience the future of municipal services with our AI-powered assistant. 
              Report issues, track complaints, and get instant support.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/80 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                <Building2 size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Nagar Palika Chat Bot</h1>
              <p className="text-green-600">Municipal Services</p>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to access municipal services</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User size={18} className={`transition-colors duration-200 ${
                        focusedField === 'name' ? 'text-green-500' : 'text-gray-400'
                      }`} />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Enter your full name"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className={`transition-colors duration-200 ${
                        focusedField === 'email' ? 'text-green-500' : 'text-gray-400'
                      }`} />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Enter your email address"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email.trim() || !name.trim()}
                className="w-full group relative bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </div>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-xs text-gray-500">
                By signing in, you agree to our terms of service and privacy policy.
                <br />
                Your information is secure and will only be used for municipal services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};