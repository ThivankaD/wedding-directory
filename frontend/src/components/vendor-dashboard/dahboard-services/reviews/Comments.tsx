'use client';
import { FaRegStar, FaStar } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { FIND_REVIEW_PAGE_BY_SERVICE } from "@/graphql/queries";
import { Button } from "@/components/ui/button";
import LoaderHelix from "@/components/shared/Loaders/LoaderHelix";
import Link from "next/link";

interface CommentsProps {
  serviceId?: string;
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

const REVIEWS_PER_PAGE = 5;

const Comments: React.FC<CommentsProps> = ({ serviceId }) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [serviceId]);

  const { data: rdata, loading: reviewsLoading, error: reviewsError } = useQuery(FIND_REVIEW_PAGE_BY_SERVICE, {
    variables: { offering_id: serviceId, page, limit: REVIEWS_PER_PAGE },
    skip: !serviceId,
  });

  useEffect(() => {
    const reviewPage = rdata?.findReviewsByOfferingPaginated;
    const totalPages = reviewPage?.totalPages ?? 1;
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, rdata]);

  if (reviewsLoading) return <LoaderHelix />;
  if (reviewsError) return <div>Error fetching reviews: {reviewsError.message}</div>;

  const reviewPage = rdata?.findReviewsByOfferingPaginated;
  const reviewData = reviewPage?.reviews || [];
  const totalReviews = reviewPage?.totalReviews ?? 0;
  const totalPages = reviewPage?.totalPages ?? 1;
  const currentPage = reviewPage?.currentPage ?? 1;

  return (
    <div className="font-body" role="list" aria-live="polite">
      <p className="text-sm text-gray-600 mb-3">Newest reviews first</p>

      {reviewData.map((review: Review) => (
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

      {reviewData.length === 0 && (
        <div className="text-gray-500 ml-2">No reviews yet for this service.</div>
      )}

      {totalReviews > REVIEWS_PER_PAGE && (
        <div className="mt-6 flex items-center gap-3 ml-2">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage <= 1}
            className='w-28 mx-2 font-bold hover:border-orange hover:text-orange hover:bg-orange/15'
            variant="ornageOutline">
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className='w-28 mx-2 font-bold hover:border-orange hover:text-orange hover:bg-orange/15'
            variant="ornageOutline">
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Comments;
