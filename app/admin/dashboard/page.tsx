'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

interface Appointment {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes: string | null;
  createdAt: Date;
}

interface BlockedSlot {
  id: number;
  date: string;
  time: string;
  reason: string | null;
  createdAt: Date;
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockDate, setBlockDate] = useState<Date | undefined>(new Date());
  const [blockTime, setBlockTime] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [blockWholeDay, setBlockWholeDay] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      router.push('/admin');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [appointmentsRes, blockedRes] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/blocked-slots')
      ]);

      const appointmentsData = await appointmentsRes.json();
      const blockedData = await blockedRes.json();

      setAppointments(appointmentsData);
      setBlockedSlots(blockedData);
    } catch {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockSlot = async () => {
    if (!blockDate || (!blockTime && !blockWholeDay)) return;

    setBlockLoading(true);
    try {
      const res = await fetch('/api/blocked-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: blockDate.toISOString().split('T')[0],
          time: blockTime,
          reason: blockReason,
          blockWholeDay
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(blockWholeDay ? 'Whole day blocked successfully' : 'Time slot blocked successfully');
        setDialogOpen(false);
        setBlockTime('');
        setBlockReason('');
        setBlockWholeDay(false);
        fetchData();
      } else {
        toast.error(data.error || 'Failed to block slot');
      }
    } catch {
      toast.error('Failed to block slot');
    } finally {
      setBlockLoading(false);
    }
  };

  const handleRemoveBlockedSlot = async (id: number) => {
    try {
      const res = await fetch(`/api/blocked-slots?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success('Blocked slot removed successfully');
        fetchData();
      } else {
        toast.error('Failed to remove blocked slot');
      }
    } catch {
      toast.error('Failed to remove blocked slot');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p className="text-2xl font-semibold text-white">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-700">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Admin Dashboard</h1>
            <p className="text-slate-400 mt-2">Manage appointments and time slots</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800">
            Logout →
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all">
            <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-slate-700">
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-2xl">📅</span> Total Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{appointments.length}</p>
              <p className="text-slate-400 mt-2">Active bookings</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all">
            <CardHeader className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-b border-slate-700">
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-2xl">🚫</span> Blocked Slots
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-6xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">{blockedSlots.length}</p>
              <p className="text-slate-400 mt-2">Unavailable times</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-xl shadow-indigo-500/50">
                Block Time Slot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl">Block a Time Slot</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">Select Date</Label>
                  <div className="mt-2 bg-slate-800 p-4 rounded-xl border-2 border-indigo-500/50 shadow-xl">
                    <Calendar
                      mode="single"
                      selected={blockDate}
                      onSelect={setBlockDate}
                      className="!bg-transparent text-white [&_.rdp-month_caption]:text-white [&_.rdp-weekday]:text-slate-400 [&_button]:text-white [&_button:hover]:bg-indigo-600/20 [&_button[data-selected-single=true]]:bg-gradient-to-r [&_button[data-selected-single=true]]:from-indigo-600 [&_button[data-selected-single=true]]:to-purple-600 [&_.rdp-today]:bg-indigo-600 [&_.rdp-today]:text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="blockWholeDay"
                    checked={blockWholeDay}
                    onChange={(e) => {
                      setBlockWholeDay(e.target.checked);
                      if (e.target.checked) setBlockTime('');
                    }}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="blockWholeDay" className="cursor-pointer text-slate-300">Block Whole Day</Label>
                </div>
                {!blockWholeDay && (
                  <div>
                    <Label className="text-slate-300">Select Time</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {TIME_SLOTS.map((time) => (
                        <Button
                          key={time}
                          type="button"
                          variant={blockTime === time ? 'default' : 'outline'}
                          onClick={() => setBlockTime(time)}
                          size="sm"
                          className={blockTime === time ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-0' : 'bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800'}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="reason" className="text-slate-300">Reason (Optional)</Label>
                  <Input
                    id="reason"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className="mt-2 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <Button 
                  onClick={handleBlockSlot} 
                  disabled={(!blockTime && !blockWholeDay) || blockLoading} 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0"
                >
                  {blockLoading ? 'Blocking...' : blockWholeDay ? 'Block Whole Day' : 'Block Slot'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-8 bg-slate-900/50 border-slate-700 backdrop-blur-xl shadow-xl">
          <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-slate-700">
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-2xl">📅</span> All Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-slate-400">No appointments yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-3 font-semibold text-slate-300">Name</th>
                      <th className="text-left p-3 font-semibold text-slate-300">Email</th>
                      <th className="text-left p-3 font-semibold text-slate-300">Phone</th>
                      <th className="text-left p-3 font-semibold text-slate-300">Date</th>
                      <th className="text-left p-3 font-semibold text-slate-300">Time</th>
                      <th className="text-left p-3 font-semibold text-slate-300">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                        <td className="p-3 text-white">{apt.name}</td>
                        <td className="p-3 text-slate-400">{apt.email}</td>
                        <td className="p-3 text-slate-400">{apt.phone}</td>
                        <td className="p-3 text-slate-400">{apt.date}</td>
                        <td className="p-3">
                          <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 border-0">{apt.time}</Badge>
                        </td>
                        <td className="p-3 text-slate-400">{apt.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xl shadow-xl">
          <CardHeader className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-b border-slate-700">
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-2xl">🚫</span> Blocked Slots
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {blockedSlots.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-slate-400">No blocked slots</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-3 font-semibold text-slate-300">Date</th>
                      <th className="text-left p-3 font-semibold text-slate-300">Time</th>
                      <th className="text-left p-3 font-semibold text-slate-300">Reason</th>
                      <th className="text-left p-3 font-semibold text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blockedSlots.map((slot) => (
                      <tr key={slot.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                        <td className="p-3 text-white">{slot.date}</td>
                        <td className="p-3">
                          <Badge variant="destructive">{slot.time}</Badge>
                        </td>
                        <td className="p-3 text-slate-400">{slot.reason || '-'}</td>
                        <td className="p-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveBlockedSlot(slot.id)}
                            className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800"
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
