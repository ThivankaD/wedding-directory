import React from 'react';
import { FaRegStar, FaStar } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { useQuery } from "@apollo/client";
import { FIND_REVIEW_PAGE_BY_SERVICE } from "@/graphql/queries";
import LoaderHelix from '@/components/shared/Loaders/LoaderHelix';

interface ReviewsProps {
    serviceId?: string;
}

  
const Reviews: React.FC<ReviewsProps> = ({ serviceId }) => {
    const { data: rdata, loading: reviewsLoading, error: reviewsError } = useQuery(FIND_REVIEW_PAGE_BY_SERVICE, {
        variables: { offering_id: serviceId, page: 1, limit: 5 },
        skip: !serviceId,
    });

    if (reviewsLoading) return <LoaderHelix />;
    if (reviewsError) return <div>Error fetching reviews</div>;

    const reviewPage = rdata?.findReviewsByOfferingPaginated;
    const totalReviews = reviewPage?.totalReviews ?? 0;
    const avgRating = reviewPage?.averageRating ?? 0;

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
        <div className='font-body'>
            <div className='flex flex-col md:flex-row w-full font-body gap-6'>
                <div className='flex flex-col font-body text-xl ml-4 mt-6'>
                    <div className='text-2xl font-semibold'>
                        ⭐ {avgRating.toFixed(1)} / 5
                    </div>
                    <div className='flex flex-row text-3xl text-yellow-400 my-2 gap-1'>
                        {renderStars(avgRating)}
                    </div>
                    <div className='text-xl text-gray-700'>
                        {totalReviews} Reviews
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reviews;
