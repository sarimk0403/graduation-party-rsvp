'use client';

import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

interface Guest {
  id: string;
  name: string;
  email: string;
  rsvpStatus: 'ATTENDING' | 'NOT_ATTENDING' | 'PENDING';
  additionalGuests: number;
  notes: string | null;
  createdAt: string;
  event: {
    title: string;
  };
}

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchGuests = async () => {
    try {
      const response = await fetch('/api/rsvp');
      const data = await response.json();
      setGuests(data);
    } catch (err) {
      setError('Failed to fetch RSVPs');
      console.error('Error fetching RSVPs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this RSVP? This action cannot be undone.')) {
      setDeletingId(id);
      try {
        const response = await fetch(`/api/rsvp?id=${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();

        if (response.ok) {
          toast.success('RSVP deleted successfully');
          await fetchGuests(); // Refresh the list
        } else {
          toast.error(data.error || 'Failed to delete RSVP');
        }
      } catch (error) {
        toast.error('Failed to delete RSVP');
        console.error('Error deleting RSVP:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const attendingCount = guests.filter(g => g.rsvpStatus === 'ATTENDING').length;
  const totalAdditionalGuests = guests.reduce((sum, g) => sum + (g.rsvpStatus === 'ATTENDING' ? g.additionalGuests : 0), 0);
  const totalGuests = attendingCount + totalAdditionalGuests;

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gold">Loading RSVPs...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">{error}</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <style jsx global>{`
        :root {
          --gold: #D4AF37;
        }
        .text-gold {
          color: var(--gold);
        }
        .border-gold {
          border-color: var(--gold);
        }
        .bg-gold {
          background-color: var(--gold);
        }
      `}</style>
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gold">RSVP Dashboard</h1>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="bg-black border-2 border-gold overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gold truncate">Total RSVPs</dt>
                <dd className="mt-1 text-3xl font-semibold text-white">{guests.length}</dd>
              </div>
            </div>
            <div className="bg-black border-2 border-gold overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gold truncate">Attending</dt>
                <dd className="mt-1 text-3xl font-semibold text-white">{attendingCount}</dd>
              </div>
            </div>
            <div className="bg-black border-2 border-gold overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gold truncate">Total Guests</dt>
                <dd className="mt-1 text-3xl font-semibold text-white">{totalGuests}</dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black border-2 border-gold shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gold">
            <thead className="bg-black">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider">Additional Guests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-black divide-y divide-gold">
              {guests.map((guest) => (
                <tr key={guest.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{guest.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gold">{guest.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      guest.rsvpStatus === 'ATTENDING' ? 'bg-gold text-black' : 'bg-red-100 text-red-800'
                    }`}>
                      {guest.rsvpStatus === 'ATTENDING' ? 'Attending' : 'Not Attending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gold">
                    {guest.rsvpStatus === 'ATTENDING' ? guest.additionalGuests : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gold">{guest.notes || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gold">
                    {new Date(guest.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDelete(guest.id)}
                      disabled={deletingId === guest.id}
                      className="text-gold hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {deletingId === guest.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
} 