import posthog from 'posthog-js';

type ClientEnv = {
  readonly DEV?: boolean;
  readonly NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?: string;
  readonly NEXT_PUBLIC_POSTHOG_HOST?: string;
};

const viteEnv = (import.meta as ImportMeta & { readonly env?: ClientEnv }).env;
const projectToken =
  viteEnv?.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ??
  (typeof process !== 'undefined'
    ? process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
    : undefined);
const host =
  viteEnv?.NEXT_PUBLIC_POSTHOG_HOST ??
  (typeof process !== 'undefined'
    ? process.env.NEXT_PUBLIC_POSTHOG_HOST
    : undefined);
const isDevelopment =
  viteEnv?.DEV ??
  (typeof process !== 'undefined' && process.env.NODE_ENV === 'development');

if (!projectToken || !host) {
  if (isDevelopment) {
    const missingVariable = projectToken
      ? 'NEXT_PUBLIC_POSTHOG_HOST'
      : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';

    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  posthog.init(projectToken, {
    api_host: host,
    defaults: '2026-01-30',
    capture_exceptions: true,
    debug: isDevelopment,
  });
}

export function capture(
  event: string,
  properties?: Record<string, string | number | boolean>,
) {
  if (projectToken && host) posthog.capture(event, properties);
}

export function captureException(error: Error) {
  if (projectToken && host) posthog.captureException(error);
}
