'use client';

import type { Review } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { updateReview, deleteReview } from '@/services/reviewService';

interface ReviewCardProps {
  review: Review;
  onUpdate?: () => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? 'text-amber-400' : 'text-gray-200'}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewCard({ review, onUpdate }: ReviewCardProps) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment || '');
  const [loading, setLoading] = useState(false);

  const isOwner = user?.id === review.user_id;

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateReview(review.id, rating, comment);
      onUpdate?.();
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this review?')) return;
    setLoading(true);
    try {
      await deleteReview(review.id);
      onUpdate?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-white">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-gray-900">{review.users?.name || 'User'}</p>
          <div className="mt-1">
            {editing ? (
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="input-field w-auto">
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} stars</option>
                ))}
              </select>
            ) : (
              <StarRating rating={review.rating} />
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500">
          {new Date(review.created_at).toLocaleDateString()}
        </p>
      </div>
      {editing ? (
        <div className="mt-3">
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="input-field min-h-[80px]" placeholder="Comment" />
          <div className="mt-2 flex gap-2">
            <button onClick={handleSave} disabled={loading} className="btn-primary text-sm">Save</button>
            <button onClick={() => setEditing(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          {review.comment && <p className="mt-2 text-gray-600 text-sm">{review.comment}</p>}
          {isOwner && (
            <div className="mt-2 flex gap-2">
              <button onClick={() => setEditing(true)} className="text-sm text-primary-600 hover:underline">Edit</button>
              <button onClick={handleDelete} disabled={loading} className="text-sm text-red-600 hover:underline">Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
