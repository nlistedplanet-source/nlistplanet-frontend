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
      <div className="sticky top-16 bg-white/70 backdrop-blur-xl border-b border-gray-200/30 shadow-lg z-20 rounded-b-2xl">
        <div className="px-2 py-3 md:px-4 md:py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Unlist Mall</h1>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Buy & Sell Unlisted Shares</p>
            </div>
            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-semibold text-xs md:text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <Plus size={16} />
                Create Listing
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search company..."
                className="w-full pl-8 pr-3 py-2 bg-white/80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-400 transition-all duration-200 shadow-sm text-sm"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-2 rounded-lg hover:shadow-md transition-all duration-300 flex items-center"
            >
              <Search size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-gray-100/70 p-1 rounded-lg shadow-sm">
            <button
              onClick={() => setActiveTab('sell')}
              className={`flex-1 py-2 rounded-md font-semibold text-xs md:text-sm transition-all duration-300 ${
                activeTab === 'sell'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-white/80'
              }`}
            >
              SELL Posts
            </button>
            <button
              onClick={() => setActiveTab('buy')}
              className={`flex-1 py-2 rounded-md font-semibold text-xs md:text-sm transition-all duration-300 ${
                activeTab === 'buy'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-white/80'
              }`}
            >
              BUY Requests
            </button>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 mt-3 bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-gray-200/30 shadow-sm">
            <Filter size={16} className="text-emerald-600" />
            <span className="text-xs md:text-sm text-gray-700 font-semibold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-2 py-1 bg-white border border-gray-200 rounded text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-400 transition-all duration-200 font-medium text-gray-700"
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
