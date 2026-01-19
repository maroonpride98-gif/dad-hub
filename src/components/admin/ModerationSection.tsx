import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAdmin } from '../../context/AdminContext';
import { Card, Button } from '../common';
import { ContentReport, ReportStatus } from '../../types';

export const ModerationSection: React.FC = () => {
  const { theme } = useTheme();
  const { reports, reportsLoading, fetchReports, resolveReport, dismissReport, deleteContent } =
    useAdmin();
  const [activeFilter, setActiveFilter] = useState<ReportStatus | 'all'>('pending');

  const filteredReports =
    activeFilter === 'all' ? reports : reports.filter((r) => r.status === activeFilter);

  const handleFilterChange = (filter: ReportStatus | 'all') => {
    setActiveFilter(filter);
    if (filter === 'all') {
      fetchReports();
    } else {
      fetchReports(filter);
    }
  };

  if (reportsLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <span style={{ fontSize: '32px' }}>⏳</span>
        <p style={{ color: theme.colors.text.muted }}>Loading reports...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {(['pending', 'resolved', 'dismissed', 'all'] as const).map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? 'primary' : 'secondary'}
            size="small"
            onClick={() => handleFilterChange(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
            {filter === 'pending' && (
              <span style={{ marginLeft: '4px' }}>
                ({reports.filter((r) => r.status === 'pending').length})
              </span>
            )}
          </Button>
        ))}
      </div>

      {filteredReports.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <span style={{ fontSize: '48px' }}>✅</span>
          <h3 style={{ margin: '16px 0 8px' }}>No Reports</h3>
          <p style={{ color: theme.colors.text.muted, margin: 0 }}>
            {activeFilter === 'pending'
              ? 'All caught up! No pending reports to review.'
              : `No ${activeFilter} reports found.`}
          </p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onResolve={resolveReport}
              onDismiss={dismissReport}
              onDeleteContent={deleteContent}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ReportCardProps {
  report: ContentReport;
  onResolve: (id: string, resolution: string) => Promise<void>;
  onDismiss: (id: string) => Promise<void>;
  onDeleteContent: (contentId: string, contentType: string) => Promise<void>;
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onResolve,
  onDismiss,
  onDeleteContent,
}) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const getReasonEmoji = (reason: string): string => {
    const emojiMap: Record<string, string> = {
      spam: '📧',
      harassment: '😠',
      inappropriate: '🔞',
      misinformation: '❌',
      other: '❓',
    };
    return emojiMap[reason] || '❓';
  };

  const getStatusColor = (status: ReportStatus): string => {
    const colorMap: Record<ReportStatus, string> = {
      pending: theme.colors.accent.secondary,
      reviewed: '#3b82f6',
      resolved: theme.colors.success,
      dismissed: theme.colors.text.muted,
    };
    return colorMap[status];
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDeleteContent(report.contentId, report.contentType);
      await onResolve(report.id, 'Content deleted');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWarn = async () => {
    setIsLoading(true);
    try {
      await onResolve(report.id, 'Warning issued to author');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = async () => {
    setIsLoading(true);
    try {
      await onDismiss(report.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '12px',
        }}
      >
        <div>
          <span
            style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: '8px',
              background: `${getStatusColor(report.status)}20`,
              color: getStatusColor(report.status),
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginRight: '8px',
            }}
          >
            {report.status}
          </span>
          <span style={{ color: theme.colors.text.muted, fontSize: '13px' }}>
            {report.contentType} | Reported {report.createdAt.toLocaleDateString()}
          </span>
        </div>
        <span style={{ fontSize: '20px' }}>{getReasonEmoji(report.reason)}</span>
      </div>

      <div
        style={{
          padding: '12px',
          background: theme.colors.background.tertiary,
          borderRadius: '8px',
          marginBottom: '12px',
        }}
      >
        <p style={{ margin: 0, fontStyle: 'italic', color: theme.colors.text.secondary }}>
          "{report.contentPreview}"
        </p>
      </div>

      <div style={{ fontSize: '13px', color: theme.colors.text.muted, marginBottom: '12px' }}>
        <p style={{ margin: '0 0 4px' }}>
          <strong>Reason:</strong> {report.reason}
          {report.description && ` - "${report.description}"`}
        </p>
        <p style={{ margin: 0 }}>
          <strong>Author:</strong> {report.authorName} | <strong>Reported by:</strong>{' '}
          {report.reportedByName}
        </p>
      </div>

      {report.status === 'pending' && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            paddingTop: '12px',
            borderTop: `1px solid ${theme.colors.border}`,
          }}
        >
          <Button variant="danger" size="small" onClick={handleDelete} disabled={isLoading}>
            🗑️ Delete Content
          </Button>
          <Button variant="success" size="small" onClick={handleWarn} disabled={isLoading}>
            ⚠️ Warn Author
          </Button>
          <Button variant="secondary" size="small" onClick={handleDismiss} disabled={isLoading}>
            ✖️ Dismiss
          </Button>
        </div>
      )}

      {report.status === 'resolved' && report.resolution && (
        <p
          style={{
            margin: 0,
            padding: '8px 12px',
            background: `${theme.colors.success}15`,
            borderRadius: '8px',
            fontSize: '13px',
            color: theme.colors.success,
          }}
        >
          <strong>Resolution:</strong> {report.resolution}
        </p>
      )}
    </Card>
  );
};
