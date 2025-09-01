import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function GigCard({ gig, onClick }) {
  return (
    <Card
      onClick={onClick}
      className="hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {gig.images && gig.images.length > 0 ? (
          <img
            src={gig.images[0].url || gig.images[0]}
            alt={gig.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <span className="text-sm font-bold text-green-600">
            ${gig.price}
          </span>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">
          {gig.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {gig.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {gig.deliveryTime} day{gig.deliveryTime > 1 ? "s" : ""} delivery
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <svg
              className="w-4 h-4 fill-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>{gig.averageRating?.toFixed(1) || "0.0"}</span>
            <span className="text-gray-300">•</span>
            <span>({gig.numberOfReviews || 0})</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
