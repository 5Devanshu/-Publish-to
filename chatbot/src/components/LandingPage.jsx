import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, ArrowRight, CheckCircle, MessageSquare, Clock, BarChart3, Users, Menu, X, User, Bell, Shield, Zap, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Login Component
const LoginPage = ({ onBack, onSignupClick, onSuccessfulLogin, setIsLoggedIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      setIsLoggedIn(true);
      onSuccessfulLogin();
    } catch (error) {
      console.error('Login failed:', error);
      alert(error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6"
    >
      <Card className="w-full max-w-md bg-gray-800/80 border-gray-700">
        <CardContent className="p-8">
          <div className="flex justify-between items-center mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onBack}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-bold text-center text-white font-['Poppins']">Welcome Back</h2>
            <div className="w-8"></div> {/* For balance */}
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 font-['Roboto']">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white font-['Roboto'] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="yourname@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 font-['Roboto']">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 bg-gray-700 border border-gray-600 rounded-md text-white font-['Roboto'] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  type="button"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-300 font-['Roboto']">Remember me</label>
              </div>
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300 font-['Roboto']">Forgot password?</a>
            </div>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all" onClick={handleLogin}>
              Log In <LogIn className="ml-2 h-4 w-4" />
            </Button>
            
             <div className="text-center">
              <span className="text-gray-400 text-sm font-['Roboto']">Don't have an account? </span>
              <button onClick={onSignupClick} className="text-blue-400 hover:text-blue-300 text-sm font-['Roboto']">Sign up</button>
            </div>
            
            <div className="relative flex items-center mt-6">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm font-['Roboto']">Or continue with</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {['Google', 'GitHub', 'Twitter'].map((provider) => (
                <Button 
                  key={provider} 
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  {provider}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Signup Component
const SignupPage = ({ onBack, onLoginClick, onSuccessfulSignup, setIsLoggedIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();
      console.log('Signup successful:', data);
      setIsLoggedIn(true);
      onSuccessfulSignup();
    } catch (error) {
      console.error('Signup failed:', error);
      alert(error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6"
    >
      <Card className="w-full max-w-md bg-gray-800/80 border-gray-700">
        <CardContent className="p-8">
          <div className="flex justify-between items-center mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onBack}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-bold text-center text-white font-['Poppins']">Create Account</h2>
            <div className="w-8"></div> {/* For balance */}
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 font-['Roboto']">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white font-['Roboto'] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 font-['Roboto']">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white font-['Roboto'] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="yourname@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 font-['Roboto']">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 bg-gray-700 border border-gray-600 rounded-md text-white font-['Roboto'] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  type="button"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-400 font-['Roboto']">Password must be at least 8 characters and include a number and symbol</p>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="terms" 
                className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-300 font-['Roboto']">
                I agree to the <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a> and <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
              </label>
            </div>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all" onClick={handleSignup}>
              Create Account <UserPlus className="ml-2 h-4 w-4" />
            </Button>
            
             <div className="text-center">
              <span className="text-gray-400 text-sm font-['Roboto']">Already have an account? </span>
              <button onClick={onLoginClick} className="text-blue-400 hover:text-blue-300 text-sm font-['Roboto']">Log in</button>
            </div>
            
            <div className="relative flex items-center mt-6">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm font-['Roboto']">Or sign up with</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {['Google', 'GitHub', 'Twitter'].map((provider) => (
                <Button 
                  key={provider} 
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  {provider}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'login', or 'signup'
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Handle navigation
  const handleLoginClick = () => {
    setCurrentPage('login');
  };

  const handleSignupClick = () => {
    setCurrentPage('signup');
  };

  const handleSuccessfulLogin = () => {
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  const handleSuccessfulSignup = () => {
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  // Conditional rendering based on currentPage state
  if (currentPage === 'login') {
    return <LoginPage onBack={handleBackToLanding} onSignupClick={handleSignupClick} onSuccessfulLogin={handleSuccessfulLogin} setIsLoggedIn={setIsLoggedIn} />;
  }

  if (currentPage === 'signup') {
    return <SignupPage onBack={handleBackToLanding} onLoginClick={handleLoginClick} onSuccessfulSignup={handleSuccessfulSignup} setIsLoggedIn={setIsLoggedIn} />;
  }

  // Landing page rendering
  return (
    <div className="h-full bg-gradient-to-br from-gray-900 to-gray-800 text-white font-['Inter']">
      {/* Navigation */}
      <nav className="py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 font-['Poppins']">
            SupportAI
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className="hover:text-blue-400 transition-colors font-['Roboto']">Features</a>
          <a href="#benefits" className="hover:text-blue-400 transition-colors font-['Roboto']">Benefits</a>
          <a href="#about" className="hover:text-blue-400 transition-colors font-['Roboto']">About</a>
          <Button 
              variant="outline" 
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          <div className="flex space-x-3">
            <Button
              variant="outline" 
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
              onClick={handleLoginClick}
            >
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white transition-all"
              onClick={handleSignupClick}
            >
              <UserPlus className="mr-2 h-4 w-4" /> Sign Up
            </Button>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden p-4 bg-gray-800 absolute w-full z-50"
        >
          <div className="flex flex-col space-y-4">
            <a href="#features" className="p-2 hover:bg-gray-700 rounded font-['Roboto']" onClick={toggleMenu}>Features</a>
            <a href="#benefits" className="p-2 hover:bg-gray-700 rounded font-['Roboto']" onClick={toggleMenu}>Benefits</a>
            <a href="#about" className="p-2 hover:bg-gray-700 rounded font-['Roboto']" onClick={toggleMenu}>About</a>
            <div className="flex flex-col space-y-2 pt-2">
              <Button 
                variant="outline" 
                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                onClick={() => {
                  toggleMenu();
                  handleLoginClick();
                }}
              >
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white transition-all"
                onClick={() => {
                  toggleMenu();
                  handleSignupClick();
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" /> Sign Up
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <main>
        {/* Hero Section */}
        <section className="py-20 px-6 md:px-20 flex flex-col-reverse md:flex-row items-center">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight font-['Poppins']">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                AI-Powered
              </span>
              <br />Customer Support
              <br />Multi-Agent Framework
            </h1>
            <p className="text-gray-300 text-lg font-['Roboto']">
              Enhance efficiency through smart automation, real-time insights, and seamless collaboration.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                onClick={handleSignupClick}
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
                Watch Demo
              </Button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 mb-10 md:mb-0"
          >
            <div className="bg-gradient-to-tr from-blue-500/20 to-purple-500/20 p-1 rounded-lg">
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-6">
                <div className="w-full h-64 rounded flex items-center justify-center bg-gray-700/50">
                  <User className="h-32 w-32 text-blue-400" strokeWidth={1.5} />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="text-gray-300 text-sm mb-1 font-['Roboto']">Avg. Response Time</div>
                    <div className="text-xl font-bold text-white font-['Poppins']">1.2 min</div>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="text-gray-300 text-sm mb-1 font-['Roboto']">Resolution Rate</div>
                    <div className="text-xl font-bold text-white font-['Poppins']">92%</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-6 md:px-20 bg-gray-900/50">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4 font-['Poppins']"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                Powerful Features
              </span>
            </motion.h2>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-300 max-w-2xl mx-auto font-['Roboto']"
            >
              Our multi-agent AI system streamlines customer support operations through intelligent automation.
            </motion.p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: <MessageSquare className="h-10 w-10 text-blue-400" />,
                title: "Smart Summarization",
                description: "Automatically generate concise summaries of customer conversations, identifying key points and context."
              },
              {
                icon: <CheckCircle className="h-10 w-10 text-green-400" />,
                title: "Action Extraction",
                description: "Identify and categorize action items from customer interactions for efficient follow-up."
              },
              {
                icon: <Users className="h-10 w-10 text-indigo-400" />,
                title: "Intelligent Routing",
                description: "Route tasks to the appropriate teams based on content analysis and historical patterns."
              },
              {
                icon: <Clock className="h-10 w-10 text-purple-400" />,
                title: "Resolution Prediction",
                description: "Estimate resolution times and recommend solutions based on historical data."
              }
            ].map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="bg-gray-800/60 border-gray-700 overflow-hidden group hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="mb-4"
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2 text-blue-300 font-['Poppins']">{feature.title}</h3>
                    <p className="text-gray-300 font-['Roboto']">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-16 px-6 md:px-20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <h2 className="text-3xl font-bold mb-6 font-['Poppins']">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                  Transform Your Support Operations
                </span>
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: <Zap className="h-5 w-5 text-yellow-400" />,
                    title: "Reduce Resolution Time by 60%",
                    description: "Automated summarization and routing significantly cut down time to resolution."
                  },
                  {
                    icon: <Bell className="h-5 w-5 text-red-400" />,
                    title: "Improve Agent Productivity",
                    description: "Empower agents with AI-driven recommendations and historical insights."
                  },
                  {
                    icon: <Shield className="h-5 w-5 text-green-400" />,
                    title: "Enhanced Customer Satisfaction",
                    description: "Quicker, more accurate resolutions lead to happier customers and improved NPS scores."
                  }
                ].map((benefit, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start"
                    initial={{ x: -10, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="mt-1 mr-4 bg-blue-500/20 p-2 rounded-full">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-blue-300 font-['Poppins']">{benefit.title}</h3>
                      <p className="text-gray-300 font-['Roboto']">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <div className="bg-gradient-to-tr from-blue-500/20 to-purple-500/20 p-1 rounded-lg hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300">
                <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-6 h-full">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <BarChart3 className="h-16 w-16 text-blue-400 mb-6" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4 text-blue-300 font-['Poppins']">Real-time Analytics</h3>
                  <p className="text-gray-300 mb-6 font-['Roboto']">
                    Track key performance metrics, identify trends, and continuously improve your support operations with data-driven insights.
                  </p>
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 gap-4"
                  >
                    {[
                      { label: "Avg. Resolution Time", value: "2.4 hrs" },
                      { label: "Customer Satisfaction", value: "95%" },
                      { label: "First Contact Resolution", value: "78%" },
                      { label: "Agent Productivity", value: "+42%" }
                    ].map((stat, index) => (
                      <motion.div 
                        key={index} 
                        variants={itemVariants}
                        className="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700/70 transition-all duration-300"
                      >
                        <div className="text-gray-300 text-sm mb-1 font-['Roboto']">{stat.label}</div>
                        <div className="text-xl font-bold text-blue-200 font-['Poppins']">{stat.value}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-6 md:px-20 text-center">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto bg-gradient-to-tr from-blue-500/20 to-purple-500/20 p-1 rounded-lg hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300"
          >
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-4 text-white font-['Poppins']">Ready to Transform Your Customer Support?</h2>
              <p className="text-gray-300 mb-6 font-['Roboto']">Experience the next generation of customer support with our AI-powered platform. Start your free 14-day trial today.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  onClick={handleSignupClick}
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 px-6 md:px-20 bg-gray-900/50">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4 font-['Poppins']"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                About SupportAI
              </span>
            </motion.h2>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-300 max-w-2xl mx-auto font-['Roboto']"
            >
              We're a team of AI researchers and customer experience experts on a mission to revolutionize customer support.
            </motion.p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              {
                title: "Our Mission",
                description: "To make customer support more efficient, accurate, and satisfying for both businesses and their customers through AI innovation."
              },
              {
                title: "Our Team",
                description: "A diverse group of AI researchers, customer experience specialists, and software engineers working together to solve complex support challenges."
              },
              {
                title: "Our Approach",
                description: "We combine cutting-edge AI technology with deep customer support expertise to create solutions that deliver real business value."
              }
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="bg-gray-800/60 border-gray-700 h-full hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-blue-300 font-['Poppins']">{item.title}</h3>
                    <p className="text-gray-300 font-['Roboto']">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-6 md:px-20">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4 font-['Poppins']"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                What Our Clients Say
              </span>
            </motion.h2>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                quote: "SupportAI has transformed our customer support operations. We've reduced response times by 70% and improved CSAT scores significantly.",
                name: "Sarah Johnson",
                role: "Customer Success Director, TechCorp"
              },
              {
                quote: "The insights we've gained from the analytics dashboard have helped us identify and address process bottlenecks we didn't even know existed.",
                name: "Michael Chen",
                role: "VP of Operations, CloudSystems"
              },
              {
                quote: "Our agents love working with SupportAI. It handles the repetitive tasks and gives them more time to focus on complex customer issues.",
                name: "Jessica Rodriguez",
                role: "Support Team Lead, InnovateCo"
              }
            ].map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="bg-gray-800/60 border-gray-700 h-full hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="mb-4 text-blue-400">
                      {"★".repeat(5)}
                    </div>
                    <p className="text-gray-300 italic mb-6 font-['Roboto']">"{testimonial.quote}"</p>
                    <div>
                      <div className="font-semibold text-white font-['Poppins']">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm font-['Roboto']">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-20 bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 mb-4 font-['Poppins']">
              SupportAI
            </div>
            <p className="text-gray-400 font-['Roboto']">
              Revolutionizing customer support through intelligent automation and real-time insights.
            </p>
          </div>
          
          {[
            {
              title: "Product",
              links: ["Features", "Solutions", "Pricing", "Documentation"]
            },
            {
              title: "Company",
              links: ["About", "Careers", "Blog", "Contact"]
            },
            {
              title: "Resources",
              links: ["Help Center", "API", "Status", "Partners"]
            }
          ].map((column, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-white mb-4 font-['Poppins']">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors font-['Roboto']">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0 font-['Roboto']">
            © 2025 SupportAI. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">LinkedIn</a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
