"use client";
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { FiImage, FiX } from 'react-icons/fi';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_REVIEW } from '@/graphql/mutations';
import { CHECK_REVIEW_ELIGIBILITY, FIND_REVIEW_PAGE_BY_SERVICE } from '@/graphql/queries';
import { useAuth } from '@/contexts/VisitorAuthContext';
import toast from 'react-hot-toast';
import { uploadReviewImages } from '@/api/upload/review/reviewImages.upload';

interface WriteReviewProps {
    serviceId?: string;
    vendorName?: string;
}

const MAX_REVIEW_IMAGES = 3;

const WriteReview: React.FC<WriteReviewProps> = ({ serviceId, vendorName }) => {
    const { visitor } = useAuth();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [mentionVendor, setMentionVendor] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const { data: eligibilityData, loading: eligibilityLoading, refetch: refetchEligibility } = useQuery(
        CHECK_REVIEW_ELIGIBILITY,
        {
            variables: {
                offering_id: serviceId || "",
                visitor_id: visitor?.id || "",
            },
            skip: !serviceId || !visitor?.id,
            fetchPolicy: 'network-only',
        }
    );

    const eligibility = eligibilityData?.checkReviewEligibility;

    const [createReview, { loading }] = useMutation(CREATE_REVIEW, {
        refetchQueries: [
            {
                query: FIND_REVIEW_PAGE_BY_SERVICE,
                variables: { offering_id: serviceId, page: 1, limit: 5 },
            },
            ...(serviceId && visitor?.id
                ? [
                      {
                          query: CHECK_REVIEW_ELIGIBILITY,
                          variables: { offering_id: serviceId, visitor_id: visitor.id },
                      },
                  ]
                : []),
        ],
        awaitRefetchQueries: true,
    });

    const activeRating = hoverRating || rating;

    const handleWriteReviewClick = () => {
        if (!visitor) {
            toast.error("You must be logged in to write a review", {
                duration: 3000,
                position: 'top-center',
            });
            return;
        }

        if (eligibility && !eligibility.canReview) {
            toast.error(eligibility.message || "You are not eligible to review this service yet.");
            return;
        }

        setShowForm((prev) => !prev);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length + images.length > MAX_REVIEW_IMAGES) {
            toast.error(`You can upload a maximum of ${MAX_REVIEW_IMAGES} images.`);
        }
        const remainingSlots = Math.max(0, MAX_REVIEW_IMAGES - images.length);
        const filesToAdd = selectedFiles.slice(0, remainingSlots);
        setImages((prev) => [...prev, ...filesToAdd]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!serviceId) {
            toast.error("Service not found.");
            return;
        }

        if (rating === 0) {
            toast("Please select a rating before submitting!");
            return;
        }

        if (!comment.trim() && images.length === 0) {
            toast("Please add a review comment or at least one image.");
            return;
        }

        if (images.length > MAX_REVIEW_IMAGES) {
            toast.error(`You can upload up to ${MAX_REVIEW_IMAGES} images.`);
            return;
        }

        try {
            const uploadedImageUrls = await uploadReviewImages(images);

            const response = await createReview({
                variables: {
                    input: {
                        rating,
                        comment,
                        image_urls: uploadedImageUrls,
                        mentioned_offering_id: mentionVendor ? serviceId : null,
                        offering_id: serviceId,
                        visitor_id: visitor?.id,
                    },
                },
            });

            if (response.data) {
                setRating(0);
                setComment("");
                setImages([]);
                setMentionVendor(true);
                setShowForm(false);
                await refetchEligibility();
                toast.success("Review submitted successfully!");
            }
        } catch (error: any) {
            const errorMessage = error?.graphQLErrors?.[0]?.message || error?.message || "Failed to submit review. Please try again.";
            toast.error(errorMessage);
        }
    };

    // Format pending event date if applicable
    const bookingDateFormatted = eligibility?.bookingDate
        ? new Date(eligibility.bookingDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          })
        : null;

    return (
        <div className='font-body mt-4'>
            <div className='rounded-2xl border border-orange/20 bg-white p-4 md:p-5 shadow-sm space-y-4'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
                    <div>
                        <h3 className='text-xl font-title font-bold text-gray-900'>Share your experience</h3>
                        <p className='text-sm text-gray-600'>
                            Your review helps couples choose the right vendor service.
                        </p>
                    </div>

                    {visitor ? (
                        eligibility?.reason === 'ALREADY_REVIEWED' ? (
                            <span className='inline-flex items-center justify-center px-4 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-semibold border border-green-200'>
                                ✓ Already Reviewed
                            </span>
                        ) : (
                            <Button
                                onClick={handleWriteReviewClick}
                                disabled={eligibility && !eligibility.canReview}
                                className={`w-full md:w-44 font-bold ${
                                    eligibility && !eligibility.canReview
                                        ? 'opacity-60 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200'
                                        : 'hover:border-orange hover:text-orange hover:bg-orange/15'
                                }`}
                                variant="ornageOutline"
                            >
                                {showForm ? "Close Form" : "Write a Review"}
                            </Button>
                        )
                    ) : (
                        <Button
                            onClick={handleWriteReviewClick}
                            className='w-full md:w-44 font-bold hover:border-orange hover:text-orange hover:bg-orange/15'
                            variant="ornageOutline"
                        >
                            Write a Review
                        </Button>
                    )}
                </div>

                {/* Eligibility status notices */}
                {!visitor && (
                    <div className='rounded-xl bg-gray-50 border border-gray-200 p-3 text-sm text-gray-600 flex items-center gap-2'>
                        <span>ℹ️</span>
                        <span>Log in as a couple to review this service. Only verified bookings can be reviewed.</span>
                    </div>
                )}

                {visitor && !eligibilityLoading && eligibility && (
                    <>
                        {eligibility.reason === 'ALREADY_REVIEWED' && (
                            <div className='rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800 flex items-center gap-2'>
                                <span className='text-base'>✓</span>
                                <span>You have already reviewed this service. Thank you for sharing your experience!</span>
                            </div>
                        )}

                        {eligibility.reason === 'NOT_BOOKED' && (
                            <div className='rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800 flex items-center gap-2'>
                                <span className='text-base'>🔒</span>
                                <span>Only couples who have booked a package for this service can leave a review.</span>
                            </div>
                        )}

                        {eligibility.reason === 'EVENT_PENDING' && (
                            <div className='rounded-xl bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800 flex items-center gap-2'>
                                <span className='text-base'>📅</span>
                                <span>
                                    {bookingDateFormatted
                                        ? `You booked this service for ${bookingDateFormatted}. You can leave a review once your event date has passed.`
                                        : "You can leave a review once your booked event date has passed."}
                                </span>
                            </div>
                        )}
                    </>
                )}

                {/* Form - only rendered when user is logged in, eligible, and has opened the form */}
                {visitor && eligibility?.canReview && showForm && (
                    <form onSubmit={handleSubmit} className='border-t border-gray-200 pt-5 space-y-5'>
                        <div>
                            <h4 className='text-lg font-semibold text-gray-900'>Rate this service</h4>
                            <div className='mt-2 flex items-center gap-3'>
                                <div className='flex items-center gap-1'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                            className='transition-transform hover:scale-110'
                                            aria-label={`${star} star`}
                                        >
                                            <FaStar
                                                size={26}
                                                color={star <= activeRating ? '#f59e0b' : '#d1d5db'}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <span className='text-sm font-medium text-gray-700'>
                                    {rating > 0 ? `${rating} / 5` : 'Select a rating'}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="review-comment" className='block text-sm font-semibold text-gray-800'>
                                Your review
                            </label>
                            <textarea
                                className='mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 min-h-[130px] outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange'
                                id="review-comment"
                                name="content"
                                placeholder="What stood out? Communication, quality, value, or overall experience..."
                                rows={5}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                disabled={loading}
                            />
                            <div className='mt-1 text-xs text-gray-500'>
                                {comment.trim().length} characters
                            </div>
                        </div>

                        <div>
                            <label className='block text-sm font-semibold text-gray-800 mb-2'>
                                Add photos (up to {MAX_REVIEW_IMAGES})
                            </label>
                            {images.length < MAX_REVIEW_IMAGES && (
                                <label className='flex items-center gap-2 w-fit rounded-lg border border-dashed border-gray-400 px-3 py-2 cursor-pointer hover:border-orange hover:bg-orange/5 transition-colors'>
                                    <FiImage size={16} />
                                    <span className='text-sm'>Upload Images</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className='hidden'
                                        onChange={handleFileChange}
                                        disabled={loading}
                                    />
                                </label>
                            )}

                            {images.length > 0 && (
                                <div className='mt-3 flex flex-wrap gap-2'>
                                    {images.map((file, index) => (
                                        <div
                                            key={`${file.name}-${index}`}
                                            className='flex items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs'
                                        >
                                            <span className='max-w-[160px] truncate'>{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                                                className='text-gray-500 hover:text-red-500'
                                                aria-label={`Remove ${file.name}`}
                                            >
                                                <FiX size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className='flex items-center gap-2 cursor-pointer w-fit'>
                                <input
                                    type="checkbox"
                                    checked={mentionVendor}
                                    onChange={(e) => setMentionVendor(e.target.checked)}
                                    disabled={loading}
                                />
                                <span className='text-sm'>
                                    Mention vendor {vendorName ? `@${vendorName}` : ''}
                                </span>
                            </label>
                        </div>

                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                            <Button
                                className='w-32 font-bold hover:border-orange hover:text-orange hover:bg-orange/15'
                                variant="ornageOutline"
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </Button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className='text-sm text-gray-600 hover:text-gray-900'
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default WriteReview;
