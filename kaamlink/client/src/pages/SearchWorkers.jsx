// File: client/src/pages/SearchWorkers.jsx
// Purpose: Search and filter page for browsing verified worker profiles

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import WorkerCard from '../components/worker/WorkerCard.jsx';
import SkeletonCard from '../components/common/SkeletonCard.jsx';

const categories = [
  { label: 'Maid', value: 'maid' },
  { label: 'Plumber', value: 'plumber' },
  { label: 'Electrician', value: 'electrician' },
  { label: 'Driver', value: 'driver' },
  { label: 'Cook', value: 'cook' },
  { label: 'Carpenter', value: 'carpenter' },
  { label: 'House Help', value: 'house_help' },
  { label: 'Other', value: 'other' },
];

const SearchWorkers = () => {
  const [params, setParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const fetchWorkers = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const query = new URLSearchParams(params);
      query.set('page', page.toString());
      query.set('limit', '10');
      const res = await api.get(`/workers?${query.toString()}`);
      setWorkers(res.data.data);
      setPagination({ page: res.data.page, pages: res.data.pages });
    } catch (err) {
      setError('Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.toString()]);

  const handleFilterChange = (name, value) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(name);
    else next.set(name, value);
    setParams(next);
  };

  const handlePageChange = (page) => {
    fetchWorkers(page);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-[260px,1fr]">
      <aside className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Filters</h2>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-gray-700 mb-1">Category</p>
            <div className="space-y-1">
              {categories.map((c) => (
                <label key={c.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    checked={params.get('category') === c.value}
                    onChange={() => handleFilterChange('category', c.value)}
                  />
                  <span>{c.label}</span>
                </label>
              ))}
              <button
                type="button"
                className="text-xs text-gray-500 underline mt-1"
                onClick={() => handleFilterChange('category', '')}
              >
                Clear category
              </button>
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">City</p>
            <input
              type="text"
              className="w-full rounded-xl border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              value={params.get('city') || ''}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            />
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">Pincode</p>
            <input
              type="text"
              className="w-full rounded-xl border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              value={params.get('pincode') || ''}
              onChange={(e) => handleFilterChange('pincode', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="font-medium text-gray-700 mb-1">Min Rate</p>
              <input
                type="number"
                className="w-full rounded-xl border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                value={params.get('minRate') || ''}
                onChange={(e) => handleFilterChange('minRate', e.target.value)}
              />
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Max Rate</p>
              <input
                type="number"
                className="w-full rounded-xl border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                value={params.get('maxRate') || ''}
                onChange={(e) => handleFilterChange('maxRate', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={params.get('available') === 'true'}
                onChange={(e) =>
                  handleFilterChange('available', e.target.checked ? 'true' : '')
                }
              />
              <span>Available only</span>
            </label>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">Sort by</p>
            <select
              className="w-full rounded-xl border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              value={params.get('sortBy') || ''}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="">Default</option>
              <option value="rating">Rating</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </aside>

      <section>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Find Workers</h1>
        <p className="text-sm text-gray-600 mb-4">
          Browse verified local workers that match your requirement.
        </p>

        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {error}
          </div>
        )}

        {!loading && !error && workers.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-10 text-center text-sm text-gray-500">
            No workers found for the selected filters. Try broadening your search.
          </div>
        )}

        {!loading && !error && workers.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workers.map((w) => (
                <WorkerCard key={w._id} worker={w} />
              ))}
            </div>
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-6 text-sm">
                {Array.from({ length: pagination.pages }).map((_, idx) => {
                  const page = idx + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-xl border ${
                        page === pagination.page
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default SearchWorkers;

