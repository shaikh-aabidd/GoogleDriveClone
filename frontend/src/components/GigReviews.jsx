// src/components/GigReviews.jsx
import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetReviewsByGigQuery,
  useCreateReviewMutation,
} from "@/features/api/review.api";
import { useGetAllOrdersQuery } from "@/features/api/order.api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function GigReviews({ gigId }) {
  // Auth state
  const { user } = useSelector((s) => s.auth);
  const currentUserId = user?._id;

  // 1️⃣ Load reviews (public)
const {
  data: reviews =[],
  isLoading: loadingReviews,
  isSuccess: reviewsFetched
} = useGetReviewsByGigQuery(gigId);

// const reviews = reviewsResponse?.data || [];
// console.log(reviewsResponse)

  // 2️⃣ If logged in, load your orders
  const { data: ordersResp = {}, isLoading: loadingOrders } =
    useGetAllOrdersQuery(undefined, {
      skip: !currentUserId,
    });
  const myOrders = ordersResp.data?.docs || [];

  // 3️⃣ Determine eligibility
  const hasCompletedOrder = currentUserId
    ? myOrders.some((o) => o.gig._id === gigId && o.status === "Completed")
    : false;

  const hasReviewed = Boolean(
  currentUserId &&  
  reviews.some((r) => r.user._id === currentUserId)
);

  // 4️⃣ Mutation
  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();

  // 5️⃣ Local form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    try {
      const resp = await createReview({ gigId, rating, comment }).unwrap();
      if(resp){
        toast.success("Review has been submitted")
      }
      setComment("");
      setRating(5);
    } catch (err) {
        toast.error(err?.data?.message)
      console.error(err);
    }
  };
  if(!user) return;
  if (loadingReviews || !reviewsFetched) return <p>Loading reviews…</p>;


  return (
    <div className="space-y-6">
      
      {/* Review Form / Messages */}
      {!currentUserId && (
        <p className="text-blue-600">
          <Link
            to="/login"
            state={{ from: location.pathname + location.search }}
            className="underline"
          >
            Log in
          </Link>{" "}
          to leave a review.
        </p>
      )}

      {currentUserId && loadingOrders && <p>Checking order status…</p>}

      {currentUserId && !loadingOrders && !hasCompletedOrder && (
        <p className="text-yellow-600">
          You can only leave a review once your order is delivered.
        </p>
      )}

      {currentUserId && hasCompletedOrder && hasReviewed && (
        <p className="text-green-600">
          Thank you—you’ve already reviewed this gig.
        </p>
      )}

      {currentUserId && hasCompletedOrder && !hasReviewed && (
        <div className="pt-6 border-t space-y-4">
          <h4 className="text-lg font-medium">Leave a Review</h4>

          <div className="flex items-center space-x-2">
            <label htmlFor="rating" className="font-medium">
              Rating:
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(+e.target.value)}
              className="border rounded px-2 py-1"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} ★
                </option>
              ))}
            </select>
          </div>

          <Textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !comment.trim()}
          >
            {isSubmitting ? "Submitting…" : "Submit Review"}
          </Button>
        </div>
      )}
    </div>
  );
}
