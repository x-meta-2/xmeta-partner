import { createFileRoute } from '@tanstack/react-router'

import { NotFoundPage } from '#/features/errors/not-found'

export const Route = createFileRoute('/$locale/(errors)/404')({
  component: NotFoundPage,
})
