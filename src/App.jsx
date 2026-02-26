
import React, { useState, useEffect } from 'react';

// --- ROLES Configuration ---
const ROLES = {
  CUSTOMER: 'Customer',
  SUPPORT_AGENT: 'Support Agent',
  SUPPORT_MANAGER: 'Support Manager',
  TECHNICAL_TEAM: 'Technical Team',
  ADMIN: 'Admin',
};

// Define permissions for each role
const ROLE_PERMISSIONS = {
  [ROLES.CUSTOMER]: {
    canCreateTicket: true,
    canViewOwnTickets: true,
    canEditOwnTickets: true, // Limited editing (e.g., add comments)
    canViewAllTickets: false,
    canViewAuditLogs: false,
    canManageUsers: false,
    canEditAnyTicket: false,
    canAssignTicket: false,
    canCloseTicket: false,
    canAccessAdmin: false,
  },
  [ROLES.SUPPORT_AGENT]: {
    canCreateTicket: true,
    canViewOwnTickets: true,
    canViewAllTickets: true,
    canEditOwnTickets: true,
    canEditAnyTicket: true,
    canAssignTicket: true,
    canCloseTicket: true,
    canViewAuditLogs: true,
    canManageUsers: false,
    canAccessAdmin: false,
  },
  [ROLES.SUPPORT_MANAGER]: {
    canCreateTicket: true,
    canViewOwnTickets: true,
    canViewAllTickets: true,
    canEditOwnTickets: true,
    canEditAnyTicket: true,
    canAssignTicket: true,
    canCloseTicket: true,
    canViewAuditLogs: true,
    canManageUsers: false,
    canAccessAdmin: false,
    canExportData: true,
  },
  [ROLES.TECHNICAL_TEAM]: {
    canCreateTicket: false,
    canViewOwnTickets: false,
    canViewAllTickets: true, // View all relevant tickets (e.g., escalated to tech)
    canEditOwnTickets: false,
    canEditAnyTicket: true,
    canAssignTicket: false,
    canCloseTicket: false,
    canViewAuditLogs: true,
    canManageUsers: false,
    canAccessAdmin: false,
  },
  [ROLES.ADMIN]: {
    canCreateTicket: true,
    canViewOwnTickets: true,
    canViewAllTickets: true,
    canEditOwnTickets: true,
    canEditAnyTicket: true,
    canAssignTicket: true,
    canCloseTicket: true,
    canViewAuditLogs: true,
    canManageUsers: true,
    canAccessAdmin: true,
    canExportData: true,
  },
};

// --- Sample Data ---
const TICKET_STATUS = {
  APPROVED: 'APPROVED',
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  EXCEPTION: 'EXCEPTION',
  CLOSED: 'CLOSED',
};

const SAMPLE_TICKETS = [
  {
    id: 'TKT-001',
    title: 'Login issue on production system',
    status: TICKET_STATUS.IN_PROGRESS,
    priority: 'High',
    agent: 'Alice Johnson',
    customer: 'Global Corp',
    createdDate: '2023-10-26T10:00:00Z',
    lastUpdate: '2023-10-27T14:30:00Z',
    description: 'Users are unable to log in to the production application. Affects all regions. Critical business impact.',
    slaDue: '2023-10-27T18:00:00Z',
    milestones: [
      { id: 1, name: 'New Request', status: 'completed', date: '2023-10-26T10:00:00Z', sla: '2023-10-26T11:00:00Z' },
      { id: 2, name: 'Assigned to Agent', status: 'completed', date: '2023-10-26T10:15:00Z', sla: '2023-10-26T12:00:00Z' },
      { id: 3, name: 'Diagnosis', status: 'current', date: '2023-10-27T11:00:00Z', sla: '2023-10-27T15:00:00Z' },
      { id: 4, name: 'Resolution', status: 'pending', date: null, sla: '2023-10-27T18:00:00Z' },
      { id: 5, name: 'Verification', status: 'pending', date: null, sla: '2023-10-27T19:00:00Z' },
      { id: 6, name: 'Closed', status: 'pending', date: null, sla: '2023-10-27T20:00:00Z' },
    ],
    auditLog: [
      { timestamp: '2023-10-26T10:00:00Z', user: 'Global Corp Customer', message: 'Ticket created by customer.' },
      { timestamp: '2023-10-26T10:05:00Z', user: 'System', message: 'Ticket priority set to High.' },
      { timestamp: '2023-10-26T10:15:00Z', user: 'System', message: 'Ticket assigned to Alice Johnson.' },
      { timestamp: '2023-10-27T14:30:00Z', user: 'Alice Johnson', message: 'Requested additional logs from customer.' },
    ],
    relatedRecords: [
      { id: 'CUST-005', type: 'Customer Account', title: 'Global Corp Profile' },
      { id: 'DOC-010', type: 'Knowledge Base', title: 'Login Troubleshooting Guide' },
    ],
  },
  {
    id: 'TKT-002',
    title: 'Feature request: Add custom reporting',
    status: TICKET_STATUS.PENDING,
    priority: 'Low',
    agent: 'Bob Williams',
    customer: 'Small Biz Inc.',
    createdDate: '2023-10-25T09:00:00Z',
    lastUpdate: '2023-10-25T09:15:00Z',
    description: 'Customer requested ability to create custom reports with specific data fields.',
    slaDue: '2023-11-01T17:00:00Z',
    milestones: [
      { id: 1, name: 'New Request', status: 'completed', date: '2023-10-25T09:00:00Z', sla: '2023-10-25T10:00:00Z' },
      { id: 2, name: 'Assigned to Agent', status: 'completed', date: '2023-10-25T09:15:00Z', sla: '2023-10-25T11:00:00Z' },
      { id: 3, name: 'Review Requirement', status: 'current', date: '2023-10-25T09:30:00Z', sla: '2023-10-26T17:00:00Z' },
      { id: 4, name: 'Estimate Effort', status: 'pending', date: null, sla: '2023-10-27T17:00:00Z' },
      { id: 5, name: 'Approved for Dev', status: 'pending', date: null, sla: '2023-10-28T17:00:00Z' },
      { id: 6, name: 'Implemented', status: 'pending', date: null, sla: '2023-10-30T17:00:00Z' },
      { id: 7, name: 'Closed', status: 'pending', date: null, sla: '2023-11-01T17:00:00Z' },
    ],
    auditLog: [
      { timestamp: '2023-10-25T09:00:00Z', user: 'Small Biz Customer', message: 'Ticket created by customer.' },
      { timestamp: '2023-10-25T09:10:00Z', user: 'System', message: 'Ticket priority set to Low.' },
      { timestamp: '2023-10-25T09:15:00Z', user: 'System', message: 'Ticket assigned to Bob Williams.' },
    ],
    relatedRecords: [
      { id: 'CUST-010', type: 'Customer Account', title: 'Small Biz Inc. Profile' },
    ],
  },
  {
    id: 'TKT-003',
    title: 'Email notification not received',
    status: TICKET_STATUS.APPROVED,
    priority: 'Medium',
    agent: 'Alice Johnson',
    customer: 'Tech Solutions Ltd.',
    createdDate: '2023-10-24T15:00:00Z',
    lastUpdate: '2023-10-24T16:00:00Z',
    description: 'User reported not receiving email notifications for status updates.',
    slaDue: '2023-10-26T10:00:00Z',
    milestones: [
      { id: 1, name: 'New Request', status: 'completed', date: '2023-10-24T15:00:00Z', sla: '2023-10-24T16:00:00Z' },
      { id: 2, name: 'Assigned to Agent', status: 'completed', date: '2023-10-24T15:10:00Z', sla: '2023-10-24T17:00:00Z' },
      { id: 3, name: 'Diagnosis', status: 'completed', date: '2023-10-24T15:45:00Z', sla: '2023-10-25T10:00:00Z' },
      { id: 4, name: 'Resolution', status: 'completed', date: '2023-10-24T16:00:00Z', sla: '2023-10-26T10:00:00Z' },
      { id: 5, name: 'Verification', status: 'current', date: '2023-10-24T16:15:00Z', sla: '2023-10-26T11:00:00Z' },
      { id: 6, name: 'Closed', status: 'pending', date: null, sla: '2023-10-26T12:00:00Z' },
    ],
    auditLog: [
      { timestamp: '2023-10-24T15:00:00Z', user: 'Tech Solutions Customer', message: 'Ticket created.' },
      { timestamp: '2023-10-24T15:05:00Z', user: 'System', message: 'Ticket assigned to Alice Johnson.' },
      { timestamp: '2023-10-24T16:00:00Z', user: 'Alice Johnson', message: 'Confirmed issue, applied fix. Awaiting user verification.' },
    ],
    relatedRecords: [],
  },
  {
    id: 'TKT-004',
    title: 'User Interface Glitch on Safari Browser',
    status: TICKET_STATUS.EXCEPTION,
    priority: 'High',
    agent: 'Charlie Davis',
    customer: 'Creative Minds Agency',
    createdDate: '2023-10-23T11:30:00Z',
    lastUpdate: '2023-10-26T09:00:00Z',
    description: 'Specific UI elements appear misaligned or disappear entirely when accessed via Safari on macOS. Affects key operational workflows.',
    slaDue: '2023-10-27T12:00:00Z',
    milestones: [
      { id: 1, name: 'New Request', status: 'completed', date: '2023-10-23T11:30:00Z', sla: '2023-10-23T12:30:00Z' },
      { id: 2, name: 'Assigned to Agent', status: 'completed', date: '2023-10-23T11:45:00Z', sla: '2023-10-23T13:00:00Z' },
      { id: 3, name: 'Diagnosis', status: 'completed', date: '2023-10-23T16:00:00Z', sla: '2023-10-24T10:00:00Z' },
      { id: 4, name: 'Escalated to Tech Team', status: 'current', date: '2023-10-24T10:15:00Z', sla: '2023-10-25T10:00:00Z' },
      { id: 5, name: 'Root Cause Analysis', status: 'current', date: '2023-10-25T14:00:00Z', sla: '2023-10-26T10:00:00Z' },
      { id: 6, name: 'Resolution Plan', status: 'pending', date: null, sla: '2023-10-26T14:00:00Z' },
      { id: 7, name: 'Implementation', status: 'pending', date: null, sla: '2023-10-27T10:00:00Z' },
      { id: 8, name: 'Verification & Closure', status: 'pending', date: null, sla: '2023-10-27T12:00:00Z' },
    ],
    auditLog: [
      { timestamp: '2023-10-23T11:30:00Z', user: 'Creative Minds Customer', message: 'Ticket created.' },
      { timestamp: '2023-10-23T11:45:00Z', user: 'System', message: 'Ticket assigned to Charlie Davis.' },
      { timestamp: '2023-10-24T10:15:00Z', user: 'Charlie Davis', message: 'Escalated to Technical Team for browser compatibility issue.' },
      { timestamp: '2023-10-26T09:00:00Z', user: 'Technical Team', message: 'Identified potential CSS conflict with Safari rendering engine.' },
    ],
    relatedRecords: [
      { id: 'CUST-015', type: 'Customer Account', title: 'Creative Minds Profile' },
      { id: 'DOC-020', type: 'Bug Report', title: 'Safari UI Bug Report' },
    ],
  },
  {
    id: 'TKT-005',
    title: 'Data Export Functionality Failure',
    status: TICKET_STATUS.REJECTED,
    priority: 'Medium',
    agent: 'Dana Miller',
    customer: 'Data Insights Co.',
    createdDate: '2023-10-22T08:00:00Z',
    lastUpdate: '2023-10-23T10:00:00Z',
    description: 'Attempted to export data to CSV, but the process failed with an unspecific error message. This is critical for end-of-month reporting.',
    slaDue: '2023-10-24T10:00:00Z',
    milestones: [
      { id: 1, name: 'New Request', status: 'completed', date: '2023-10-22T08:00:00Z', sla: '2023-10-22T09:00:00Z' },
      { id: 2, name: 'Assigned to Agent', status: 'completed', date: '2023-10-22T08:15:00Z', sla: '2023-10-22T10:00:00Z' },
      { id: 3, name: 'Diagnosis', status: 'completed', date: '2023-10-22T11:00:00Z', sla: '2023-10-23T09:00:00Z' },
      { id: 4, name: 'Resolution Attempt', status: 'completed', date: '2023-10-22T14:00:00Z', sla: '2023-10-23T12:00:00Z' },
      { id: 5, name: 'Rejected - User Error', status: 'current', date: '2023-10-23T10:00:00Z', sla: '2023-10-23T10:00:00Z' },
      { id: 6, name: 'Closed', status: 'pending', date: null, sla: '2023-10-23T11:00:00Z' },
    ],
    auditLog: [
      { timestamp: '2023-10-22T08:00:00Z', user: 'Data Insights Customer', message: 'Ticket created: Data Export Failure.' },
      { timestamp: '2023-10-22T08:15:00Z', user: 'System', message: 'Ticket assigned to Dana Miller.' },
      { timestamp: '2023-10-23T09:00:00Z', user: 'Dana Miller', message: 'Performed steps to replicate. Found user was attempting to export with unsaved filters.' },
      { timestamp: '2023-10-23T10:00:00Z', user: 'Dana Miller', message: 'Ticket status updated to REJECTED. Advised customer to save filters before export.' },
    ],
    relatedRecords: [
      { id: 'CUST-020', type: 'Customer Account', title: 'Data Insights Co. Profile' },
      { id: 'KB-001', type: 'Knowledge Base', title: 'Exporting Data Guide' },
    ],
  },
  {
    id: 'TKT-006',
    title: 'Account Unlock Request',
    status: TICKET_STATUS.CLOSED,
    priority: 'Low',
    agent: 'Bob Williams',
    customer: 'Secure Solutions',
    createdDate: '2023-10-20T10:00:00Z',
    lastUpdate: '2023-10-20T10:15:00Z',
    description: 'Customer account locked due to multiple failed login attempts. Requesting unlock.',
    slaDue: '2023-10-20T11:00:00Z',
    milestones: [
      { id: 1, name: 'New Request', status: 'completed', date: '2023-10-20T10:00:00Z', sla: '2023-10-20T10:10:00Z' },
      { id: 2, name: 'Assigned to Agent', status: 'completed', date: '2023-10-20T10:05:00Z', sla: '2023-10-20T10:15:00Z' },
      { id: 3, name: 'Account Unlocked', status: 'completed', date: '2023-10-20T10:10:00Z', sla: '2023-10-20T10:30:00Z' },
      { id: 4, name: 'Closed', status: 'completed', date: '2023-10-20T10:15:00Z', sla: '2023-10-20T11:00:00Z' },
    ],
    auditLog: [
      { timestamp: '2023-10-20T10:00:00Z', user: 'Secure Solutions Customer', message: 'Account unlock request submitted.' },
      { timestamp: '2023-10-20T10:05:00Z', user: 'System', message: 'Ticket assigned to Bob Williams.' },
      { timestamp: '2023-10-20T10:10:00Z', user: 'Bob Williams', message: 'Account unlocked for user.' },
      { timestamp: '2023-10-20T10:15:00Z', user: 'Bob Williams', message: 'Ticket closed after successful resolution.' },
    ],
    relatedRecords: [],
  },
];

const SAMPLE_KPIS = [
  { id: 'kpi1', label: 'Total Tickets', value: 1250, trend: '+5%', type: 'up' },
  { id: 'kpi2', label: 'Open Tickets', value: 345, trend: '-2%', type: 'down' },
  { id: 'kpi3', label: 'Avg. Resolution Time', value: '3.2h', trend: '+15%', type: 'up' },
  { id: 'kpi4', label: 'SLA Met Rate', value: '92%', trend: '+1%', type: 'up' },
];

const ChartComponent = ({ type, title, data }) => (
  <div className="chart-container" style={{ gridColumn: type === 'large' ? 'span 2' : 'span 1' }}>
    <p>{title} ({type} Chart Placeholder)</p>
  </div>
);

const App = () => {
  const [view, setView] = useState({ screen: 'DASHBOARD', params: {} });
  const [currentUser, setCurrentUser] = useState({ id: 1, name: 'John Doe', role: ROLES.SUPPORT_MANAGER }); // Default user
  const [tickets, setTickets] = useState(SAMPLE_TICKETS);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  const permissions = ROLE_PERMISSIONS[currentUser.role];

  const handleCardClick = (screen, params = {}) => {
    setView(prev => ({ ...prev, screen, params }));
  };

  const handleGoBack = () => {
    if (view.screen === 'TICKET_DETAIL') {
      setView(prev => ({ ...prev, screen: 'DASHBOARD', params: {} }));
    } else {
      setView(prev => ({ ...prev, screen: 'DASHBOARD', params: {} })); // Fallback to dashboard
    }
  };

  const handleAction = (actionType, ticketId) => {
    console.log(`${actionType} action triggered for ticket ${ticketId}`);
    // In a real app, this would dispatch API calls and update state
    setTickets(prevTickets =>
      prevTickets.map(ticket => {
        if (ticket.id === ticketId) {
          // Example: Update status for 'Assign' action
          if (actionType === 'Assign' && permissions.canAssignTicket) {
            return {
              ...ticket,
              status: TICKET_STATUS.IN_PROGRESS, // Simulate assignment update
              lastUpdate: new Date().toISOString(),
              auditLog: [
                ...ticket.auditLog,
                { timestamp: new Date().toISOString(), user: currentUser.name, message: `Ticket assigned / updated by ${currentUser.name}.` }
              ]
            };
          }
          if (actionType === 'Close' && permissions.canCloseTicket) {
            return {
              ...ticket,
              status: TICKET_STATUS.CLOSED,
              lastUpdate: new Date().toISOString(),
              auditLog: [
                ...ticket.auditLog,
                { timestamp: new Date().toISOString(), user: currentUser.name, message: `Ticket closed by ${currentUser.name}.` }
              ]
            };
          }
          if (actionType === 'Edit' && permissions.canEditAnyTicket) {
            // Navigate to an edit form, for simplicity, just log for now
            alert(`Opening edit form for ${ticketId}`);
          }
        }
        return ticket;
      })
    );
  };

  const renderStatusLabel = (status) => {
    let statusClass = '';
    switch (status) {
      case TICKET_STATUS.APPROVED: statusClass = 'status-APPROVED'; break;
      case TICKET_STATUS.IN_PROGRESS: statusClass = 'status-IN_PROGRESS'; break;
      case TICKET_STATUS.PENDING: statusClass = 'status-PENDING'; break;
      case TICKET_STATUS.REJECTED: statusClass = 'status-REJECTED'; break;
      case TICKET_STATUS.EXCEPTION: statusClass = 'status-EXCEPTION'; break;
      case TICKET_STATUS.CLOSED: statusClass = 'status-CLOSED'; break;
      default: statusClass = 'status-PENDING'; break;
    }
    return <span className={`ticket-status-label ${statusClass}`}>{status.replace('_', ' ')}</span>;
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const calculateSlaBreach = (milestoneSla, milestoneStatus) => {
    if (milestoneStatus === 'completed') return false; // SLA irrelevant if completed
    if (!milestoneSla) return false;
    const slaDate = new Date(milestoneSla);
    const now = new Date();
    return slaDate < now;
  };

  // Components for App.jsx
  const KPIcard = ({ kpi }) => (
    <div className="card kpi-card" style={{ cursor: 'default' }}>
      <div className="kpi-label">{kpi.label}</div>
      <div className="kpi-value">{kpi.value}</div>
      <div className={`kpi-trend ${kpi.type}`}>
        {kpi.type === 'up' ? '▲' : '▼'} {kpi.trend} vs. last period
      </div>
    </div>
  );

  const TicketSummaryCard = ({ ticket }) => (
    <div className="card ticket-summary-card" onClick={() => handleCardClick('TICKET_DETAIL', { ticketId: ticket.id })}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="ticket-title">{ticket.title}</h3>
        {renderStatusLabel(ticket.status)}
      </div>
      <p className="ticket-meta">ID: {ticket.id} | Priority: {ticket.priority} | Agent: {ticket.agent}</p>
      <p className="ticket-meta">Customer: {ticket.customer} | Last Update: {formatDateTime(ticket.lastUpdate)}</p>
    </div>
  );

  const Breadcrumbs = ({ path }) => (
    <div className="breadcrumbs">
      <span onClick={() => handleGoBack()}>Dashboard</span>
      {path.map((item, index) => (
        <span key={index} onClick={item.onClick}>{item.label}</span>
      ))}
    </div>
  );

  const MilestoneTracker = ({ milestones }) => {
    return (
      <div className="milestone-tracker">
        <h4 className="section-heading">Workflow Progress</h4>
        <div className="milestone-tracker-steps">
          {milestones?.map((step, index) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';
            const isBreached = calculateSlaBreach(step.sla, step.status);
            return (
              <div key={step.id} className={`milestone-step ${step.status}`}>
                <div className={`milestone-step-icon ${isCompleted ? 'completed' : isCurrent ? 'current' : 'pending'}`}>
                  {isCompleted ? '✓' : isCurrent ? '⚡' : index + 1}
                </div>
                {index < milestones.length - 1 && <div className="milestone-step-connector"></div>}
                <span className="milestone-step-text">{step.name}</span>
                {step.date && <span className="milestone-sla-due">({formatDateTime(step.date)})</span>}
                {step.sla && !isCompleted && <span className={`milestone-sla-due ${isBreached ? 'milestone-sla-breach' : ''}`}>SLA: {formatDateTime(step.sla)}</span>}
                {isBreached && <span className="milestone-sla-due milestone-sla-breach">(Breached)</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const AuditFeed = ({ auditLog, userRole }) => {
    const canViewLogs = permissions.canViewAuditLogs;
    if (!canViewLogs) return null; // Role-based visibility

    return (
      <div className="audit-feed-card">
        <h4 className="section-heading">News / Audit Feed</h4>
        <div className="audit-feed-list">
          {auditLog?.length > 0 ? (
            auditLog.map((log, index) => (
              <div key={index} className="audit-item">
                <span className="audit-timestamp">{formatDateTime(log.timestamp)}</span>
                <span className="audit-message"><strong>{log.user}</strong>: {log.message}</span>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No audit entries found.</p>
          )}
        </div>
      </div>
    );
  };

  const RelatedRecords = ({ records }) => (
    <div className="related-records-card">
      <h4 className="section-heading">Related Records</h4>
      <div className="related-records-grid">
        {records?.length > 0 ? (
          records.map(record => (
            <div key={record.id} className="related-record-card">
              <p><strong>{record.title}</strong></p>
              <small>{record.type} ({record.id})</small>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>No related records.</p>
        )}
      </div>
    </div>
  );

  const GlobalSearchInput = ({ searchTerm, setSearchTerm }) => (
    <div className="global-search-container glassmorphism">
      <input
        type="text"
        placeholder="Global Search (tickets, customers...)"
        className="global-search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );

  // Main render logic based on view state
  const renderScreen = () => {
    switch (view.screen) {
      case 'DASHBOARD':
        const filteredTickets = tickets.filter(ticket =>
          ticket.id.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
          ticket.title.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
          ticket.customer.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
          ticket.agent.toLowerCase().includes(globalSearchTerm.toLowerCase())
        );

        return (
          <>
            <h2 className="dashboard-section-title">Key Performance Indicators</h2>
            <div className="dashboard-grid">
              {SAMPLE_KPIS.map(kpi => <KPIcard key={kpi.id} kpi={kpi} />)}
              <ChartComponent type="Bar" title="Ticket Volume by Priority" data={{ /*...*/ }} />
              <ChartComponent type="Line" title="Resolution Times Trend" data={{ /*...*/ }} />
              <ChartComponent type="Donut" title="Open Tickets by Status" data={{ /*...*/ }} />
              <ChartComponent type="Gauge" title="SLA Compliance" data={{ /*...*/ }} />
            </div>

            <h2 className="dashboard-section-title" style={{ marginTop: 'var(--spacing-xl)' }}>Active Tickets</h2>
            <div className="dashboard-grid">
              {filteredTickets.length > 0 ? (
                filteredTickets.map(ticket => <TicketSummaryCard key={ticket.id} ticket={ticket} />)
              ) : (
                <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                  <span className="empty-state-icon">📄</span>
                  <h3 className="empty-state-title">No Tickets Found</h3>
                  <p className="empty-state-description">
                    It looks like there are no tickets matching your search criteria or filters.
                    Try adjusting your search or create a new ticket.
                  </p>
                  {permissions.canCreateTicket && (
                    <button className="button button-primary" onClick={() => alert('Navigate to Ticket Creation Form')}>
                      Create New Ticket
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        );

      case 'TICKET_DETAIL':
        const currentTicket = tickets.find(t => t.id === view.params.ticketId);

        if (!currentTicket) {
          return (
            <div className="empty-state">
              <span className="empty-state-icon">⚠️</span>
              <h3 className="empty-state-title">Ticket Not Found</h3>
              <p className="empty-state-description">The ticket you are looking for does not exist or you do not have permission to view it.</p>
              <button className="button button-primary" onClick={handleGoBack}>Back to Dashboard</button>
            </div>
          );
        }

        return (
          <div className="detail-view-container">
            <Breadcrumbs path={[{ label: `Ticket ${currentTicket.id}`, onClick: () => {} }]} />
            <div className="detail-view-header">
              <h1 className="detail-view-title">{currentTicket.title}</h1>
              <div className="flex-row align-center" style={{ gap: 'var(--spacing-md)' }}>
                {renderStatusLabel(currentTicket.status)}
                <button className="button button-secondary" onClick={handleGoBack}>Back</button>
              </div>
            </div>

            <div className="record-summary-grid">
              <div className="record-summary-main">
                <div className="record-summary-details">
                  <h4 className="section-heading">Summary</h4>
                  <div className="detail-item"><span className="detail-label">ID:</span> <span className="detail-value">{currentTicket.id}</span></div>
                  <div className="detail-item"><span className="detail-label">Customer:</span> <span className="detail-value">{currentTicket.customer}</span></div>
                  <div className="detail-item"><span className="detail-label">Agent:</span> <span className="detail-value">{currentTicket.agent}</span></div>
                  <div className="detail-item"><span className="detail-label">Priority:</span> <span className="detail-value">{currentTicket.priority}</span></div>
                  <div className="detail-item"><span className="detail-label">Created:</span> <span className="detail-value">{formatDateTime(currentTicket.createdDate)}</span></div>
                  <div className="detail-item"><span className="detail-label">Last Update:</span> <span className="detail-value">{formatDateTime(currentTicket.lastUpdate)}</span></div>
                  <div className="detail-item"><span className="detail-label">SLA Due:</span> <span className="detail-value">{formatDateTime(currentTicket.slaDue)}</span></div>
                  <div style={{ marginTop: 'var(--spacing-md)' }}>
                    <p style={{ fontWeight: '600', marginBottom: 'var(--spacing-xs)', color: 'var(--text-secondary)' }}>Description:</p>
                    <p className="detail-value">{currentTicket.description}</p>
                  </div>
                </div>

                {permissions.canEditAnyTicket && (
                  <div className="action-buttons">
                    <button
                      className="button button-secondary"
                      onClick={() => handleAction('Edit', currentTicket.id)}
                      disabled={!permissions.canEditAnyTicket}
                    >
                      Edit Ticket
                    </button>
                    <button
                      className="button button-primary"
                      onClick={() => handleAction('Assign', currentTicket.id)}
                      disabled={!permissions.canAssignTicket || currentTicket.status === TICKET_STATUS.CLOSED}
                    >
                      Assign / Reassign
                    </button>
                    <button
                      className="button button-danger"
                      onClick={() => handleAction('Close', currentTicket.id)}
                      disabled={!permissions.canCloseTicket || currentTicket.status === TICKET_STATUS.CLOSED}
                    >
                      Close Ticket
                    </button>
                  </div>
                )}
              </div>

              <div className="record-summary-sidebar">
                <MilestoneTracker milestones={currentTicket.milestones} />
                <AuditFeed auditLog={currentTicket.auditLog} userRole={currentUser.role} />
                <RelatedRecords records={currentTicket.relatedRecords} />
              </div>
            </div>
          </div>
        );

      case 'ADMIN_SETTINGS':
        return (
          <div className="detail-view-container">
            <h1 className="detail-view-title">Admin Settings</h1>
            <p>Admin settings panel. (Role: {currentUser.role})</p>
            {!permissions.canAccessAdmin && <p>You do not have permission to access this section.</p>}
            <button className="button button-secondary" onClick={handleGoBack}>Back to Dashboard</button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <div className="header glassmorphism">
        <div className="header-title">Customer Support Dashboard</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <span>Welcome, {currentUser.name} ({currentUser.role})</span>
          {permissions.canAccessAdmin && (
            <button
              className="button button-secondary"
              onClick={() => handleCardClick('ADMIN_SETTINGS')}
              style={{ marginLeft: 'var(--spacing-md)' }}
            >
              Admin
            </button>
          )}
        </div>
      </div>
      <GlobalSearchInput searchTerm={globalSearchTerm} setSearchTerm={setGlobalSearchTerm} />
      {renderScreen()}
    </div>
  );
};

export default App;