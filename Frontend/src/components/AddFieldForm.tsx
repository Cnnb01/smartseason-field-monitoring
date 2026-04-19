import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AddFieldForm: React.FC<{ onFieldsUpdated: () => void }> = ({ onFieldsUpdated }) => {
  const { user } = useAuth();
  const [agents, setAgents] = useState<{ id: number; username: string }[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    crop_type: '',
    assigned_agent: user?.role === 'AGENT' ? user.id : '',
    current_stage: 'PLANTED',
    planting_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      api.get('users/?role=AGENT').then((res) => setAgents(res.data));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('fields/', formData);
      setFormData({ 
        name: '', 
        crop_type: '', 
        assigned_agent: user?.role === 'AGENT' ? user.id : '', 
        current_stage: 'PLANTED',
        planting_date: new Date().toISOString().split('T')[0] 
      });
      onFieldsUpdated(); // This triggers the refresh in Dashboard
      alert("Field created successfully!");
    } catch (err) {
      console.error("Error creating field", err);
      alert("Failed to create field.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border mb-8">
      <h3 className="font-bold text-lg mb-4 text-green-800">Register New Field</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          className="p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
          placeholder="Field Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          className="p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
          placeholder="Crop Type"
          value={formData.crop_type}
          onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })}
          required
        />
        {user?.role === 'ADMIN' ? (
          <select
            className="p-2 border rounded bg-white"
            value={formData.assigned_agent}
            onChange={(e) => setFormData({ ...formData, assigned_agent: e.target.value })}
            required
          >
            <option value="">Assign Agent</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>{a.username}</option>
            ))}
          </select>
        ) : (
          <div className="p-2 bg-gray-50 border rounded text-gray-500 text-sm flex items-center">
            Assigned to: Self ({user?.usename})
          </div>
        )}
        <button type="submit" className="bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 transition">
          + Add Field
        </button>
      </div>
    </form>
  );
};

export default AddFieldForm;