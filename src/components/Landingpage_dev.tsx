import { motion } from 'framer-motion';
import { Github, Shield, Brain, Heart, Zap, Bot, Mail } from 'lucide-react';

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI-Guided Creation & Administration",
    description: "Meet BabyWen, your AI assistant that makes creating a DAO as simple as following a friendly conversation."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure & Transparent",
    description: "Built on blockchain technology ensuring complete transparency and security in all operations."
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "User-Friendly",
    description: "An interface so intuitive that anyone can create and manage their DAO with confidence."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Quick Setup",
    description: "Launch your DAO in minutes with our guided process and ready-to-use templates."
  }
];

const screenshots = [
  {
    title: "Intuitive Dashboard",
    description: "A clean interface that makes DAO management straightforward",
    image: "https://placehold.co/600x400/6366f1/ffffff?text=Dashboard+View"
  },
  {
    title: "AI Assistant",
    description: "BabyWen guides you through every step of the process",
    image: "https://placehold.co/600x400/8b5cf6/ffffff?text=Creation+Wizard"
  },
  {
    title: "Community Tools",
    description: "Manage your community with familiar, easy-to-use tools",
    image: "https://placehold.co/600x400/6366f1/ffffff?text=Community+Tools"
  }
];

export default function LandingPageDev() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[70%] bg-purple-600/10 rounded-full blur-[120px] animate-gradient-xy"></div>
        <div className="absolute bottom-[-30%] left-[-10%] w-[70%] h-[80%] bg-blue-600/10 rounded-full blur-[120px] animate-gradient-xy"></div>
      </div>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 sm:pb-32 text-center">
          <motion.div 
            className="flex justify-center mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src="/assets/logo.png" 
              alt="BWEN Logo" 
              className="w-[400px] sm:w-[600px] lg:w-[800px] h-auto" 
            />
          </motion.div>
          <motion.h1 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Coming Soon
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl lg:text-2xl text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The first AI-guided DAO launchpad that makes creating and managing DAOs accessible to everyone.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a href="#agent" className="btn-primary inline-flex items-center justify-center">
              Meet BabyWen
              <Bot className="ml-2 w-5 h-5" />
            </a>
            <a href="mailto:contact@bwendashboard.com" className="btn-outline inline-flex items-center justify-center">
              Contact Us
              <Mail className="ml-2 w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </main>

      {/* Agent IA Section */}
      <section id="agent" className="relative z-10 py-24 sm:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <motion.h2 
                className="text-3xl sm:text-4xl font-bold mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                Meet BabyWen,<br />
                Your Personal AI Assistant
              </motion.h2>
              <motion.p 
                className="text-base sm:text-xl text-gray-400 mb-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                BabyWen is here to guide you through every step. Using natural language and understanding your needs, it transforms your ideas into a functional DAO in minutes.
              </motion.p>
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <p className="text-gray-300">Speaks in plain English, not tech jargon</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <p className="text-gray-300">Patient and understanding at every step</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <p className="text-gray-300">Solves problems in real-time</p>
                </div>
              </motion.div>
            </div>
            <motion.div
              className="order-1 lg:order-2 relative h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden rounded-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-xl relative">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover absolute inset-0"
                >
                  <source 
                    src="/assets/video_agent.webm" 
                    type="video/webm"
                  />
                  Video cannot be played.
                </video>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/30 rounded-full blur-[100px] animate-pulse"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 bg-black/50 py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why BWEN?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Making DAO creation and management accessible to everyone through AI guidance.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section id="screenshots" className="relative z-10 py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">See It In Action</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover how BWEN makes DAO creation and management effortless.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {screenshots.map((screenshot, index) => (
              <motion.div
                key={index}
                className="rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="relative group">
                  <img 
                    src={screenshot.image} 
                    alt={screenshot.title}
                    className="w-full h-auto transform transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-xl font-semibold mb-2">{screenshot.title}</h3>
                    <p className="text-gray-300">{screenshot.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <img src="/assets/logo.png" alt="BWEN Logo" className="h-10 w-auto" />
              <div className="text-gray-400">© 2024 BWEN. All rights reserved.</div>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 