import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFields } from "../hooks/useFields";
import { LayoutGrid, AlertTriangle, CheckCircle2, Sprout, Search, Filter } from "lucide-react";
import AddFieldForm from "../components/AddFieldForm";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { fields, loading, refresh } = useFields();
  const navigate = useNavigate();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  if (loading) return <div className="flex justify-center p-20 font-medium">Loading SmartSeason Data...</div>;

  // 1. Logic: Filter and Search
  const filteredFields = fields.filter(field => {
    const matchesSearch = 
      field.assigned_agent_name?.toLowerCase().includes(search.toLowerCase()) || 
      field.name.toLowerCase().includes(search.toLowerCase()) ||
      field.crop_type.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || field.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // 2. Logic: Stats based on FULL list (Requirement #6)
  const stats = {
    total: fields.length,
    atRisk: fields.filter(f => f.status === 'AT RISK').length,
    completed: fields.filter(f => f.status === 'COMPLETED').length,
    active: fields.filter(f => f.status === 'ACTIVE').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <Sprout className="text-green-600" />
          <h1 className="text-xl font-bold text-green-800">SmartSeason Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{user?.role}</p>
            <p className="text-sm font-medium text-gray-700">{user?.usename}</p>
          </div>
          <button onClick={logout} className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        {/* Requirement #6: Summary View */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Fields" value={stats.total} icon={<LayoutGrid />} color="blue" />
          <StatCard title="At Risk" value={stats.atRisk} icon={<AlertTriangle />} color="red" />
          <StatCard title="Active" value={stats.active} icon={<Sprout />} color="green" />
          <StatCard title="Completed" value={stats.completed} icon={<CheckCircle2 />} color="gray" />
        </div>

        {/* Add Field Component */}
        <AddFieldForm onFieldsUpdated={refresh} />

        {/* Search and Filters Bar */}
        <div className="flex flex-col md:row gap-4 mb-8 bg-white p-4 rounded-xl border shadow-sm">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search by field name, crop, or agent..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 min-w-[200px]">
            <Filter className="text-gray-400 w-5 h-5" />
            <select 
              className="w-full p-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-green-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="AT RISK">At Risk Only</option>
              <option value="COMPLETED">Completed Only</option>
            </select>
          </div>
        </div>

        {/* Fields Grid */}
        {filteredFields.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFields.map(field => (
              <div key={field.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-lg transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-gray-800">{field.name}</h3>
                  <span className={`px-3 py-1 text-xs font-black rounded-full ${
                    field.status === 'AT RISK' ? 'bg-red-100 text-red-700' : 
                    field.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {field.status}
                  </span>
                </div>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-gray-600 flex justify-between">
                    <span>Crop Type:</span> <span className="font-semibold">{field.crop_type}</span>
                  </p>
                  <p className="text-sm text-gray-600 flex justify-between">
                    <span>Growth Stage:</span> <span className="font-semibold">{field.current_stage}</span>
                  </p>
                </div>
                <div className="pt-4 border-t flex justify-between items-center">
                  <span className="text-xs text-gray-400 italic font-medium">Agent: {field.assigned_agent_name}</span>
                  <button 
                    onClick={() => navigate(`/field/${field.id}`)} 
                    className="text-green-600 text-sm font-bold hover:text-green-800 flex items-center gap-1"
                  >
                    Details <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed">
            <p className="text-gray-500 font-medium">No fields match your search or filter.</p>
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => {
  const colorMap: any = {
    blue: "border-l-blue-500 bg-blue-50",
    red: "border-l-red-500 bg-red-50",
    green: "border-l-green-500 bg-green-50",
    gray: "border-l-gray-500 bg-gray-50",
  };
  
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${colorMap[color] || 'border-l-green-600'}`}>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg text-gray-700 bg-white shadow-sm">{icon}</div>
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{title}</p>
          <p className="text-2xl font-black text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;