import { createFileRoute } from '@tanstack/react-router';

import { ForbiddenPage } from '#/features/errors/forbidden';

export const Route = createFileRoute('/$locale/(errors)/403')({
  component: ForbiddenPage,
});
