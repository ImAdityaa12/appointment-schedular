'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
      const timer = setTimeout(() => {
        fetchAvailableSlots(date.toISOString().split('T')[0]);
      }, 300);

      return () => clearTimeout(timer);
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

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Astronomy Booking',
        description: 'Astronomy Session Booking',
        order_id: orderData.id,
        handler: async function (response: RazorpayResponse) {
          try {
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
          color: '#6366f1'
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-white hover:bg-indigo-600/20 hover:border-indigo-500 hover:text-indigo-300 transition-all duration-300 hover:scale-105">
                ← Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              Schedule Your Astronomy Session
            </h1>
            <p className="text-xl text-slate-400">Choose your perfect time to explore the cosmos</p>
          </div>

          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xl shadow-2xl">
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <Label className="text-lg font-semibold mb-3 block text-white">Select Date</Label>
                    <div className="bg-slate-800 p-4 rounded-xl border-2 border-indigo-500/50 shadow-xl calendar-dark-theme">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md"
                      />
                    </div>
                    {date && (
                      <div className="mt-4 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                        <p className="text-sm text-indigo-200">
                          Selected: <strong className="text-white">{date.toLocaleDateString('en-US', { 
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
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-lg font-semibold text-white">Select Time</Label>
                      {loadingSlots && (
                        <span className="text-sm text-indigo-400 animate-pulse">Loading...</span>
                      )}
                      {!loadingSlots && date && (
                        <span className="text-sm text-green-400 font-medium px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
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
                            className={`${isSelected ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-0 hover:from-indigo-700 hover:to-purple-700 text-white' : 'bg-slate-800/50 border-slate-700 text-white hover:bg-indigo-600/20 hover:border-indigo-500/50 hover:text-white hover:scale-105 transition-all'} ${isUnavailable ? 'opacity-30' : ''}`}
                          >
                            {isUnavailable ? <span className="line-through">{time}</span> : time}
                          </Button>
                        );
                      })}
                    </div>
                    {selectedTime && (
                      <div className="mt-4 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                        <p className="text-sm text-indigo-200 font-medium">
                          ✓ Selected time: <strong className="text-white text-base">{selectedTime}</strong>
                        </p>
                      </div>
                    )}
                    {!loadingSlots && unavailableTimes.length === TIME_SLOTS.length && (
                      <div className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                        <p className="text-sm text-red-300">
                          All slots are booked for this date. Please select another date.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-5 bg-gradient-to-br from-slate-800/40 to-slate-800/20 p-8 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-2xl">👤</span> Your Information
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300 font-medium">Full Name</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 h-12 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300 font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 h-12 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-300 font-medium">Phone</Label>
                    <Input
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 h-12 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-slate-300 font-medium">Additional Notes (Optional)</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any special requests?"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 h-12 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-white">Total Amount:</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">₹{BOOKING_PRICE}</span>
                  </div>
                  <p className="text-sm text-slate-400">🔒 Secure payment via Razorpay</p>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading || !selectedTime || loadingSlots} 
                  className="w-full text-lg py-7 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-700 hover:via-indigo-600 hover:to-purple-700 text-white border-0 shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-600/60 transition-all duration-300 font-semibold"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span> Processing Payment...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>💳</span> Pay ₹{BOOKING_PRICE} & Book Appointment
                    </span>
                  )}
                </Button>
                {!selectedTime && !loadingSlots && (
                  <p className="text-sm text-center text-slate-400">
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
