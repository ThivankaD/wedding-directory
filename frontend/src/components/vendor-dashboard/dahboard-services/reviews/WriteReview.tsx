"use client";
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { FiImage, FiX } from 'react-icons/fi';
import { useMutation } from '@apollo/client';
import { CREATE_REVIEW } from '@/graphql/mutations';
import { FIND_REVIEW_PAGE_BY_SERVICE } from '@/graphql/queries';
import { useAuth } from '@/contexts/VisitorAuthContext';
import toast from 'react-hot-toast';
import { uploadReviewImages } from '@/api/upload/review/reviewImages.upload';

interface WriteReviewProps {
    serviceId?: string;
    vendorName?: string;
}

const WriteReview: React.FC<WriteReviewProps> = ({ serviceId, vendorName }) => {
    const { visitor } = useAuth();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [mentionVendor, setMentionVendor] = useState(true);
    const [createReview, { loading }] = useMutation(CREATE_REVIEW, {
        refetchQueries: [
            {
                query: FIND_REVIEW_PAGE_BY_SERVICE,
                variables: { offering_id: serviceId, page: 1, limit: 5 },
            },
        ],
        awaitRefetchQueries: true,
    });
    const [showForm, setShowForm] = useState(false);  // State to control the form visibility

    const activeRating = hoverRating || rating;

    const handleWriteReviewClick = () => {
        if (!visitor) {
            toast.error("You must be logged in to write a review", {
                duration: 3000,
                position: 'top-center',
            });
            return;
        }
        setShowForm((prev) => !prev);
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

        if (images.length > 5) {
            toast.error("You can upload up to 5 images.");
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
                // eslint-disable-next-line no-console
                console.log("Review created successfully:", response.data);
                setRating(0);
                setComment("");
                setImages([]);
                setMentionVendor(true);
                setShowForm(false);  // Hide the form after submission
                toast.success("Review submitted successfully!");
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Error creating review:", error);
            toast.error("Failed to submit review. Please try again.");
        }
    };

    return (
        <div className='font-body mt-4'>
            <div className='rounded-2xl border border-orange/20 bg-white p-4 md:p-5 shadow-sm'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
                    <div>
                        <h3 className='text-xl font-title font-bold text-gray-900'>Share your experience</h3>
                        <p className='text-sm text-gray-600'>
                            Your review helps couples choose the right vendor service.
                        </p>
                    </div>
                    <Button
                        onClick={handleWriteReviewClick}
                        className='w-full md:w-44 font-bold hover:border-orange hover:text-orange hover:bg-orange/15'
                        variant="ornageOutline"
                    >
                        {showForm ? "Close Form" : "Write a Review"}
                    </Button>
                </div>

                {/* Only show the form if user is logged in and showForm is true */}
                {visitor && showForm && (
                    <form onSubmit={handleSubmit} className='mt-5 border-t border-gray-200 pt-5 space-y-5'>
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
                                Add photos (up to 5)
                            </label>
                            <label className='flex items-center gap-2 w-fit rounded-lg border border-dashed border-gray-400 px-3 py-2 cursor-pointer hover:border-orange hover:bg-orange/5 transition-colors'>
                                <FiImage size={16} />
                                <span className='text-sm'>Upload Images</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className='hidden'
                                    onChange={(e) => {
                                        const selectedFiles = Array.from(e.target.files || []);
                                        setImages(selectedFiles.slice(0, 5));
                                    }}
                                    disabled={loading}
                                />
                            </label>

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

                {!visitor && (
                    <p className='mt-4 text-sm text-gray-600'>
                        Log in as a user to submit a review for this service.
                    </p>
                )}
            </div>
        </div>
    );
};

export default WriteReview;
