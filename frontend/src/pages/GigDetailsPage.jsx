import React, { useEffect, useState } from "react";
import { Star, Clock, Check, Plus } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetGigByIdQuery } from "@/features/api/gig.api";
import { useCreateCheckoutSessionMutation } from "@/features/api/paymentSlice";
import { useSelector } from "react-redux";
import { GigReviews } from "@/components";
import { useGetReviewsByGigQuery } from "@/features/api/review.api";
import { useSendMessageMutation } from "@/features/api/message.api";
import { toast } from "sonner";

// UI Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="p-6 pb-4">{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const Tabs = ({ children, defaultValue, className = "" }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <div className={`space-y-4 ${className}`} data-active-tab={activeTab}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

const TabsList = ({ children, activeTab, setActiveTab }) => (
  <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
    {React.Children.map(children, child =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);

const TabsTrigger = ({ children, value, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      activeTab === value
        ? 'bg-white text-gray-900 shadow-sm'
        : 'text-gray-600 hover:text-gray-900'
    }`}
  >
    {children}
  </button>
);

const TabsContent = ({ children, value, activeTab }) => (
  activeTab === value ? <div>{children}</div> : null
);

const Button = ({ children, onClick, className = "", variant = "default" }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50"
  };
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Avatar = ({ children }) => (
  <div className="relative inline-block">{children}</div>
);

const AvatarImage = ({ src, alt, className = "" }) => (
  <img
    src={src}
    alt={alt}
    className={`w-12 h-12 rounded-full object-cover ${className}`}
  />
);

const AvatarFallback = ({ children }) => (
  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
    {children}
  </div>
);

const RadioGroup = ({ children, value, onValueChange, className = "" }) => {
  const cloneChildren = (nodes) => {
    return React.Children.map(nodes, (node) => {
      if (!React.isValidElement(node)) return node;
      // If this is our RadioGroupItem, attach the handlers:
      if (node.type === RadioGroupItem) {
        return React.cloneElement(node, {
          selectedValue: value,
          onValueChange,
        });
      }
      // Otherwise, recurse into its children:
      return React.cloneElement(
        node,
        {},
        cloneChildren(node.props.children)
      );
    });
  };
  return <div className={`space-y-2 ${className}`}>{cloneChildren(children)}</div>;
};

const RadioGroupItem = ({ value, id, selectedValue, onValueChange }) => (
  <input
    type="radio"
    id={id}
    name="package"
    value={value}
    checked={selectedValue === value}
    onChange={() => onValueChange(value)}
    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
  />
);
// src/components/ui/input.jsx


export const Input = ({
  placeholder,
  className = "",
  value,
  onChange,
  ...rest        // any other props (e.g. type, name, etc.)
}) => (
  <input
    {...rest}
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`
      w-full px-3 py-2 border border-gray-300 rounded-md
      focus:outline-none focus:ring-2 focus:ring-blue-500
      focus:border-blue-500
      ${className}
    `}
  />
);


export default function GigDetailPage() {
  const { id: gigId } = useParams();
  const location      = useLocation();
  const navigate      = useNavigate();

  // 1️⃣ Data fetching hooks
  const {
    data: res,
    isLoading,
    isError,
    error
  } = useGetGigByIdQuery(gigId);

  const [
    createCheckoutSession,
    {
      isLoading: isCreating,
      isSuccess,
      isError: isErrorInCreateCheckoutSession,
      error: checkOutSessionError
    }
  ] = useCreateCheckoutSessionMutation();

  const {
    data: reviews,
    isLoading: loadingReviews,
    isSuccess: reviewsFetched
  } = useGetReviewsByGigQuery(gigId);

  const [sendMessage] = useSendMessageMutation();
  

  const { isAuthenticated } = useSelector((s) => s.auth);

  // 2️⃣ UI state hooks
  const [selectedPkg, setSelectedPkg]       = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [requirementText, setRequirementText] = useState("");
  const [message,setMessage] = useState("");



  // 3️⃣ Derive gig, default package, etc.
  const gig = res?.data;
  const defaultPkg = gig?.packages?.[0]?._id;
  const pkgId      = selectedPkg || defaultPkg;
  const pkg        = gig?.packages?.find((p) => p._id === pkgId);



  // 4️⃣ Sync default package once gig loads
  useEffect(() => {
    if (gig?.packages?.length) {
      setSelectedPkg(gig.packages[0]._id);
    }
  }, [gig]);

  // --- now that *all* hooks are declared, do early returns ---

  if (isLoading) {
    return <p>Loading gig...</p>;
  }
  if (isError) {
    return <p className="text-red-600">Error loading gig: {error?.message}</p>;
  }

  // 5️⃣ Handlers
  const handleExtraToggle = (extraId) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId)
        ? prev.filter((id) => id !== extraId)
        : [...prev, extraId]
    );
  };

  const calculateTotal = () => {
    const packagePrice = pkg?.price || 0;
    const extrasPrice  = selectedExtras.reduce((sum, id) => {
      const ex = gig.extras.find((e) => e._id === id);
      return sum + (ex?.price || 0);
    }, 0);
    return packagePrice + extrasPrice;
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: location.pathname + location.search },
      });
      return;
    }
    console.log("requirements in GigDetailsPage ",requirementText);

    try {
      const { url } = await createCheckoutSession({
        gigId,
        packageId: pkgId,
        selectedExtras,
        requirements:requirementText,
        successUrl: `${window.location.origin}/success`,
        cancelUrl:  `${window.location.origin}/cancel`,
      }).unwrap();

      window.location.href = url;
    } catch (err) {
      console.error("Error creating checkout session:", err);
    }
  };

  const handleSendMessage = async ()=>{
     if (!isAuthenticated) {
      navigate("/login", {
        state: { from: location.pathname + location.search },
      });
      return;
    }

    console.log("Messge ",message)
    if (!message.trim() ) return;
    
    const payload = {
      receiverId: gig.freelancer,
      content:message,
    };
    console.log(payload)
    try {
      const resp = await sendMessage(payload).unwrap();
      toast.success("Message has been send!");
    } catch (error) {
      console.log(error);
      toast.error("Error while sending message!!")
    }finally{
      setMessage("");
    }

  }


  return (
    <div className="max-w-7xl mx-auto py-8 px-4 grid lg:grid-cols-3 gap-8">
      {/* Left column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Title and Category */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {gig.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            <div className="flex items-center gap-1">
              {gig.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">{gig.title}</h1>
        </div>

        {/* Image carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gig.images.map((img, i) => (
            <img
              key={img._id}
              src={img.url}
              alt={`${gig.title} ${i + 1}`}
              className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
            />
          ))}
        </div>

        {/* Tabs: About / Reviews */}
        <Tabs defaultValue="about" className="space-y-4">
          <TabsList>
            <TabsTrigger value="about">About This Gig</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({gig.numberOfReviews})</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card>
              <CardContent className="space-y-4 pt-7">
               <GigReviews gigId={gigId} />

                <div>
                  <h4 className="font-semibold text-lg mb-3">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{gig.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-3">About the Freelancer</h4>
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={gig.freelancer.profileImage} alt={gig.freelancer.name} />
                      {/* <AvatarFallback>{gig.freelancer.name}</AvatarFallback> */}
                    </Avatar>
                    <div>
                      <h5 className="font-medium text-lg">{gig.freelancer.name}</h5>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-sm font-medium">{gig.averageRating}</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-600">{gig.numberOfReviews} reviews</span>
                      </div>
                      <p className="text-gray-600">{gig.freelancer.about}</p>
                    </div>
                  </div>
                </div>

                {gig.requirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3">Requirements</h4>
                    <ul className="space-y-2">
                      {gig.requirements.map((req) => (
                        <li key={req._id} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span className="text-gray-700">{req.question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              {reviews?.map((r) => (
                <Card key={r._id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-base">{r.user.name}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < r.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm font-medium">{r.rating}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{r.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>


      {/* Right column */}
      <aside className="space-y-6">
        {/* Freelancer info */}
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={gig.freelancer.profileImage} alt={gig.freelancer.name} />
              {/* <AvatarFallback>{gig.freelancer.name}</AvatarFallback> */}
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{gig.freelancer.name}</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{gig.averageRating}</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-600">({gig.numberOfReviews} reviews)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Package selector */}
        <Card className="p-4 space-y-4">
          <h4 className="font-semibold text-lg">Select a Package</h4>
          <RadioGroup
            value={pkgId}
            onValueChange={(v) => setSelectedPkg(v)}
            className="space-y-4"
          >
            {gig.packages.map((p) => (
              <div key={p._id} className={`border rounded-lg p-4 transition-colors ${
                pkgId === p._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={p._id} id={p._id} />
                    <label htmlFor={p._id} className="font-medium text-lg">{p.name}</label>
                  </div>
                  <span className="font-bold text-lg text-green-600">${p.price}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{p.description}</p>
                <div className="space-y-1">
                  {p.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{p.deliveryTime} day delivery</span>
                </div>
              </div>
            ))}
          </RadioGroup>
        </Card>

        {/* Extras */}
        {gig.extras.length > 0 && (
          <Card className="p-4 space-y-4">
            <h4 className="font-semibold text-lg">Add Extras</h4>
            <div className="space-y-3">
              {gig.extras.map((extra) => (
                <div key={extra._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={extra._id}
                      checked={selectedExtras.includes(extra._id)}
                      onChange={() => handleExtraToggle(extra._id)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div>
                      <label htmlFor={extra._id} className="font-medium text-sm">
                        {extra.name}
                      </label>
                      <p className="text-xs text-gray-600">{extra.description}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-green-600">+${extra.price}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Purchase Card */}
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Total:</span>
            <span className="font-bold text-2xl text-green-600">${calculateTotal()}</span>
          </div>
          <Button
            onClick={handlePurchase}
            className="w-full py-3 text-lg font-semibold"
          >
            Purchase (${calculateTotal()})
          </Button>
        </Card>

        {/* Custom Requirements textarea */}
        <Card className="p-4 space-y-2">
          <h4 className="font-medium">Additional Requirements</h4>
          <textarea
            value={requirementText}
            onChange={(e) => setRequirementText(e.target.value)}
            placeholder="Enter any special instructions or details…"
            className="w-full h-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Card>

        {/* Requirements input */}
        <Card className="p-4 space-y-4">
          <h4 className="font-medium">Contact Seller</h4>
          <Input
            placeholder="Send a message to the seller..."
            value={message}
            onChange={(e) => {
              console.log(e.target.value);
              setMessage(e.target.value);
            }}
      />
          <Button variant="outline" className="w-full" 
          onClick={handleSendMessage}>
            Send Message
          </Button>
        </Card>
      </aside>
    </div>
  );
}