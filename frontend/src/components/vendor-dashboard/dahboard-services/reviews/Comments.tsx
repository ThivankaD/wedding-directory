'use client';
import { FaRegStar, FaStar } from "react-icons/fa";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { FIND_REVIEW_BY_SERVICE } from "@/graphql/queries";
import { Button } from "@/components/ui/button";
import LoaderHelix from "@/components/shared/Loaders/LoaderHelix";
import Link from "next/link";

interface CommentsProps {
  serviceId: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  image_urls?: string[];
  createdAt: string;
  mentionedOffering?: {
    id: string;
    vendor?: {
      busname?: string;
    };
    name?: string;
  };
  visitor: {
    visitor_fname: string;
  };
}

const Comments: React.FC<CommentsProps> = ({ serviceId }) => {
  const { data: rdata, loading: reviewsLoading, error: reviewsError } = useQuery(FIND_REVIEW_BY_SERVICE, {
    variables: { offering_id: serviceId },
    skip: !serviceId,
  });

  const [showAll, setShowAll] = useState(false);

  if (reviewsLoading) return <LoaderHelix />;
  if (reviewsError) return <div>Error fetching reviews: {reviewsError.message}</div>;

  const reviewData = rdata?.findReviewsByOffering || [];
  const displayedReviews = showAll ? reviewData : reviewData.slice(0, 3);

  return (
    <div className="font-body" role="list" aria-live="polite">
      {displayedReviews.map((review: Review) => (
        <div key={review.id} role="listitem" className="ml-2 mb-4">
          <hr className="border-t border-gray-300 my-4" />
          <div className="flex flex-row text-xl text-yellow-400 my-2 items-center">
            {/* Render star ratings */}
            {[...Array(5)].map((_, index) =>
              index < review.rating ? (
                <FaStar key={`${review.id}-${index}`} />
              ) : (
                <FaRegStar key={`${review.id}-${index}`} />
              )
            )}
            {/* Visitor name and date */}
            <div className="flex items-center ml-2">
              <span className="text-black text-lg">{review.visitor?.visitor_fname ?? "User"}</span>
              <span className="text-sm text-gray-500 ml-2">
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          {/* Review comment */}
          <div className="whitespace-pre-wrap">{review.comment}</div>

          {review.mentionedOffering?.id && (
            <div className="mt-2 text-sm">
              Mentioned:
              <Link
                href={`/services/${review.mentionedOffering.id}`}
                className="ml-2 text-orange hover:underline font-semibold"
              >
                @{review.mentionedOffering.vendor?.busname || review.mentionedOffering.name || "Vendor"}
              </Link>
            </div>
          )}

          {review.image_urls && review.image_urls.length > 0 && (
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 max-w-2xl">
              {review.image_urls.map((url, index) => (
                <a
                  key={`${review.id}-img-${index}`}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <img
                    src={url}
                    alt={`Review image ${index + 1}`}
                    className="w-full h-28 object-cover rounded-md border border-gray-200"
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      ))}

      {reviewData.length > 3 && (
        <div className="mt-4">
          <Button
            onClick={() => setShowAll((prev) => !prev)}
            className='w-28 mx-2 font-bold hover:border-orange hover:text-orange hover:bg-orange/15'
            variant="ornageOutline">
            {showAll ? "Show Less" : "Show More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Comments;
