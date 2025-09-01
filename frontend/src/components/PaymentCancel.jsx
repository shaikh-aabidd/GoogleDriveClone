import React, { useEffect, useState } from 'react';
import { XCircle, ArrowLeft, MessageCircle, Heart, ShoppingCart, Clock } from 'lucide-react';

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
    destructive: "bg-red-600 text-white hover:bg-red-700"
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

// Mock gig data that was being purchased
const mockGigData = {
  id: "688c720142d7745ee4157518",
  title: "I will create a stunning, professional logo for your business",
  freelancerName: "John Designer",
  freelancerImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  packageName: "Standard",
  price: 150,
  originalPrice: 175,
  deliveryTime: 5,
  image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop",
  discount: 25,
  rating: 4.9,
  reviews: 127
};

// Alternative gigs suggestions
const mockSimilarGigs = [
  {
    id: "1",
    title: "I will design a modern minimalist logo",
    freelancer: "Sarah Wilson",
    price: 45,
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop",
    deliveryTime: 2
  },
  {
    id: "2",
    title: "I will create a complete brand identity package",
    freelancer: "Mike Chen",
    price: 120,
    rating: 5.0,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
    deliveryTime: 7
  },
  {
    id: "3",
    title: "I will design a vintage style logo",
    freelancer: "Emma Davis",
    price: 35,
    rating: 4.7,
    reviews: 73,
    image: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=300&h=200&fit=crop",
    deliveryTime: 3
  }
];

export default function CancelPage() {
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedToWishlist, setSavedToWishlist] = useState(false);

  useEffect(() => {
    // Simulate getting session data from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    setTimeout(() => {
      setSessionData(mockGigData);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleRetryPurchase = () => {
    console.log("Retry purchase for gig:", sessionData.id);
    // Navigate back to gig detail page or retry checkout
    window.history.back();
  };

  const handleGoHome = () => {
    console.log("Navigate to home page");
    // Navigate to home page
  };

  const handleBrowseGigs = () => {
    console.log("Navigate to browse gigs");
    // Navigate to gig marketplace
  };

  const handleContactSupport = () => {
    console.log("Contact support");
    // Open support chat or navigate to support page
  };

  const handleSaveToWishlist = () => {
    setSavedToWishlist(true);
    console.log("Saved to wishlist:", sessionData.id);
    // API call to save to wishlist
  };

  const handleViewSimilarGig = (gigId) => {
    console.log("View similar gig:", gigId);
    // Navigate to similar gig
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Cancel Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-lg text-gray-600">No worries! Your payment was not processed.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* What Happened */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">What happened?</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Your payment was cancelled and no charges were made to your account. 
                    This could happen for several reasons:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>You clicked the back button or closed the payment window</li>
                    <li>There was an issue with your payment method</li>
                    <li>You decided to review the order details again</li>
                    <li>Network connectivity issues occurred</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* The Gig You Were Purchasing */}
            {sessionData && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">The gig you were purchasing</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <img
                      src={sessionData.image}
                      alt={sessionData.title}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{sessionData.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={sessionData.freelancerImage}
                          alt={sessionData.freelancerName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-600">{sessionData.freelancerName}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-600">{sessionData.rating} ⭐ ({sessionData.reviews})</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-green-600">${sessionData.price}</span>
                          {sessionData.originalPrice > sessionData.price && (
                            <span className="text-sm text-gray-500 line-through">${sessionData.originalPrice}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {sessionData.deliveryTime} days
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button onClick={handleRetryPurchase} className="flex-1">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button 
                      onClick={handleSaveToWishlist} 
                      variant="outline"
                      disabled={savedToWishlist}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${savedToWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                      {savedToWishlist ? 'Saved' : 'Save for Later'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alternative Options */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">What would you like to do?</h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg hover:border-blue-300 transition-colors cursor-pointer" onClick={handleRetryPurchase}>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                      <ArrowLeft className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Go Back & Retry</h3>
                    <p className="text-sm text-gray-600">Return to the gig page and complete your purchase</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:border-blue-300 transition-colors cursor-pointer" onClick={handleBrowseGigs}>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                      <ShoppingCart className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Browse More Gigs</h3>
                    <p className="text-sm text-gray-600">Explore other services that might interest you</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:border-blue-300 transition-colors cursor-pointer" onClick={handleContactSupport}>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                      <MessageCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Get Help</h3>
                    <p className="text-sm text-gray-600">Contact our support team if you need assistance</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:border-blue-300 transition-colors cursor-pointer" onClick={handleGoHome}>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                      <ArrowLeft className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Go Home</h3>
                    <p className="text-sm text-gray-600">Return to the homepage and start fresh</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleRetryPurchase} className="w-full" size="lg">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Retry Purchase
                </Button>
                
                <Button onClick={handleBrowseGigs} variant="outline" className="w-full">
                  Browse Similar Gigs
                </Button>
                
                <Button onClick={handleContactSupport} variant="ghost" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            {/* Similar Gigs */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">You might also like</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockSimilarGigs.map((gig) => (
                  <div 
                    key={gig.id}
                    className="flex gap-3 p-3 border rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => handleViewSimilarGig(gig.id)}
                  >
                    <img
                      src={gig.image}
                      alt={gig.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">{gig.title}</h4>
                      <p className="text-xs text-gray-600 mb-1">{gig.freelancer}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-green-600">${gig.price}</span>
                        <span className="text-xs text-gray-500">{gig.rating} ⭐</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Security */}
            <Card className="bg-gray-50">
              <CardContent className="text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Secure Payments</h3>
                <p className="text-sm text-gray-600">
                  Your payment information is always protected with bank-level security.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}