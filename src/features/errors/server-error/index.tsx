import { useRouter } from '@tanstack/react-router'
import { AlertTriangle, RotateCcw } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { LocalizedLink } from '#/components/common/localized-link'
import { useI18n } from '#/i18n/context'

export const ServerErrorPage = () => {
  const { t } = useI18n()
  const router = useRouter()

  return (
    <div className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10">
        <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>
      <div className="space-y-2">
        <div className="text-5xl font-bold text-red-500">500</div>
        <h1 className="text-2xl font-bold">
          {t('errors:serverError.title', 'Системийн алдаа')}
        </h1>
        <p className="max-w-md text-muted-foreground">
          {t(
            'errors:serverError.description',
            'Хүсэлтийг боловсруулах явцад алдаа гарлаа. Түр хүлээгээд дахин оролдоно уу.',
          )}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" onClick={() => router.invalidate()}>
          <RotateCcw className="mr-2 h-4 w-4" />
          {t('common:retry', 'Дахин оролдох')}
        </Button>
        <Button asChild>
          <LocalizedLink to="/">
            {t('common:home', 'Нүүр хуудас')}
          </LocalizedLink>
        </Button>
      </div>
    </div>
  )
}
