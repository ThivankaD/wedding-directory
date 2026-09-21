"use client";

import React, { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useAuth } from "@/contexts/VisitorAuthContext";
import { FIND_ALL_REVIEWS, FIND_SERVICES } from "@/graphql/queries";
import { CREATE_REVIEW } from "@/graphql/mutations";
import { uploadReviewImages } from "@/api/upload/review/reviewImages.upload";
import Pagination from "./Pagination";

interface OfferingOption {
  id: string;
  name: string;
  vendor?: {
    busname?: string;
  };
}

interface ReviewItem {
  id: string;
  rating: number;
  comment?: string;
  image_urls?: string[]
  createdAt: string;
  visitor?: {
    visitor_fname?: string;
  };
  service?: {
    id: string;
    name?: string;
    vendor?: {
      busname?: string;
    };
  };
  offering?: {
    id: string;
    name?: string;
    vendor?: {
      busname?: string;
    };
  };
  mentionedService?: {
    id: string;
    name?: string;
    vendor?: {
      busname?: string;
    };
  };
  mentionedOffering?: {
    id: string;
    name?: string;
    vendor?: {
      busname?: string;
    };
  };
}

const BlogCommunityReviews: React.FC = () => {
  const { visitor } = useAuth();

  const { data: reviewsData, loading: reviewsLoading, refetch } = useQuery(FIND_ALL_REVIEWS, {
    fetchPolicy: "cache-and-network",
  });

  const { data: offeringsData, loading: offeringsLoading } = useQuery(FIND_SERVICES, {
    fetchPolicy: "cache-and-network",
  });

  const [createReview, { loading: creating }] = useMutation(CREATE_REVIEW);

  const [selectedOfferingId, setSelectedOfferingId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [mentionVendor, setMentionVendor] = useState(true);
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [filterVendorName, setFilterVendorName] = useState("");
  const [filterStars, setFilterStars] = useState<number | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterStars, filterVendorName]);

  const openAddReviewForm = () => {
    setShowAddReviewForm(true);

    setTimeout(() => {
      const formEl = document.getElementById("community-add-review-form");
      formEl?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  const offerings: OfferingOption[] = useMemo(
    () => (offeringsData?.findServices || offeringsData?.findOfferings || []).filter((offering: any) => offering?.visible),
    [offeringsData],
  );

  const reviews: ReviewItem[] = useMemo(
    () => reviewsData?.findAllReviews || [],
    [reviewsData],
  );

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      if (filterStars !== null && review.rating !== filterStars) {
        return false;
      }
      
      if (filterVendorName.trim() !== "") {
        const vendorName = (review.service || review.offering)?.vendor?.busname || "";
        if (!vendorName.toLowerCase().includes(filterVendorName.toLowerCase())) {
          return false;
        }
      }
      
      return true;
    });
  }, [reviews, filterStars, filterVendorName]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / itemsPerPage));
  
  const currentReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReviews, currentPage]);

  const selectedOffering = offerings.find((o) => o.id === selectedOfferingId);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!visitor?.id) {
      toast.error("Please login as a visitor to add a review.");
      return;
    }

    if (!selectedOfferingId) {
      toast.error("Please select a vendor service.");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating from 1 to 5.");
      return;
    }

    if (!comment.trim() && images.length === 0) {
      toast.error("Please add a comment or at least one image.");
      return;
    }

    if (images.length > 5) {
      toast.error("You can upload up to 5 images.");
      return;
    }

    try {
      const uploadedImageUrls = await uploadReviewImages(images);

      await createReview({
        variables: {
          input: {
            rating,
            comment,
            image_urls: uploadedImageUrls,
            service_id: selectedOfferingId,
            visitor_id: visitor.id,
            mentioned_service_id: mentionVendor ? selectedOfferingId : null,
          },
        },
      });

      toast.success("Review added successfully!");
      setSelectedOfferingId("");
      setRating(0);
      setComment("");
      setImages([]);
      setMentionVendor(true);
      setShowAddReviewForm(false);

      try {
        await refetch();
      } catch {
        console.warn("Review created, but failed to refresh review list.");
      }
    } catch (error: any) {
      const message =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        "Failed to add review. Please try again.";
      toast.error(message);
    }
  };

  return (
    <section className="mt-16 bg-white dark:bg-darkSurface border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-md p-6 md:p-8">
      <h2 className="text-3xl font-title font-bold text-gray-900 dark:text-zinc-100 mb-2">Community Vendor Reviews</h2>
      <p className="text-gray-600 dark:text-zinc-400 mb-8 font-body">See what other couples said, and add your own review with vendor mentions and photos.</p>

      <div>
        <div>
          <h3 className="text-2xl font-title font-semibold mb-4 text-gray-900 dark:text-zinc-100">All Reviews</h3>

          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center bg-gray-50 dark:bg-darkElevated p-4 rounded-lg border border-gray-200 dark:border-zinc-800">
            <div className="flex-1 w-full">
              <label htmlFor="vendor-filter" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Filter by Vendor</label>
              <input
                id="vendor-filter"
                type="text"
                placeholder="Search vendor name..."
                className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-darkSurface text-gray-900 dark:text-zinc-100 rounded-lg px-3 py-2"
                value={filterVendorName}
                onChange={(e) => setFilterVendorName(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <label htmlFor="star-filter" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Filter by Stars</label>
              <select
                id="star-filter"
                className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-darkSurface text-gray-900 dark:text-zinc-100 rounded-lg px-3 py-2"
                value={filterStars === null ? "" : filterStars.toString()}
                onChange={(e) => setFilterStars(e.target.value === "" ? null : parseInt(e.target.value))}
              >
                <option value="">All Stars</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>

          {reviewsLoading ? (
            <div className="text-gray-500 dark:text-zinc-400">Loading reviews...</div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-gray-500 dark:text-zinc-400">No reviews match your filters.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {currentReviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 dark:border-zinc-800 rounded-xl p-4 bg-white dark:bg-darkElevated shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-yellow-500">
                        {Array.from({ length: 5 }, (_, index) => (
                          index < review.rating ? <FaStar key={index} /> : <FaRegStar key={index} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-zinc-400">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-700 dark:text-zinc-300">
                      by <span className="font-semibold text-gray-900 dark:text-zinc-100">{review.visitor?.visitor_fname || "User"}</span>
                    </p>

                    {review.offering?.id && (
                      <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">
                        Reviewed service:{" "}
                        <Link href={`/services/${review.offering.id}`} className="text-orange hover:underline font-medium">
                          {review.offering.vendor?.busname || "Vendor"} - {review.offering.name || "Service"}
                        </Link>
                      </p>
                    )}

                    {review.comment && <p className="mt-3 text-gray-800 dark:text-zinc-200 whitespace-pre-wrap text-sm">{review.comment}</p>}

                    {review.mentionedOffering?.id && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
                        Mentioned:{" "}
                        <Link href={`/services/${review.mentionedOffering.id}`} className="text-orange hover:underline font-semibold">
                          @{review.mentionedOffering.vendor?.busname || review.mentionedOffering.name || "Vendor"}
                        </Link>
                      </p>
                    )}

                    {review.image_urls && review.image_urls.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {review.image_urls.map((url, idx) => (
                          <a key={`${review.id}-${idx}`} href={url} target="_blank" rel="noreferrer">
                            <img
                              src={url}
                              alt={`Review ${idx + 1}`}
                              className="w-full h-24 object-cover rounded-md border border-gray-200 dark:border-zinc-700 hover:opacity-90 transition-opacity"
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    document.getElementById("community-reviews")?.scrollIntoView({ behavior: "smooth" });
                  }}
                />
              )}
            </>
          )}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-zinc-800">
          <div id="community-add-review-form" />
          <h3 className="text-2xl font-title font-semibold mb-4 text-gray-900 dark:text-zinc-100">Add Your Review</h3>

          <div className="mb-4">
            <button
              type="button"
              onClick={openAddReviewForm}
              className="bg-orange text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm cursor-pointer"
            >
              Add Review
            </button>
            {!visitor && (
              <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2">You must be logged in as a visitor to submit a review.</p>
            )}
          </div>

          {showAddReviewForm && (
            <form onSubmit={submitReview} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-zinc-300">Choose Vendor Service</label>
                <select
                  className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-darkSurface text-gray-900 dark:text-zinc-100 rounded-lg px-3 py-2"
                  value={selectedOfferingId}
                  onChange={(e) => setSelectedOfferingId(e.target.value)}
                  disabled={creating || offeringsLoading}
                >
                  <option value="">Select a service...</option>
                  {offerings.map((offering) => (
                    <option key={offering.id} value={offering.id}>
                      {(offering.vendor?.busname || "Vendor")} - {offering.name}
                    </option>
                  ))}
                </select>
                {!offeringsLoading && offerings.length === 0 && (
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">No visible services found to review.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-zinc-300">Rating</label>
                <div className="flex gap-2 text-2xl text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="hover:scale-110 transition-transform cursor-pointer"
                      aria-label={`Rate ${star} star`}
                    >
                      {star <= rating ? <FaStar /> : <FaRegStar />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-zinc-300">Review Comment</label>
                <textarea
                  className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-darkSurface text-gray-900 dark:text-zinc-100 rounded-lg px-3 py-2 min-h-[110px]"
                  placeholder="Share your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={creating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-zinc-300">Add Images (max 5)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const selected = Array.from(e.target.files || []).slice(0, 5);
                    setImages(selected);
                  }}
                  disabled={creating}
                  className="text-sm text-gray-600 dark:text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange/10 file:text-orange hover:file:bg-orange/20 cursor-pointer"
                />
                {images.length > 0 && (
                  <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">{images.length} image(s) selected</p>
                )}
              </div>

              <label className="flex items-center gap-2 text-gray-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mentionVendor}
                  onChange={(e) => setMentionVendor(e.target.checked)}
                  disabled={creating || !selectedOffering}
                  className="accent-orange rounded"
                />
                <span className="text-sm">
                  Mention selected vendor {selectedOffering?.vendor?.busname ? `@${selectedOffering.vendor.busname}` : ""}
                </span>
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddReviewForm(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-darkElevated cursor-pointer"
                  disabled={creating}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating || !visitor}
                  className="bg-orange text-white px-5 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors cursor-pointer font-medium text-sm"
                >
                  {visitor ? (creating ? "Submitting..." : "Submit Review") : "Login to Submit"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-50">
        <button
          type="button"
          onClick={openAddReviewForm}
          className="bg-orange text-white px-5 py-3 rounded-full shadow-lg hover:bg-orange-600"
        >
          Add Review
        </button>
      </div>
    </section>
  );
};

export default BlogCommunityReviews;
