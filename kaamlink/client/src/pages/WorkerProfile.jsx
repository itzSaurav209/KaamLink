// File: client/src/pages/WorkerProfile.jsx
// Purpose: Public worker profile page with full details and hire CTA

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/common/Loader.jsx';
import Badge from '../components/common/Badge.jsx';
import StarRating from '../components/common/StarRating.jsx';

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [profileRes, reviewRes] = await Promise.all([
        api.get(`/workers/${id}`),
        api.get(`/reviews/worker/${id}`),
      ]);
      setProfile(profileRes.data);
      setReviews(reviewRes.data);
    } catch {
      setError('Failed to load worker profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) return <Loader fullScreen />;
  if (error)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-sm text-red-500">{error}</div>
    );
  if (!profile)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-sm text-gray-500">
        Worker not found.
      </div>
    );

  const isOwnProfile = false; // Simplified for demo; could compare with auth user

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-[2fr,1fr] gap-6">
      <section className="space-y-4">
        <div className="card p-5 flex gap-4">
          <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-semibold text-primary">
            {profile.user?.name?.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">{profile.user?.name}</h1>
              <Badge text={profile.category} variant={profile.category} />
              {profile.isVerified && <Badge text="Verified" variant="approved" />}
            </div>
            <p className="text-sm text-gray-600">
              {profile.location?.city}, {profile.location?.state} {profile.location?.pincode}
            </p>
            <div className="flex items-center gap-3 mt-2 text-sm">
              <div>
                <span className="font-semibold">₹{profile.dailyRate}</span>
                <span className="text-gray-500 text-xs ml-1">/ day</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <StarRating rating={profile.averageRating || 0} />
                <span>({profile.totalReviews || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-5 space-y-2 text-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-1">About</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
          <div className="mt-2">
            <h3 className="text-xs font-semibold text-gray-700 mb-1">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(profile.skills || []).map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-5 text-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-2">Verification</h2>
          {profile.isVerified ? (
            <p className="text-emerald-600 text-sm">Aadhaar Verified ✅</p>
          ) : (
            <p className="text-gray-600 text-sm">
              Profile is {profile.verificationStatus}. Documents are under review.
            </p>
          )}
        </div>

        <div className="card p-5 text-sm space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Reviews</h2>
          {reviews.length === 0 && (
            <p className="text-gray-500 text-sm">No reviews yet for this worker.</p>
          )}
          {reviews.map((r) => (
            <div key={r._id} className="border-b last:border-none border-gray-100 pb-3 mb-3">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-gray-800">{r.reviewer?.name}</p>
                <StarRating rating={r.rating} />
              </div>
              <p className="text-xs text-gray-500 mb-1">
                {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
              </p>
              <p className="text-sm text-gray-700">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>

      <aside className="space-y-4">
        <div className="card p-4 sticky top-24">
          <h3 className="text-base font-semibold text-gray-900 mb-2">Hire this worker</h3>
          <p className="text-xs text-gray-600 mb-3">
            Share your requirement and preferred date. The worker will accept or decline based on
            availability.
          </p>
          {isOwnProfile ? (
            <button className="btn-primary w-full justify-center bg-gray-200 text-gray-700 hover:bg-gray-200">
              Edit Profile (coming soon)
            </button>
          ) : (
            <button
              onClick={() => navigate(`/job/request?workerId=${id}`)}
              className="btn-primary w-full justify-center"
            >
              Request to Hire
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};

export default WorkerProfile;

