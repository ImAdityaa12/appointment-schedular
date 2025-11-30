'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import Link from 'next/link';
import { toast } from 'sonner';

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !selectedTime) return;

    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: date.toISOString().split('T')[0],
          time: selectedTime
        })
      });

      if (res.ok) {
        toast.success('Appointment booked successfully!');
        setFormData({ name: '', email: '', phone: '', notes: '' });
        setSelectedTime('');
        fetchAvailableSlots(date.toISOString().split('T')[0]);
      } else {
        toast.error('Failed to book appointment');
      }
    } catch {
      toast.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
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

              <Button 
                type="submit" 
                disabled={loading || !selectedTime || loadingSlots} 
                className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Booking...' : `Book Appointment ${selectedTime ? `at ${selectedTime}` : ''}`}
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
  );
}
