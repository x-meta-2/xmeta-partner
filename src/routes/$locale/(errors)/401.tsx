import { createFileRoute } from '@tanstack/react-router';

import { UnauthorizedPage } from '#/features/errors/unauthorized';

export const Route = createFileRoute('/$locale/(errors)/401')({
  component: UnauthorizedPage,
});
