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

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Schedule Your Astronomy Session</CardTitle>
            <div className="flex gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-300 rounded"></div>
                <span className="text-slate-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-slate-600">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-300 rounded opacity-50"></div>
                <span className="text-slate-600">Unavailable</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 block">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                  {date && (
                    <div className="mt-3 p-3 bg-slate-100 rounded-md">
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
                    <Label>Select Time</Label>
                    {loadingSlots && (
                      <span className="text-sm text-slate-500 animate-pulse">Loading slots...</span>
                    )}
                    {!loadingSlots && date && (
                      <span className="text-sm text-slate-600">
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
                          className={`w-full transition-all ${
                            isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                          } ${
                            isUnavailable ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                          }`}
                        >
                          {isUnavailable ? (
                            <span className="line-through">{time}</span>
                          ) : (
                            time
                          )}
                        </Button>
                      );
                    })}
                  </div>
                  {selectedTime && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800">
                        ✓ Selected time: <strong>{selectedTime}</strong>
                      </p>
                    </div>
                  )}
                  {!loadingSlots && unavailableTimes.length === TIME_SLOTS.length && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800">
                        ⚠ All slots are booked for this date. Please select another date.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading || !selectedTime || loadingSlots} 
                className="w-full text-lg py-6"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Booking...
                  </span>
                ) : (
                  `Book Appointment ${selectedTime ? `at ${selectedTime}` : ''}`
                )}
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
