import React, { useEffect, useState } from 'react';
import { CheckCircle, Download, MessageCircle, Star, Clock, ArrowRight } from 'lucide-react';

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="p-6 pb-4">{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, className = "", variant = "default", size = "default" }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-600 hover:bg-gray-100",
    success: "bg-green-600 text-white hover:bg-green-700"
  };
  
  const sizes = {
    default: "px-4 py-2",
    sm: "px-3 py-1.5 text-sm",
    lg: "px-6 py-3 text-lg"
  };
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

// Mock order data - replace with actual API call
const mockOrderData = {
  id: "order_1234567890",
  gigTitle: "I will create a stunning, professional logo for your business",
  freelancerName: "John Designer",
  freelancerImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  packageName: "Standard",
  amount: 175,
  currency: "USD",
  deliveryTime: 5,
  status: "confirmed",
  estimatedDelivery: "2025-08-08",
  extras: [
    { name: "Express Delivery", price: 25 },
    { name: "Source Files", price: 50 }
  ],
  requirements: [
    "What is your business name?",
    "Do you have any color preferences?",
    "What style do you prefer? (modern, classic, minimalist, etc.)"
  ]
};

export default function SuccessPage() {
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confettiVisible, setConfettiVisible] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch order details
    // In real implementation, get session_id from URL params and fetch order
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    setTimeout(() => {
      setOrderData(mockOrderData);
      setIsLoading(false);
    }, 1000);

    // Hide confetti after animation
    const timer = setTimeout(() => {
      setConfettiVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleContactFreelancer = () => {
    console.log("Navigate to messages with freelancer");
    // Navigate to messaging system
  };

  const handleViewOrder = () => {
    console.log("Navigate to order details");
    // Navigate to order management page
  };

  const handleDownloadReceipt = () => {
    console.log("Download receipt");
    // Generate and download receipt
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Confetti Animation */}
      {confettiVisible && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div className={`w-2 h-2 ${
                ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'][Math.floor(Math.random() * 5)]
              } rounded-full`}></div>
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600">Your order has been confirmed and the freelancer has been notified.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Order Confirmed
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono text-sm">{orderData.id}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{orderData.gigTitle}</h3>
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={orderData.freelancerImage}
                        alt={orderData.freelancerName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{orderData.freelancerName}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">4.9 (127 reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{orderData.packageName} Package</span>
                      <span className="font-semibold">${orderData.amount - orderData.extras.reduce((sum, extra) => sum + extra.price, 0)}</span>
                    </div>
                    
                    {orderData.extras.map((extra, index) => (
                      <div key={index} className="flex justify-between items-center mb-2 text-sm">
                        <span className="text-gray-600">+ {extra.name}</span>
                        <span className="text-gray-600">${extra.price}</span>
                      </div>
                    ))}
                    
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center font-semibold text-lg">
                        <span>Total Paid</span>
                        <span className="text-green-600">${orderData.amount} {orderData.currency}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">What happens next?</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">1</div>
                    <div>
                      <h4 className="font-medium">Freelancer Notification</h4>
                      <p className="text-sm text-gray-600">The freelancer has been notified and will start working on your project.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">2</div>
                    <div>
                      <h4 className="font-medium">Project Requirements</h4>
                      <p className="text-sm text-gray-600">You'll receive a message requesting project details and requirements.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">3</div>
                    <div>
                      <h4 className="font-medium">Work in Progress</h4>
                      <p className="text-sm text-gray-600">Track progress and communicate with your freelancer through our platform.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">4</div>
                    <div>
                      <h4 className="font-medium">Delivery & Review</h4>
                      <p className="text-sm text-gray-600">Receive your completed work and leave a review for the freelancer.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            {/* Delivery Info */}
            <Card>
              <CardContent className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Expected Delivery</h3>
                  <p className="text-2xl font-bold text-blue-600">{orderData.deliveryTime} days</p>
                  <p className="text-sm text-gray-600">By {orderData.estimatedDelivery}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleContactFreelancer}
                  className="w-full"
                  variant="default"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Freelancer
                </Button>
                
                <Button 
                  onClick={handleViewOrder}
                  className="w-full"
                  variant="outline"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View Order Details
                </Button>
                
                <Button 
                  onClick={handleDownloadReceipt}
                  className="w-full"
                  variant="ghost"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="bg-gray-50">
              <CardContent className="text-center space-y-3">
                <h3 className="font-semibold">Need Help?</h3>
                <p className="text-sm text-gray-600">
                  Our support team is available 24/7 to assist you with any questions.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}