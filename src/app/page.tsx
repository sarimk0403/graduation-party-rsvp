'use client';

import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

export default function Home() {
  const [event, setEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: 'yes',
    additionalGuests: 0,
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch the event details when the component mounts
    const fetchEvent = async () => {
      try {
        const response = await fetch('/api/event');
        const data = await response.json();
        if (data.event) {
          setEvent(data.event);
        } else {
          toast.error('Could not load event details. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Could not load event details. Please try again later.');
      }
    };

    fetchEvent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!event) {
      toast.error('Event details not loaded. Please refresh the page.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          eventId: event.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('RSVP submitted successfully!');
        setFormData({
          name: '',
          email: '',
          attending: 'yes',
          additionalGuests: 0,
          message: ''
        });
      } else {
        const errorMessage = data.details || data.error || 'Failed to submit RSVP';
        toast.error(`Error: ${errorMessage}. Please try again.`);
        console.error('Submission error:', data);
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      toast.error('An error occurred while submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) {
    return (
      <main className="min-h-screen bg-off-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-gray-600">Loading event details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-off-white">
      <div className="event-header">
        <div className="container-custom">
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-8">
            Join Us For Sarim's Graduation Party
          </h1>
          <p className="text-2xl text-gray-700 mb-4">
            Sunday, May 11, 2025 at 7:00 PM
          </p>
          <p className="text-xl text-gold">
            2505 S Walton Blvd A, Bentonville, AR 72712
          </p>
        </div>
      </div>

      <div className="container-custom">
        <form onSubmit={handleSubmit} className="form-container max-w-2xl mx-auto">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="block w-full rounded-md shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">Will you be attending?</label>
              <div className="flex space-x-12">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="yes"
                    checked={formData.attending === 'yes'}
                    onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                  />
                  <span className="ml-2 text-gray-700">Yes, I'll be there!</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="no"
                    checked={formData.attending === 'no'}
                    onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                  />
                  <span className="ml-2 text-gray-700">Sorry, I can't make it</span>
                </label>
              </div>
            </div>

            {formData.attending === 'yes' && (
              <div>
                <label htmlFor="additionalGuests" className="block text-base font-medium text-gray-700 mb-2">
                  Additional Guests
                </label>
                <input
                  type="number"
                  id="additionalGuests"
                  min="0"
                  max="10"
                  value={formData.additionalGuests}
                  onChange={(e) => setFormData({ ...formData, additionalGuests: parseInt(e.target.value) || 0 })}
                  className="block w-40 rounded-md shadow-sm"
                />
                <p className="mt-2 text-sm text-gray-500">Please enter a number between 0 and 10</p>
              </div>
            )}

            <div>
              <label htmlFor="message" className="block text-base font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                id="message"
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="block w-full rounded-md shadow-sm"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
              </button>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600">Please RSVP by April 20, 2025</p>
            </div>
          </div>
        </form>
      </div>
      <Toaster position="top-center" />
    </main>
  );
}
