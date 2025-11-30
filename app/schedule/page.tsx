'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import Link from 'next/link';
import { toast } from 'sonner';
import Script from 'next/script';

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

const BOOKING_PRICE = 999;

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export default function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [unavailableTimes, setUnavailableTimes] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (date) {
      fetchAvailableSlots(date.toISOString().split('T')[0]);
    }
  }, [date]);

  const fetchAvailableSlots = async (dateStr: string) => {
    setLoadingSlots(true);
    setSelectedTime('');
    try {
      const res = await fetch(`/api/available-slots?date=${dateStr}`);
      const data = await res.json();
      setUnavailableTimes(data.unavailableTimes || []);
      
      const availableCount = TIME_SLOTS.length - (data.unavailableTimes?.length || 0);
      if (availableCount === 0) {
        toast.info('No available slots for this date');
      } else {
        toast.success(`${availableCount} slot${availableCount !== 1 ? 's' : ''} available`);
      }
    } catch {
      toast.error('Failed to fetch available slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handlePayment = async () => {
    if (!date || !selectedTime) return;

    setLoading(true);
    try {
      // Create Razorpay order
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: BOOKING_PRICE })
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        toast.error('Failed to create payment order');
        setLoading(false);
        return;
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Astronomy Booking',
        description: 'Astronomy Session Booking',
        order_id: orderData.id,
        handler: async function (response: RazorpayResponse) {
          try {
            // Verify payment
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              // Book appointment after successful payment
              const bookingRes = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...formData,
                  date: date.toISOString().split('T')[0],
                  time: selectedTime
                })
              });

              if (bookingRes.ok) {
                toast.success('Payment successful! Appointment booked.');
                setFormData({ name: '', email: '', phone: '', notes: '' });
                setSelectedTime('');
                fetchAvailableSlots(date.toISOString().split('T')[0]);
              } else {
                toast.error('Payment successful but booking failed. Please contact support.');
              }
            } else {
              toast.error('Payment verification failed');
            }
          } catch {
            toast.error('Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: function() {
            toast.error('Payment cancelled');
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch {
      toast.error('Failed to initiate payment');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !selectedTime) return;

    handlePayment();
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle className="text-3xl text-center">Schedule Your Astronomy Session</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-lg font-semibold mb-2 block">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                  {date && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                      <p className="text-sm text-slate-700">
                        Selected: <strong>{date.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</strong>
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-lg font-semibold">Select Time</Label>
                    {loadingSlots && (
                      <span className="text-sm text-blue-600">Loading...</span>
                    )}
                    {!loadingSlots && date && (
                      <span className="text-sm text-green-600 font-medium">
                        {TIME_SLOTS.length - unavailableTimes.length} available
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((time) => {
                      const isUnavailable = unavailableTimes.includes(time);
                      const isSelected = selectedTime === time;
                      return (
                        <Button
                          key={time}
                          type="button"
                          variant={isSelected ? 'default' : 'outline'}
                          disabled={isUnavailable || loadingSlots}
                          onClick={() => {
                            setSelectedTime(time);
                            toast.success(`Selected ${time}`);
                          }}
                          className={isUnavailable ? 'opacity-50' : ''}
                        >
                          {isUnavailable ? <span className="line-through">{time}</span> : time}
                        </Button>
                      );
                    })}
                  </div>
                  {selectedTime && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                      <p className="text-sm text-blue-900 font-medium">
                        ✓ Selected time: <strong>{selectedTime}</strong>
                      </p>
                    </div>
                  )}
                  {!loadingSlots && unavailableTimes.length === TIME_SLOTS.length && (
                    <div className="mt-3 p-3 bg-red-50 rounded-md border border-red-200">
                      <p className="text-sm text-red-800">
                        All slots are booked for this date. Please select another date.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 bg-slate-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-900">Your Information</h3>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any special requests?"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-slate-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">₹{BOOKING_PRICE}</span>
                </div>
                <p className="text-sm text-slate-600 mt-2">Secure payment via Razorpay</p>
              </div>

              <Button 
                type="submit" 
                disabled={loading || !selectedTime || loadingSlots} 
                className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Processing...' : `Pay ₹${BOOKING_PRICE} & Book Appointment`}
              </Button>
              {!selectedTime && !loadingSlots && (
                <p className="text-sm text-center text-slate-500">
                  Please select a date and time to continue
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
