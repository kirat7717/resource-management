export const DASHBOARD_DATA = {
  metrics: {
    totalResources: 12,
    runningResources: 8,
    stoppedResources: 3,
    errorsOrDegraded: 1
  },
  resourceTypeDistribution: [
    { type: 'Virtual Machine', count: 5 },
    { type: 'Database', count: 3 },
    { type: 'Storage', count: 2 },
    { type: 'Function', count: 2 }
  ],
  regionDistribution: [
    { regionId: '660c2134567890abcdef1357', region: 'Mumbai', count: 5 },
    { regionId: '660c2134567890abcdef1358', region: 'East US', count: 4 },
    { regionId: '660c2134567890abcdef1359', region: 'West Europe', count: 2 },
    { regionId: '660c2134567890abcdef1360', region: 'Singapore', count: 1 }
  ],
  recentActivity: [
    {
      id: '660c2134567890abcdef9001',
      action: 'start',
      resourceId: '660c2134567890abcdef8001',
      details: {
        previousStatus: 'stopped',
        newStatus: 'running'
      },
      createdAt: '2026-09-25T11:45:00.000Z'
    },
    {
      id: '660c2134567890abcdef9002',
      action: 'stop',
      resourceId: '660c2134567890abcdef8002',
      details: {
        previousStatus: 'running',
        newStatus: 'stopped'
      },
      createdAt: '2026-09-25T11:10:00.000Z'
    },
    {
      id: '660c2134567890abcdef9003',
      action: 'create',
      resourceId: '660c2134567890abcdef8003',
      details: {
        name: 'prod-analytics-db'
      },
      createdAt: '2026-09-25T10:30:00.000Z'
    },
    {
      id: '660c2134567890abcdef9004',
      action: 'delete',
      resourceId: '660c2134567890abcdef8004',
      details: {
        name: 'staging-temp-vm'
      },
      createdAt: '2026-09-25T09:15:00.000Z'
    },
    {
      id: '660c2134567890abcdef9005',
      action: 'start',
      resourceId: '660c2134567890abcdef8005',
      details: {
        previousStatus: 'stopped',
        newStatus: 'running'
      },
      createdAt: '2026-09-25T08:00:00.000Z'
    }
  ]
};
