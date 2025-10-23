import { NextRequest, NextResponse } from 'next/server';
import { getIndiGLMService } from '@/lib/indiglm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    const indiglmService = getIndiGLMService({
      apiKey: process.env.INDIGLM_API_KEY,
      enableCulturalContext: true
    });

    switch (action) {
      case 'health':
        return await getSystemHealth(indiglmService);
      
      case 'metrics':
        return await getSystemMetrics(indiglmService);
      
      case 'alerts':
        return await getSystemAlerts(indiglmService);
      
      case 'status':
        return await getSystemStatus(indiglmService);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Monitoring error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error during monitoring',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

async function getSystemHealth(indiglmService) {
  const healthData = await indiglmService.getSystemHealth();

  return NextResponse.json({
    success: true,
    monitoring_type: 'health',
    data: {
      overall_status: healthData.overallStatus,
      component_health: healthData.componentHealth,
      last_health_check: healthData.lastHealthCheck,
      uptime: healthData.uptime,
      response_time: healthData.responseTime,
      error_rate: healthData.errorRate,
      active_connections: healthData.activeConnections
    },
    metadata: {
      api_version: 'v1',
      service: 'indiglm-monitoring',
      generated_at: new Date().toISOString()
    }
  });
}

async function getSystemMetrics(indiglmService) {
  const metricsData = await indiglmService.getSystemMetrics();

  return NextResponse.json({
    success: true,
    monitoring_type: 'metrics',
    data: {
      performance_metrics: metricsData.performanceMetrics,
      resource_metrics: metricsData.resourceMetrics,
      api_metrics: metricsData.apiMetrics,
      database_metrics: metricsData.databaseMetrics,
      cache_metrics: metricsData.cacheMetrics,
      network_metrics: metricsData.networkMetrics
    },
    metadata: {
      api_version: 'v1',
      service: 'indiglm-monitoring',
      generated_at: new Date().toISOString()
    }
  });
}

async function getSystemAlerts(indiglmService) {
  const alertsData = await indiglmService.getSystemAlerts();

  return NextResponse.json({
    success: true,
    monitoring_type: 'alerts',
    data: {
      active_alerts: alertsData.activeAlerts,
      alert_history: alertsData.alertHistory,
      alert_summary: alertsData.alertSummary,
      alert_statistics: alertsData.alertStatistics
    },
    metadata: {
      api_version: 'v1',
      service: 'indiglm-monitoring',
      generated_at: new Date().toISOString()
    }
  });
}

async function getSystemStatus(indiglmService) {
  const statusData = await indiglmService.getSystemStatus();

  return NextResponse.json({
    success: true,
    monitoring_type: 'status',
    data: {
      system_status: statusData.systemStatus,
      service_status: statusData.serviceStatus,
      database_status: statusData.databaseStatus,
      cache_status: statusData.cacheStatus,
      queue_status: statusData.queueStatus,
      external_service_status: statusData.externalServiceStatus,
      maintenance_mode: statusData.maintenanceMode,
      version_info: statusData.versionInfo
    },
    metadata: {
      api_version: 'v1',
      service: 'indiglm-monitoring',
      generated_at: new Date().toISOString()
    }
  });
}