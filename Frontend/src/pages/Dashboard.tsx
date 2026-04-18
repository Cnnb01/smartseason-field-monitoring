import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFields } from "../hooks/useFields";
import { LayoutGrid, AlertTriangle, CheckCircle2, Sprout} from "lucide-react";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { fields, loading } = useFields();
  const navigate = useNavigate();

  const stats = {
    total: fields.length,
    atRisk: fields.filter(f => f.status === 'AT RISK').length,
    completed: fields.filter(f => f.status === 'COMPLETED').length,
    active: fields.filter(f => f.status === 'ACTIVE').length,
  }
  if(loading){
    return <div className="flex justify-center p-20">Loading Fields...</div>;
  }
  return(
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-800">Welcome to SmartSeason Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium px-3 py-1 bg-green-100 text-green-800 rounded-full">
            {user?.role}
          </span>
          <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        {/* Statistics Cards (Requirement #6: Summary View) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Fields" value={stats.total} icon={<LayoutGrid />} color="blue" />
          <StatCard title="At Risk" value={stats.atRisk} icon={<AlertTriangle />} color="red" />
          <StatCard title="Active" value={stats.active} icon={<Sprout />} color="green" />
          <StatCard title="Completed" value={stats.completed} icon={<CheckCircle2 />} color="gray" />
        </div>

        {/* Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map(field => (
            <div key={field.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">{field.name}</h3>
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                  field.status === 'AT RISK' ? 'bg-red-100 text-red-700' : 
                  field.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {field.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Crop: {field.crop_type}</p>
              <p className="text-sm text-gray-600 mb-4">Stage: {field.current_stage}</p>
              <div className="pt-4 border-t flex justify-between items-center">
                <span className="text-xs text-gray-400">Agent: {field.assigned_agent_name}</span>
                <button onClick={() => navigate(`/field/${field.id}`)} className="text-green-600 text-sm font-semibold hover:text-green-700">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

// Simple StatCard Helper Component
const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-l-green-600">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg text-green-600 bg-green-50`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;