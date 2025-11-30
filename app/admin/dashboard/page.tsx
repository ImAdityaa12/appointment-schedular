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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{appointments.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blocked Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{blockedSlots.length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Block Time Slot</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Block a Time Slot</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={blockDate}
                    onSelect={setBlockDate}
                    className="rounded-md border"
                  />
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
                  <Label htmlFor="blockWholeDay" className="cursor-pointer">Block Whole Day</Label>
                </div>
                {!blockWholeDay && (
                  <div>
                    <Label>Select Time</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {TIME_SLOTS.map((time) => (
                        <Button
                          key={time}
                          type="button"
                          variant={blockTime === time ? 'default' : 'outline'}
                          onClick={() => setBlockTime(time)}
                          size="sm"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="reason">Reason (Optional)</Label>
                  <Input
                    id="reason"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                  />
                </div>
                <Button onClick={handleBlockSlot} disabled={(!blockTime && !blockWholeDay) || blockLoading} className="w-full">
                  {blockLoading ? 'Blocking...' : blockWholeDay ? 'Block Whole Day' : 'Block Slot'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>All Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Phone</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Time</th>
                    <th className="text-left p-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="border-b">
                      <td className="p-2">{apt.name}</td>
                      <td className="p-2">{apt.email}</td>
                      <td className="p-2">{apt.phone}</td>
                      <td className="p-2">{apt.date}</td>
                      <td className="p-2">
                        <Badge>{apt.time}</Badge>
                      </td>
                      <td className="p-2">{apt.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blocked Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Time</th>
                    <th className="text-left p-2">Reason</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blockedSlots.map((slot) => (
                    <tr key={slot.id} className="border-b">
                      <td className="p-2">{slot.date}</td>
                      <td className="p-2">
                        <Badge variant="destructive">{slot.time}</Badge>
                      </td>
                      <td className="p-2">{slot.reason || '-'}</td>
                      <td className="p-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveBlockedSlot(slot.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
