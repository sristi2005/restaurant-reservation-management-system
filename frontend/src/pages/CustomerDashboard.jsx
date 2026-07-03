import { useState, useEffect } from 'react';
import api from '../services/api';

function CustomerDashboard({ user }) {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('18:00');
  const [guests, setGuests] = useState(2);
  const [editingId, setEditingId] = useState(null);

  const fetchReservations = async () => {
    try {
      const res = await api.get('/reservations');
      setReservations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await api.put(`/reservations/${editingId}`, { date, timeSlot, guests });
        setSuccess('Reservation updated successfully!');
        setEditingId(null);
      } else {
        await api.post('/reservations', { date, timeSlot, guests });
        setSuccess('Reservation created successfully!');
      }
      // Reset form
      setDate('');
      setTimeSlot('18:00');
      setGuests(2);
      fetchReservations();
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
    }
  };

  const handleEdit = (res) => {
    setEditingId(res._id);
    setDate(res.date);
    setTimeSlot(res.timeSlot);
    setGuests(res.guests);
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDate('');
    setTimeSlot('18:00');
    setGuests(2);
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await api.delete(`/reservations/${id}`);
      fetchReservations();
    } catch (err) {
      alert(err.response?.data?.error || 'Cancel failed');
    }
  };

  return (
    <div className="grid grid-cols-2">
      <div>
        <h2>{editingId ? 'Edit Reservation' : 'Make a Reservation'}</h2>
        <div className="card">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert" style={{backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #10b981'}}>{success}</div>}
          <form onSubmit={handleBook}>
            <div className="form-group">
              <label>Date</label>
              <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Time Slot</label>
              <select className="form-control" value={timeSlot} onChange={e => setTimeSlot(e.target.value)}>
                <option value="18:00">18:00 (6:00 PM)</option>
                <option value="19:00">19:00 (7:00 PM)</option>
                <option value="20:00">20:00 (8:00 PM)</option>
                <option value="21:00">21:00 (9:00 PM)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Guests</label>
              <input type="number" min="1" max="20" className="form-control" value={guests} onChange={e => setGuests(Number(e.target.value))} required />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                {editingId ? 'Update Table' : 'Book Table'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-outline" onClick={handleCancelEdit}>Cancel Edit</button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div>
        <h2>Your Reservations</h2>
        <div className="card">
          {reservations.length === 0 ? (
            <p>You have no reservations yet.</p>
          ) : (
            <ul className="reservation-list">
              {reservations.map(res => (
                <li key={res._id} className="reservation-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div className="reservation-info" style={{ width: '100%' }}>
                    <strong>{res.date} at {res.timeSlot}</strong>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      Table {res.table?.tableNumber} • {res.guests} Guests
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                    <button className="btn btn-outline" onClick={() => handleEdit(res)} style={{ flex: 1 }}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleCancel(res._id)} style={{ flex: 1 }}>Cancel</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
