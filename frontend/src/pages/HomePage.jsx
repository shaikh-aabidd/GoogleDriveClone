import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const navigate = useNavigate();
  const {isAuthenticated,user} = useSelector(s=>s.auth)


  const categories = [
    { title: "Web Development", icon: "🌐", count: "1,247 services", color: "from-primary to-primary-dark" },
    { title: "Graphic Design", icon: "🎨", count: "2,156 services", color: "from-secondary to-secondary-dark" },
    { title: "Content Writing", icon: "✍️", count: "892 services", color: "from-accent to-accent-dark" },
    { title: "Digital Marketing", icon: "📈", count: "1,534 services", color: "from-success to-success-dark" },
    { title: "Video Editing", icon: "🎬", count: "756 services", color: "from-warning to-warning-dark" },
    { title: "Mobile Apps", icon: "📱", count: "623 services", color: "from-error to-error-dark" },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Startup Founder",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      text: "Found an amazing developer who built our entire platform. The quality exceeded our expectations!",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Marketing Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      text: "The graphic designer I hired created stunning visuals that transformed our brand identity.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "E-commerce Owner",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      text: "Professional content writers helped scale our blog and increase organic traffic by 300%.",
      rating: 5
    }
  ];

  const features = [
    { icon: "🎯", title: "Quality Guarantee", desc: "Every project is backed by our satisfaction guarantee" },
    { icon: "⚡", title: "Fast Delivery", desc: "Get your project completed in record time" },
    { icon: "🔒", title: "Secure Payments", desc: "Protected payments with escrow system" },
    { icon: "🌍", title: "Global Talent", desc: "Access freelancers from around the world" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id^="section-"]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const FloatingCard = ({ children, delay = 0 }) => (
    <div 
      className="transform transition-all duration-1000 hover:scale-105"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );

  const handleStartSelling = ()=>{
    if(isAuthenticated && user.role === 'client'){
      toast("Register as freelancer to start selling")
      return;
    }

    navigate("/createGig")
  }

  return (
    <div className="min-h-screen bg-mainBg overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-accent min-h-screen flex items-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full opacity-5 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-accent/10 to-secondary/10 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center text-white">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent leading-tight">
              Find Perfect
              <br />
              <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">Freelancers</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90 leading-relaxed">
              Connect with world-class talent and bring your ideas to life. 
              <br className="hidden md:block" />
              Quality work, delivered fast.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up delay-200">
            <button onClick={()=>{navigate("/gigs")}} className="group relative px-8 py-4 bg-white text-primary rounded-full font-semibold text-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-glow-primary">
              <span className="relative z-10">Browse Gigs</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-dark opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300"></div>
            </button>
            <button onClick={handleStartSelling} className="px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/50">
              Start Selling
            </button>
          </div>

          {/* Floating Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in-up delay-400">
            {[
              { number: "50K+", label: "Freelancers" },
              { number: "25K+", label: "Projects Done" },
              { number: "98%", label: "Success Rate" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-3xl font-bold text-accent-light">{stat.number}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="section-categories" className={`py-20 bg-white transition-all duration-1000 ${isVisible['section-categories'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Explore thousands of services across different categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <FloatingCard key={category.title} delay={index * 100}>
                <div className="group relative bg-white rounded-2xl shadow-soft hover:shadow-hard transition-all duration-500 overflow-hidden border border-neutral-200 hover:border-primary/20">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  <div className="relative p-8 text-center">
                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-800 mb-2 group-hover:text-primary transition-colors duration-300">
                      {category.title}
                    </h3>
                    <p className="text-neutral-600 mb-4">{category.count}</p>
                    <div className="inline-flex items-center text-primary font-semibold group-hover:text-secondary transition-colors duration-300">
                      Explore <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="section-how" className={`py-20 bg-gradient-to-br from-neutral-50 to-white transition-all duration-1000 ${isVisible['section-how'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-xl text-neutral-600">Simple steps to get your project done</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent"></div>
            
            {[
              {
                step: "1",
                title: "Post Your Project",
                desc: "Tell us what you need done and get free quotes from freelancers.",
                icon: "📝",
                color: "from-primary to-primary-dark"
              },
              {
                step: "2",
                title: "Choose Expert",
                desc: "Compare profiles, reviews, and proposals then interview your favorites.",
                icon: "👥",
                color: "from-secondary to-secondary-dark"
              },
              {
                step: "3",
                title: "Get Results",
                desc: "Fund the project and release payment when you're satisfied with the work.",
                icon: "🚀",
                color: "from-accent to-accent-dark"
              },
            ].map((item, index) => (
              <FloatingCard key={item.step} delay={index * 200}>
                <div className="relative bg-white p-8 rounded-2xl shadow-soft hover:shadow-hard transition-all duration-500 text-center group border border-neutral-200 hover:border-primary/20">
                  <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r ${item.color} text-white rounded-full flex items-center justify-center font-bold text-lg shadow-medium`}>
                    {item.step}
                  </div>
                  <div className="text-5xl mb-6 mt-4 transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-neutral-800 group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">{item.desc}</p>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="section-features" className={`py-20 bg-white transition-all duration-1000 ${isVisible['section-features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-neutral-600">We make freelancing simple and secure</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FloatingCard key={feature.title} delay={index * 150}>
                <div className="text-center p-6 bg-neutral-50 rounded-2xl hover:bg-white hover:shadow-medium transition-all duration-300 group border border-neutral-200 hover:border-primary/20">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-neutral-800 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600">{feature.desc}</p>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="section-testimonials" className={`py-20 bg-gradient-to-br from-primary/5 to-secondary/5 transition-all duration-1000 ${isVisible['section-testimonials'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-16">
            Success Stories
          </h2>
          
          <div className="relative bg-white rounded-3xl shadow-hard p-8 md:p-12">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-accent to-accent-dark text-white px-6 py-2 rounded-full text-sm font-semibold">
                ⭐ Verified Reviews
              </div>
            </div>
            
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`transition-all duration-500 ${index === currentTestimonial ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0'}`}
              >
                <div className="flex items-center justify-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-20 h-20 rounded-full border-4 border-primary/20"
                  />
                </div>
                <blockquote className="text-xl md:text-2xl text-neutral-700 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </blockquote>
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-accent text-2xl">★</span>
                  ))}
                </div>
                <div className="text-lg font-semibold text-primary">{testimonial.name}</div>
                <div className="text-neutral-600">{testimonial.role}</div>
              </div>
            ))}
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-primary scale-125' : 'bg-neutral-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20 bg-gradient-to-r from-primary via-secondary to-accent overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full opacity-10 blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Start?
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Join millions of people who use our platform to turn ideas into reality
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={()=>navigate("/gigs") } className="group relative px-10 py-4 bg-white text-primary rounded-full font-bold text-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-glow-primary">
              <span className="relative z-10">Get Started Free</span>
            </button>
            <button className="px-10 py-4 border-2 border-white/50 text-white rounded-full font-bold text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
              Learn More
            </button>
          </div>
          
          <div className="mt-8 text-sm opacity-75">
            ✓ No credit card required • ✓ Free to join • ✓ Start in minutes
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;