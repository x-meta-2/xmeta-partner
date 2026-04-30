import { createFileRoute } from '@tanstack/react-router';

import { ServerErrorPage } from '#/features/errors/server-error';

export const Route = createFileRoute('/$locale/(errors)/500')({
  component: ServerErrorPage,
});
