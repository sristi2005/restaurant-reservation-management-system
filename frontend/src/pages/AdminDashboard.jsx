import { useState, useEffect } from 'react';
import api from '../services/api';

function AdminDashboard({ user }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [filterDate, setFilterDate] = useState('');

  // Edit state
  const [editingRes, setEditingRes] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editTimeSlot, setEditTimeSlot] = useState('');
  const [editGuests, setEditGuests] = useState(1);
  const [editError, setEditError] = useState('');

  const fetchReservations = async () => {
    try {
      const url = filterDate ? `/reservations?date=${filterDate}` : '/reservations';
      const res = await api.get(url);
      setReservations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTables = async () => {
    try {
      const res = await api.get('/tables');
      setTables(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchTables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDate]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await api.delete(`/reservations/${id}`);
      fetchReservations();
    } catch (err) {
      alert(err.response?.data?.error || 'Cancel failed');
    }
  };

  const startEdit = (res) => {
    setEditingRes(res);
    setEditDate(res.date);
    setEditTimeSlot(res.timeSlot);
    setEditGuests(res.guests);
    setEditError('');
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setEditError('');
    try {
      await api.put(`/reservations/${editingRes._id}`, { date: editDate, timeSlot: editTimeSlot, guests: editGuests });
      setEditingRes(null);
      fetchReservations();
    } catch (err) {
      setEditError(err.response?.data?.error || 'Update failed');
    }
  };

  return (
    <div className="grid grid-cols-2">
      <div>
        <h2>Manage Reservations</h2>
        <div className="card">
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label>Filter by Date</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="date" 
                className="form-control" 
                value={filterDate} 
                onChange={e => setFilterDate(e.target.value)} 
              />
              <button className="btn btn-outline" onClick={() => setFilterDate('')}>Clear</button>
            </div>
          </div>
          
          {reservations.length === 0 ? (
            <p>No reservations found.</p>
          ) : (
            <ul className="reservation-list">
              {reservations.map(res => (
                <li key={res._id} className="reservation-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                  
                  {editingRes?._id === res._id ? (
                    <form onSubmit={submitEdit} style={{ width: '100%' }}>
                      {editError && <div className="alert alert-danger">{editError}</div>}
                      <div className="form-group">
                        <label>Date</label>
                        <input type="date" className="form-control" value={editDate} onChange={e => setEditDate(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>Time Slot</label>
                        <select className="form-control" value={editTimeSlot} onChange={e => setEditTimeSlot(e.target.value)}>
                          <option value="18:00">18:00 (6:00 PM)</option>
                          <option value="19:00">19:00 (7:00 PM)</option>
                          <option value="20:00">20:00 (8:00 PM)</option>
                          <option value="21:00">21:00 (9:00 PM)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Guests</label>
                        <input type="number" min="1" max="20" className="form-control" value={editGuests} onChange={e => setEditGuests(Number(e.target.value))} required />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                        <button type="button" className="btn btn-outline" onClick={() => setEditingRes(null)} style={{ flex: 1 }}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="reservation-info" style={{ width: '100%' }}>
                        <strong>{res.date} at {res.timeSlot}</strong>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                          Customer: {res.user?.name} ({res.user?.email})
                        </span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                          Table {res.table?.tableNumber} • {res.guests} Guests
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                        <button className="btn btn-outline" onClick={() => startEdit(res)} style={{ flex: 1 }}>Edit</button>
                        <button className="btn btn-danger" onClick={() => handleCancel(res._id)} style={{ flex: 1 }}>Cancel</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <h2>Restaurant Tables Overview</h2>
        <div className="card">
          <ul className="reservation-list">
            {tables.map(t => (
              <li key={t._id} className="reservation-item">
                <div className="reservation-info">
                  <strong>Table {t.tableNumber}</strong>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Capacity: {t.capacity}
                  </span>
                </div>
                <span className="badge">Active</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
