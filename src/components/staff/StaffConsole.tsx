import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchHousekeepingTasksApi, updateHousekeepingStatusApi, type HousekeepingTaskDTO } from '../../api/housekeeping';
import { fetchMaintenanceRequestsApi, updateMaintenanceStatusApi, type MaintenanceRequestDTO } from '../../api/maintenance';
import { fetchGuestRequestsApi, updateGuestRequestStatusApi, type GuestRequestDTO } from '../../api/guestRequests';
import { CheckCircle2, Play, Check, Loader2 } from 'lucide-react';

export const StaffConsole: React.FC = () => {
  const { addToast, refetchTrigger } = useApp();
  const [activeTab, setActiveTab] = useState<'All' | 'Housekeeping' | 'Maintenance' | 'Requests'>('All');
  
  const [hkTasks, setHkTasks] = useState<HousekeepingTaskDTO[]>([]);
  const [maintRequests, setMaintRequests] = useState<MaintenanceRequestDTO[]>([]);
  const [guestReqs, setGuestReqs] = useState<GuestRequestDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [hk, maint, reqs] = await Promise.all([
        fetchHousekeepingTasksApi().catch(() => []),
        fetchMaintenanceRequestsApi().catch(() => []),
        fetchGuestRequestsApi().catch(() => [])
      ]);
      setHkTasks(hk);
      setMaintRequests(maint);
      setGuestReqs(reqs);
    } catch (err) {
      console.error('Failed loading staff operations data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refetchTrigger]);

  const handleUpdateHkStatus = async (id: string, status: string) => {
    try {
      await updateHousekeepingStatusApi(id, status);
      addToast('success', 'Task Updated', `Housekeeping status updated to ${status}`);
      loadData();
    } catch (err) {
      addToast('danger', 'Update Failed', 'Could not update housekeeping task status');
    }
  };

  const handleUpdateMaintStatus = async (id: string, status: string) => {
    try {
      await updateMaintenanceStatusApi(id, status);
      addToast('success', 'Request Updated', `Maintenance status updated to ${status}`);
      loadData();
    } catch (err) {
      addToast('danger', 'Update Failed', 'Could not update maintenance status');
    }
  };

  const handleUpdateGuestReqStatus = async (id: string, status: string) => {
    try {
      await updateGuestRequestStatusApi(id, status);
      addToast('success', 'Request Updated', `Guest request status updated to ${status}`);
      loadData();
    } catch (err) {
      addToast('danger', 'Update Failed', 'Could not update guest request status');
    }
  };

  const allTasksCount = hkTasks.length + maintRequests.length + guestReqs.length;
  const highPriorityCount = hkTasks.filter(t => t.priority === 'HIGH').length + maintRequests.filter(m => m.priority === 'HIGH').length;
  const activeCount = hkTasks.filter(t => t.status === 'IN_PROGRESS').length + maintRequests.filter(m => m.status === 'IN_PROGRESS').length;
  const completedCount = hkTasks.filter(t => t.status === 'COMPLETED').length + maintRequests.filter(m => m.status === 'RESOLVED').length;

  return (
    <div style={{ maxWidth: '1320px', margin: '40px auto 80px auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <span className="badge-gold">STAFF OPERATIONS CONSOLE • STAYSPHERE GRAND BENGALURU</span>
        <h1 className="font-serif" style={{ fontSize: '2.4rem', marginTop: '6px' }}>
          Operations Command & Tasks
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Real-time housekeeping workflow, engineering maintenance, and digital guest service tasks.
        </p>
      </div>

      {/* TODAY TASK METRICS BAR */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', letterSpacing: '0.1em' }}>TOTAL TASKS</span>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
            {allTasksCount} Tasks
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--status-danger)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--status-danger)', letterSpacing: '0.1em' }}>HIGH PRIORITY</span>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f87171', marginTop: '4px' }}>
            {highPriorityCount} Urgent
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--status-warning)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--status-warning)', letterSpacing: '0.1em' }}>IN PROGRESS</span>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fbbf24', marginTop: '4px' }}>
            {activeCount} Active
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--status-success)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--status-success)', letterSpacing: '0.1em' }}>RESOLVED</span>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>
            {completedCount} Done
          </div>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        {['All', 'Housekeeping', 'Maintenance', 'Requests'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: activeTab === tab ? 600 : 400,
              background: activeTab === tab ? 'var(--accent-gold)' : 'var(--bg-surface)',
              color: activeTab === tab ? '#0b0c0e' : 'var(--text-secondary)',
              border: activeTab === tab ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#d4af37' }} />
          <p>Syncing staff tasks with database...</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '24px'
        }}>
          {/* HOUSEKEEPING TASKS */}
          {(activeTab === 'All' || activeTab === 'Housekeeping') && hkTasks.map((task) => (
            <div
              key={task.id}
              className="glass-card"
              style={{
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: task.priority === 'HIGH' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                    ROOM {task.room?.room_number || '204'}
                  </span>

                  <span className="badge-gold" style={{ fontSize: '0.7rem' }}>
                    HOUSEKEEPING
                  </span>
                </div>

                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {task.task_type.replace(/_/g, ' ')}
                </h4>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {task.description || 'Standard room cleaning and restock.'}
                </p>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: '20px' }}>
                  Reported: {new Date(task.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: task.status === 'COMPLETED' ? '#34d399' : task.status === 'IN_PROGRESS' ? '#fbbf24' : '#9ca3af' }}>
                  STATUS: {task.status}
                </span>

                {task.status === 'PENDING' && (
                  <button onClick={() => handleUpdateHkStatus(task.id, 'IN_PROGRESS')} className="btn-gold" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                    <Play size={14} /> Start Task
                  </button>
                )}

                {task.status === 'IN_PROGRESS' && (
                  <button onClick={() => handleUpdateHkStatus(task.id, 'COMPLETED')} className="btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem', borderColor: '#34d399', color: '#34d399' }}>
                    <Check size={14} /> Complete & Clear Room
                  </button>
                )}

                {task.status === 'COMPLETED' && (
                  <span style={{ fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={16} /> Room Available
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* MAINTENANCE TASKS */}
          {(activeTab === 'All' || activeTab === 'Maintenance') && maintRequests.map((maint) => (
            <div
              key={maint.id}
              className="glass-card"
              style={{
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f87171' }}>
                    ROOM {maint.room?.room_number || '217'}
                  </span>

                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f87171', background: 'rgba(239,68,68,0.15)', padding: '3px 8px', borderRadius: '4px' }}>
                    MAINTENANCE
                  </span>
                </div>

                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {maint.issue_type.replace(/_/g, ' ')}
                </h4>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {maint.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: maint.status === 'RESOLVED' ? '#34d399' : '#fbbf24' }}>
                  STATUS: {maint.status}
                </span>

                {maint.status === 'PENDING' && (
                  <button onClick={() => handleUpdateMaintStatus(maint.id, 'IN_PROGRESS')} className="btn-gold" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                    <Play size={14} /> Start Repair
                  </button>
                )}

                {maint.status === 'IN_PROGRESS' && (
                  <button onClick={() => handleUpdateMaintStatus(maint.id, 'RESOLVED')} className="btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem', borderColor: '#34d399', color: '#34d399' }}>
                    <Check size={14} /> Resolve Issue
                  </button>
                )}

                {maint.status === 'RESOLVED' && (
                  <span style={{ fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={16} /> Resolved
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* GUEST SERVICE REQUESTS */}
          {(activeTab === 'All' || activeTab === 'Requests') && guestReqs.map((greq) => (
            <div
              key={greq.id}
              className="glass-card"
              style={{
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                    ROOM {greq.room?.room_number || '304'}
                  </span>

                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#38bdf8', background: 'rgba(56,189,248,0.15)', padding: '3px 8px', borderRadius: '4px' }}>
                    GUEST REQUEST
                  </span>
                </div>

                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {greq.request_type.replace(/_/g, ' ')}
                </h4>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {greq.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: greq.status === 'COMPLETED' ? '#34d399' : '#fbbf24' }}>
                  STATUS: {greq.status}
                </span>

                {greq.status !== 'COMPLETED' ? (
                  <button onClick={() => handleUpdateGuestReqStatus(greq.id, 'COMPLETED')} className="btn-gold" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                    <Check size={14} /> Complete Request
                  </button>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={16} /> Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
