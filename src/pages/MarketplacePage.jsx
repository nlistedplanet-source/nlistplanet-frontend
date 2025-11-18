import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Plus, Loader } from 'lucide-react';
import { listingsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';
import CreateListingModal from '../components/CreateListingModal';
import BidOfferModal from '../components/BidOfferModal';
import ShareModal from '../components/ShareModal';
import toast from 'react-hot-toast';

const MarketplacePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('sell');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await listingsAPI.getAll({
          type: activeTab,
          sort: sortBy,
          search: undefined,
        });
        setListings(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeTab, sortBy]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await listingsAPI.getAll({
        type: activeTab,
        sort: sortBy,
        search: search || undefined
      });
      setListings(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchListings();
  };

  const handleBidOffer = (listing) => {
    if (!user) {
      toast.error('Please login to place bid/offer');
      return;
    }
    setSelectedListing(listing);
    setShowBidModal(true);
  };

  const handleShare = (listing) => {
    setSelectedListing(listing);
    setShowShareModal(true);
  };

  const handleBoost = async (listingId) => {
    try {
      await listingsAPI.boost(listingId);
      toast.success('Listing boosted for 24 hours!');
      fetchListings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to boost listing');
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      {/* Modern Header with Gradient */}
      <div className="sticky top-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm z-20">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Unlist Mall</h1>
              <p className="text-sm text-gray-500 mt-1">Buy & Sell Unlisted Shares</p>
            </div>
            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 flex items-center gap-2"
              >
                <Plus size={18} />
                Create Listing
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search company..."
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 shadow-sm"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300"
            >
              <Search size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('sell')}
              className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'sell'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                  : 'text-gray-600 hover:bg-white/70'
              }`}
            >
              SELL Posts
            </button>
            <button
              onClick={() => setActiveTab('buy')}
              className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'buy'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                  : 'text-gray-600 hover:bg-white/70'
              }`}
            >
              BUY Requests
            </button>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 mt-4 bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-gray-200/50">
            <Filter size={18} className="text-emerald-600" />
            <span className="text-sm text-gray-700 font-semibold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 font-medium text-gray-700"
            >
              <option value="-createdAt">Latest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="animate-spin text-primary-600 mb-3" size={40} />
            <p className="text-dark-600">Loading listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="text-dark-300 mb-3" size={48} />
            <p className="text-dark-600 font-medium">No listings found</p>
            <p className="text-dark-400 text-sm mt-1">
              {activeTab === 'sell' ? 'No sell posts available' : 'No buy requests available'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                onBidOffer={handleBidOffer}
                onShare={handleShare}
                onBoost={handleBoost}
                isOwner={user?._id === listing.userId?._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateListingModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchListings();
          }}
        />
      )}

      {showBidModal && selectedListing && (
        <BidOfferModal
          listing={selectedListing}
          onClose={() => {
            setShowBidModal(false);
            setSelectedListing(null);
          }}
          onSuccess={() => {
            setShowBidModal(false);
            setSelectedListing(null);
            toast.success('Bid/Offer placed successfully!');
          }}
        />
      )}

      {showShareModal && selectedListing && (
        <ShareModal
          listing={selectedListing}
          onClose={() => {
            setShowShareModal(false);
            setSelectedListing(null);
          }}
        />
      )}
    </div>
  );
};

export default MarketplacePage;
