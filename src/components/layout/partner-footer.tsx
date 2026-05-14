import { useI18n } from '#/i18n/context';

export function PartnerFooter() {
  const { t } = useI18n();

  return (
    <footer className="mt-10 border-t bg-background/60">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row xl:px-8">
        <span>{t('landing:footer.copyright')}</span>
        <div className="flex items-center gap-4">
          <a
            href="https://support.x-meta.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            {t('landing:footer.help')}
          </a>
          <a
            href="https://x-meta.com/terms"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            {t('landing:footer.terms')}
          </a>
          <a
            href="https://x-meta.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            {t('landing:footer.privacy')}
          </a>
        </div>
      </div>
    </footer>
  );
}
