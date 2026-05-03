import React from 'react';
import { FaRegStar, FaStar } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { useQuery } from "@apollo/client";
import { FIND_REVIEW_PAGE_BY_SERVICE } from "@/graphql/queries";
import LoaderHelix from '@/components/shared/Loaders/LoaderHelix';

interface ReviewsProps {
    serviceId?: string;
}

interface ReviewItem {
    id: string;
    rating: number;
    comment?: string;
    createdAt?: string;
    visitor?: {
        visitor_fname?: string;
    };
}

  
const Reviews: React.FC<ReviewsProps> = ({ serviceId }) => {
    const { data: rdata, loading: reviewsLoading, error: reviewsError } = useQuery(FIND_REVIEW_PAGE_BY_SERVICE, {
        variables: { offering_id: serviceId, page: 1, limit: 5 },
        skip: !serviceId,
    });

    if (reviewsLoading) return <LoaderHelix />;
    if (reviewsError) return <div>Error fetching reviews</div>;

    const reviewPage = rdata?.findReviewsByOfferingPaginated;
    const latestReviews: ReviewItem[] = reviewPage?.reviews ?? [];
    const totalReviews = reviewPage?.totalReviews ?? 0;
    const avgRating = reviewPage?.averageRating ?? 0;

    const recentDistribution = [5, 4, 3, 2, 1].map((star) => {
        const count = latestReviews.filter((review) => Math.round(review.rating) === star).length;
        const percentage = latestReviews.length ? (count / latestReviews.length) * 100 : 0;
        return { star, count, percentage };
    });

    const renderStars = (avgRating: number) => {
        const fullStars = Math.floor(avgRating);
        const halfStars = avgRating % 1;
        const emptyStars = 5 - Math.ceil(avgRating);

        return (
            <>
                {/* Full stars */}
                {Array.from({ length: fullStars }, (_, index) => (
                    <FaStar key={`star-full-${index}`} />
                ))}
                {/* Half star */}
                {halfStars>0 && <FaRegStarHalfStroke />}
                {/* Empty stars */}
                {Array.from({ length: emptyStars }, (_, index) => (
                    <FaRegStar key={`star-empty-${index}`} />
                ))}
            </>
        );
    };

    return (
        <div className='font-body mt-6'>
            <div className='rounded-2xl border border-orange/15 bg-gradient-to-br from-white to-orange-50/40 p-5 md:p-6 shadow-sm'>
                <div className='flex flex-col lg:flex-row gap-8'>
                    <div className='lg:w-[280px]'>
                        <div className='text-sm uppercase tracking-wide text-gray-500'>Overall rating</div>
                        <div className='mt-2 flex items-end gap-2'>
                            <span className='text-5xl font-title font-bold text-gray-900 leading-none'>{avgRating.toFixed(1)}</span>
                            <span className='text-lg text-gray-500 pb-1'>/ 5</span>
                        </div>
                        <div className='flex flex-row text-3xl text-yellow-400 my-2 gap-1'>
                            {renderStars(avgRating)}
                        </div>
                        <div className='text-gray-700 font-medium'>
                            {totalReviews} total {totalReviews === 1 ? 'review' : 'reviews'}
                        </div>
                    </div>

                    <div className='flex-1'>
                        <div className='text-sm uppercase tracking-wide text-gray-500 mb-3'>Recent rating mix</div>
                        <div className='space-y-2'>
                            {recentDistribution.map((item) => (
                                <div key={item.star} className='flex items-center gap-3'>
                                    <div className='w-8 text-sm font-semibold text-gray-700'>{item.star}★</div>
                                    <div className='h-2.5 flex-1 rounded-full bg-gray-200 overflow-hidden'>
                                        <div
                                            className='h-full bg-orange rounded-full transition-all'
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                    <div className='w-8 text-right text-sm text-gray-600'>{item.count}</div>
                                </div>
                            ))}
                        </div>
                        <p className='mt-3 text-xs text-gray-500'>
                            Distribution shown for the latest {latestReviews.length} loaded reviews.
                        </p>
                    </div>

                    <div className='lg:w-[360px]'>
                        <div className='text-sm uppercase tracking-wide text-gray-500 mb-3'>Latest reviews</div>
                        <div className='space-y-3 max-h-[280px] overflow-auto pr-1'>
                            {latestReviews.length === 0 ? (
                                <div className='rounded-xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500'>
                                    No reviews yet. Be the first to share your experience.
                                </div>
                            ) : (
                                latestReviews.slice(0, 3).map((review) => (
                                    <div key={review.id} className='rounded-xl border border-gray-200 bg-white p-3'>
                                        <div className='flex items-center justify-between'>
                                            <div className='text-sm font-semibold text-gray-800'>
                                                {review.visitor?.visitor_fname || 'Guest'}
                                            </div>
                                            <div className='text-xs text-gray-500'>
                                                {review.createdAt
                                                    ? new Date(review.createdAt).toLocaleDateString()
                                                    : 'Recently'}
                                            </div>
                                        </div>
                                        <div className='mt-1 flex text-yellow-400 gap-1'>
                                            {Array.from({ length: 5 }, (_, index) => (
                                                index < Math.round(review.rating)
                                                    ? <FaStar key={`latest-filled-${review.id}-${index}`} size={13} />
                                                    : <FaRegStar key={`latest-empty-${review.id}-${index}`} size={13} />
                                            ))}
                                        </div>
                                        <p className='mt-2 text-sm text-gray-700 line-clamp-2'>
                                            {review.comment?.trim() || 'Shared a rating without comment.'}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reviews;
