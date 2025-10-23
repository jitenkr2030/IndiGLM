import { NextRequest, NextResponse } from 'next/server';
import { getIndiGLMService } from '@/lib/indiglm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('user_id');
    const timeRange = searchParams.get('time_range') || '7d';
    const metricType = searchParams.get('metric_type');

    const indiglmService = getIndiGLMService({
      apiKey: process.env.INDIGLM_API_KEY,
      enableCulturalContext: true
    });

    switch (action) {
      case 'usage':
        return await getUsageAnalytics(indiglmService, timeRange, userId);
      
      case 'performance':
        return await getPerformanceAnalytics(indiglmService, timeRange);
      
      case 'languages':
        return await getLanguageAnalytics(indiglmService, timeRange);
      
      case 'features':
        return await getFeatureAnalytics(indiglmService, timeRange);
      
      case 'cultural':
        return await getCulturalAnalytics(indiglmService, timeRange);
      
      case 'regional':
        return await getRegionalAnalytics(indiglmService, timeRange);
      
      case 'user':
        if (!userId) {
          return NextResponse.json(
            { error: 'user_id parameter is required for user analytics' },
            { status: 400 }
          );
        }
        return await getUserAnalytics(indiglmService, userId, timeRange);
      
      case 'system':
        return await getSystemAnalytics(indiglmService);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error during analytics processing',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

async function getUsageAnalytics(indiglmService, timeRange, userId) {
  const usageData = await indiglmService.getUsageData({
    timeRange: timeRange,
    userId: userId
  });

  return NextResponse.json({
    success: true,
    analytics_type: 'usage',
    time_range: timeRange,
    data: {
      total_api_calls: usageData.totalCalls,
      unique_users: usageData.uniqueUsers,
      average_calls_per_user: usageData.averageCallsPerUser,
      peak_usage_times: usageData.peakUsageTimes,
      usage_trend: usageData.usageTrend,
      daily_breakdown: usageData.dailyBreakdown,
      hourly_breakdown: usageData.hourlyBreakdown
    },
    metadata: {
      api_version: 'v1',
      service: 'indiglm-analytics',
      generated_at: new Date().toISOString()
    }
  });
}

async function getPerformanceAnalytics(indiglmService, timeRange) {
  const performanceData = await indiglmService.getPerformanceData({
    timeRange: timeRange
  });

  return NextResponse.json({
    success: true,
    analytics_type: 'performance',
    time_range: timeRange,
    data: {
      average_response_time: performanceData.averageResponseTime,
      p95_response_time: performanceData.p95ResponseTime,
      p99_response_time: performanceData.p99ResponseTime,
      uptime_percentage: performanceData.uptimePercentage,
      error_rate: performanceData.errorRate,
      throughput: performanceData.throughput,
      performance_trend: performanceData.performanceTrend,
      latency_distribution: performanceData.latencyDistribution
    },
    metadata: {
      api_version: 'v1',
      service: 'indiglm-analytics',
      generated_at: new Date().toISOString()
    }
  });
}

async function getLanguageAnalytics(indiglmService, timeRange) {
  const languageData = await indiglmService.getLanguageData({
    timeRange: timeRange
  });

  return NextResponse.json({
    success: true,
    analytics_type: 'languages',
    time_range: timeRange,
    data: {
      language_distribution: languageData.languageDistribution,
      top_languages: languageData.topLanguages,
      language_growth_trends: languageData.languageGrowthTrends,
      script_usage: languageData.scriptUsage,
      code_switching_frequency: languageData.codeSwitchingFrequency,
      regional_dialect_usage: languageData.regionalDialectUsage
    },
    metadata: {
      api_version: 'v1',
      service: 'indiglm-analytics',
      generated_at: new Date().toISOString()
    }
  });
}

async function getFeatureAnalytics(indiglmService, timeRange) {
  const featureData = await indiglmService.getFeatureData({
    timeRange: timeRange
  });

  return NextResponse.json({
    success: true,
    analytics_type: 'features',
    time_range: timeRange,
    data: {
      feature_usage: featureData.featureUsage,
      feature_popularity: featureData.featurePopularity,
      feature_adoption_rate: featureData.featureAdoptionRate,
      user_retention_by_feature: featureData.userRetentionByFeature,
      feature_performance_metrics: featureData.featurePerformanceMetrics
    },
    metadata: {
      api_version: 'v1',
      service: 'indiglm-analytics',
      generated_at: new Date().toISOString()
    }
  });
}

async function getCulturalAnalytics(indiglmService, timeRange) {
  const culturalData = await indiglmService.getCulturalData({
    timeRange: timeRange
  });

  return NextResponse.json({
    success: true,
    analytics_type: 'cultural',
    time_range: timeRange,
    data: {
      cultural_context_accuracy: culturalData.culturalContextAccuracy,
      cultural_element_recognition: culturalData.culturalElementRecognition,
      regional_understanding_scores: culturalData.regionalUnderstandingScores,
      festival_awareness_usage: culturalData.festivalAwarenessUsage,
      cultural_adaptation_success: culturalData.culturalAdaptationSuccess,
      traditional_customs_handling: culturalData.traditionalCustomsHandling
    },
    metadata: {
      api_version: 'v1',
      service: 'indiglm-analytics',
      generated_at: new Date().toISOString()
    }
  });
}

async function getRegionalAnalytics(indiglmService, timeRange) {
  const regionalData = await indiglmService.getRegionalData({
    timeRange: timeRange
  });

  return NextResponse.json({
    success: true,
    analytics_type: 'regional',
    time_range: timeRange,
    data: {
      user_distribution_by_region: regionalData.userDistributionByRegion,
      regional_usage_patterns: regionalData.regionalUsagePatterns,
      regional_language_preferences: regionalData.regionalLanguagePreferences,
      regional_feature_adoption: regionalData.regionalFeatureAdoption,
      cultural_context_by_region: regionalData.culturalContextByRegion
    },
    metadata: {
      api_version: 'v1',
      service: 'indiglm-analytics',
      generated_at: new Date().toISOString()
    }
  });
}

async function getUserAnalytics(indiglmService, userId, timeRange) {
  const userData = await indiglmService.getUserData({
    userId: userId,
    timeRange: timeRange
  });

  return NextResponse.json({
    success: true,
    analytics_type: 'user',
    user_id: userId,
    time_range: timeRange,
    data: {
      user_activity_summary: userData.userActivitySummary,
      feature_usage_by_user: userData.featureUsageByUser,
      language_preferences: userData.languagePreferences,
      cultural_context_usage: userData.culturalContextUsage,
      personalization_effectiveness: userData.personalizationEffectiveness,
      interaction_history: userData.interactionHistory,
      user_satisfaction_metrics: userData.userSatisfactionMetrics
    },
    metadata: {
      api_version: 'v1',
      service: 'indiglm-analytics',
      generated_at: new Date().toISOString()
    }
  });
}

async function getSystemAnalytics(indiglmService) {
  const systemData = await indiglmService.getSystemData();

  return NextResponse.json({
    success: true,
    analytics_type: 'system',
    data: {
      system_health: systemData.systemHealth,
      component_status: systemData.componentStatus,
      resource_utilization: systemData.resourceUtilization,
      active_connections: systemData.activeConnections,
      queue_status: systemData.queueStatus,
      cache_performance: systemData.cachePerformance,
      database_metrics: systemData.databaseMetrics,
      api_endpoint_status: systemData.apiEndpointStatus
    },
    metadata: {
      api_version: 'v1',
      service: 'indiglm-analytics',
      generated_at: new Date().toISOString()
    }
  });
}