import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Field, FieldStage } from '../types'

const FieldDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [field, setField] = useState<Field | null>(null);
  const [notes, setNotes] = useState('');
  const [newStage, setNewStage] = useState<FieldStage | ''>('');

  useEffect(() => {
    const fetchField = async () => {
        const response = await api.get<Field>(`fields/${id}/`);
        setField(response.data);
        setNewStage(response.data.current_stage);
    };
    fetchField();
  }, [id]);

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    // update note
    await api.post('updates/', {
        field: id,
        notes: notes,
        stage_at_update: newStage })
    //update field's current stage
    await api.patch(`fields/${id}/`, { current_stage: newStage });
    alert("Update submitted successfully!");
    navigate('/');
  }

  if (!field) return <div className="p-10 text-center">Loading Field Details...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button onClick={() => navigate('/')} className="mb-6 text-green-700 hover:underline">← Back to Dashboard</button>
      
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-3xl font-bold mb-2">{field.name}</h2>
        <p className="text-gray-500 mb-6">Crop: {field.crop_type} | Current Stage: <span className="font-bold text-green-700">{field.current_stage}</span></p>

        {/* --- Update Form --- */}
        <form onSubmit={handleSubmitUpdate} className="bg-gray-50 p-6 rounded-lg border mb-8">
          <h3 className="font-bold mb-4 text-lg">Log New Activity</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Update Growth Stage</label>
            <select 
              className="w-full p-2 border rounded bg-white"
              value={newStage}
              onChange={(e) => setNewStage(e.target.value as FieldStage)}
            >
              <option value="PLANTED">Planted</option>
              <option value="GROWING">Growing</option>
              <option value="READY">Ready</option>
              <option value="HARVESTED">Harvested</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Observation Notes</label>
            <textarea 
              className="w-full p-2 border rounded bg-white h-24"
              placeholder="e.g.,Pests spotted on north side, wilt or disease on plants"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">
            Submit Field Log
          </button>
        </form>

        {/* --- Update History --- */}
        <h3 className="font-bold mb-4">Activity History</h3>
        <div className="space-y-4">
          {field.updates.map((update) => (
            <div key={update.id} className="border-l-4 border-green-200 pl-4 py-2">
              <p className="text-sm font-bold text-gray-700">{update.stage_at_update} - {new Date(update.timestamp).toLocaleDateString()}</p>
              <p className="text-gray-600 italic">"{update.notes}"</p>
              <p className="text-xs text-gray-400 mt-1">Logged by Agent: {update.agent_name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldDetail;