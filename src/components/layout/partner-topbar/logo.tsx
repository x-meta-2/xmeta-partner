import { LocalizedLink } from '#/components/common/localized-link';

export function Logo() {
  return (
    <LocalizedLink to="/dashboard/overview" className="flex items-center gap-2">
      <img
        src="/assets/logo/logo-light.svg"
        alt="X-Meta"
        width={92}
        className="block dark:hidden"
      />
      <img
        src="/assets/logo/logo-dark.svg"
        alt="X-Meta"
        width={92}
        className="hidden dark:block"
      />
      <span className="hidden rounded-md bg-primary-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary sm:inline-block">
        Partner
      </span>
    </LocalizedLink>
  );
}
