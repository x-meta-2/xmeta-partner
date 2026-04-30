import { createFileRoute } from '@tanstack/react-router';
import { PerformanceStatisticsPage } from '#/features/partner/performance';

export const Route = createFileRoute(
  '/$locale/_authenticated/dashboard/performance',
)({
  component: PerformanceStatisticsPage,
});
