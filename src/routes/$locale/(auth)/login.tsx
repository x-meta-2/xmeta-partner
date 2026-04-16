import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { LoginPage } from '#/features/auth/login'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export type LoginSearch = z.infer<typeof searchSchema>

export const Route = createFileRoute('/$locale/(auth)/login')({
  validateSearch: searchSchema,
  component: LoginPage,
})
