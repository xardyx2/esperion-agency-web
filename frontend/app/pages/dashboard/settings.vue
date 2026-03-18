<template>
  <div class="space-y-8">
    <DashboardPageHeader
      eyebrow="Configuration"
      :title="t('dashboard.settings.title')"
      :description="t('dashboard.settings.seo.description')"
    />

    <section class="space-y-6">
      <!-- Analytics Section -->
      <UCard
        :ui="{
          root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
          header: 'border-b border-es-border/70 px-6 py-5 dark:border-es-border-dark/70',
          body: 'px-6 py-5'
        }"
      >
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.22em] text-es-text-secondary dark:text-es-text-secondary-dark">
                  {{ t('dashboard.settings.analytics.title') }}
                </p>
                <h2 class="mt-1 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                  {{ t('dashboard.settings.analytics.title') }}
                </h2>
              </div>
              <UDashboardHelpTooltip
                title="Analytics Integrations"
                description="Connect third-party analytics tools to track website performance. GA4 provides traffic insights, Clarity records user sessions, and Meta/TikTok pixels track ad conversions."
              />
            </div>
            <NuxtLink
              to="/dashboard/analytics"
              class="text-sm font-medium text-es-accent-primary dark:text-es-accent-primary-dark hover:underline"
            >{{ t('dashboard.settings.analytics.openAnalytics') }}</NuxtLink>
          </div>
        </template>

        <div class="space-y-8">
          <!-- Analytics Integrations -->
          <div class="space-y-4">
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">{{ t('dashboard.settings.analytics.ga4Id') }}</label>
                <input
                  v-model="analyticsSettings.integrations.ga4_measurement_id"
                  type="text"
                  :placeholder="t('dashboard.settings.analytics.ga4Placeholder')"
                  class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">{{ t('dashboard.settings.analytics.gtmId') }}</label>
                <input
                  v-model="analyticsSettings.integrations.gtm_container_id"
                  type="text"
                  :placeholder="t('dashboard.settings.analytics.gtmPlaceholder')"
                  class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">{{ t('dashboard.settings.analytics.clarityId') }}</label>
                <input
                  v-model="analyticsSettings.integrations.clarity_project_id"
                  type="text"
                  :placeholder="t('dashboard.settings.analytics.clarityPlaceholder')"
                  class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">{{ t('dashboard.settings.analytics.metaPixelId') }}</label>
                <input
                  v-model="analyticsSettings.integrations.meta_pixel_id"
                  type="text"
                  :placeholder="t('dashboard.settings.analytics.metaPixelPlaceholder')"
                  class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">{{ t('dashboard.settings.analytics.tiktokPixelId') }}</label>
                <input
                  v-model="analyticsSettings.integrations.tiktok_pixel_id"
                  type="text"
                  :placeholder="t('dashboard.settings.analytics.tiktokPlaceholder')"
                  class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">{{ t('dashboard.settings.analytics.linkedinPartnerId') }}</label>
                <input
                  v-model="analyticsSettings.integrations.linkedin_partner_id"
                  type="text"
                  :placeholder="t('dashboard.settings.analytics.linkedinPlaceholder')"
                  class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
                >
              </div>
              <div class="md:col-span-2">
                <label class="inline-flex items-center gap-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                  <input
                    v-model="analyticsSettings.integrations.enabled"
                    type="checkbox"
                    class="h-4 w-4"
                  > {{ t('dashboard.settings.analytics.enableTracking') }}
                </label>
              </div>
            </div>
          </div>

          <!-- Consent Section -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.settings.consent.title') }}
              </h3>
              <span
                v-if="analyticsSettings.consent_required"
                class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700"
              >
                {{ t('dashboard.settings.consent.statusEnabled') }}
              </span>
              <span
                v-else
                class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
              >
                {{ t('dashboard.settings.consent.statusDisabled') }}
              </span>
            </div>

            <!-- Consent Required Toggle -->
            <div class="rounded-xl border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark p-5 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
                    {{ t('dashboard.settings.consent.requireConsent') }}
                  </p>
                  <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark mt-1">
                    {{ t('dashboard.settings.consent.requireConsentDesc') }}
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="analyticsSettings.consent_required"
                    type="checkbox"
                    class="sr-only peer"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-es-accent-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-es-accent-primary" />
                </label>
              </div>

              <!-- Consent Tiers Configuration -->
              <div
                v-if="analyticsSettings.consent_required"
                class="space-y-4 pt-4 border-t border-es-border dark:border-es-border-dark"
              >
                <p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
                  {{ t('dashboard.settings.consent.tiersTitle') }}
                </p>

                <!-- Essential Tier (Locked) -->
                <div class="rounded-xl bg-es-bg-secondary dark:bg-es-bg-secondary-dark p-4 border border-es-border dark:border-es-border-dark">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full bg-es-accent-primary/10 flex items-center justify-center">
                        <svg
                          class="w-5 h-5 text-es-accent-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
                          {{ t('dashboard.settings.consent.tiers.essential.title') }}
                        </p>
                        <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                          {{ t('dashboard.settings.consent.tiers.essential.description') }}
                        </p>
                      </div>
                    </div>
                    <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {{ t('dashboard.settings.consent.tiers.required') }}
                    </span>
                  </div>
                </div>

                <!-- Analytics Tier -->
                <div class="rounded-xl bg-es-bg-secondary dark:bg-es-bg-secondary-dark p-4 border border-es-border dark:border-es-border-dark">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                          class="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
                          {{ t('dashboard.settings.consent.tiers.analytics.title') }}
                        </p>
                        <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                          {{ t('dashboard.settings.consent.tiers.analytics.description') }}
                        </p>
                      </div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        v-model="analyticsSettings.consent_tiers.analytics.enabled"
                        type="checkbox"
                        class="sr-only peer"
                      >
                      <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                    </label>
                  </div>
                  <div class="flex items-center gap-2 text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{{ t('dashboard.settings.consent.tiers.analytics.trackers') }}</span>
                  </div>
                </div>

                <!-- Functional Tier -->
                <div class="rounded-xl bg-es-bg-secondary dark:bg-es-bg-secondary-dark p-4 border border-es-border dark:border-es-border-dark">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                        <svg
                          class="w-5 h-5 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
                          {{ t('dashboard.settings.consent.tiers.functional.title') }}
                        </p>
                        <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                          {{ t('dashboard.settings.consent.tiers.functional.description') }}
                        </p>
                      </div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        v-model="analyticsSettings.consent_tiers.functional.enabled"
                        type="checkbox"
                        class="sr-only peer"
                      >
                      <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
                    </label>
                  </div>
                  <div class="flex items-center gap-2 text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{{ t('dashboard.settings.consent.tiers.functional.trackers') }}</span>
                  </div>
                </div>

                <!-- Marketing Tier -->
                <div class="rounded-xl bg-es-bg-secondary dark:bg-es-bg-secondary-dark p-4 border border-es-border dark:border-es-border-dark">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center">
                        <svg
                          class="w-5 h-5 text-pink-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
                          {{ t('dashboard.settings.consent.tiers.marketing.title') }}
                        </p>
                        <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                          {{ t('dashboard.settings.consent.tiers.marketing.description') }}
                        </p>
                      </div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        v-model="analyticsSettings.consent_tiers.marketing.enabled"
                        type="checkbox"
                        class="sr-only peer"
                      >
                      <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-600" />
                    </label>
                  </div>
                  <div class="flex items-center gap-2 text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{{ t('dashboard.settings.consent.tiers.marketing.trackers') }}</span>
                  </div>
                </div>
              </div>

              <!-- Default Consent Values -->
              <div
                v-if="analyticsSettings.consent_required && analyticsSettings.consent_tiers"
                class="space-y-3 pt-4 border-t border-es-border dark:border-es-border-dark"
              >
                <p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
                  {{ t('dashboard.settings.consent.defaultsTitle') }}
                </p>
                <div class="grid gap-3 md:grid-cols-2">
                  <label class="inline-flex items-center gap-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                    <input
                      v-model="analyticsSettings.consent_tiers.analytics.default_value"
                      type="checkbox"
                      class="h-4 w-4 rounded border-gray-300 text-es-accent-primary focus:ring-es-accent-primary"
                    >
                    {{ t('dashboard.settings.consent.defaults.analytics') }}
                  </label>
                  <label class="inline-flex items-center gap-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                    <input
                      v-model="analyticsSettings.consent_tiers.functional.default_value"
                      type="checkbox"
                      class="h-4 w-4 rounded border-gray-300 text-es-accent-primary focus:ring-es-accent-primary"
                    >
                    {{ t('dashboard.settings.consent.defaults.functional') }}
                  </label>
                  <label class="inline-flex items-center gap-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                    <input
                      v-model="analyticsSettings.consent_tiers.marketing.default_value"
                      type="checkbox"
                      class="h-4 w-4 rounded border-gray-300 text-es-accent-primary focus:ring-es-accent-primary"
                    >
                    {{ t('dashboard.settings.consent.defaults.marketing') }}
                  </label>
                </div>
              </div>

              <!-- Tracker Assignment -->
              <div
                v-if="analyticsSettings.consent_required && analyticsSettings.tracker_consent_rules"
                class="space-y-3 pt-4 border-t border-es-border dark:border-es-border-dark"
              >
                <p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
                  {{ t('dashboard.settings.consent.trackersTitle') }}
                </p>
                <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                  {{ t('dashboard.settings.consent.trackersDesc') }}
                </p>
                <div class="grid gap-3 md:grid-cols-2">
                  <div>
                    <label class="block text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark mb-1">
                      {{ t('dashboard.settings.consent.trackers.ga4') }}
                    </label>
                    <select
                      v-model="analyticsSettings.tracker_consent_rules.ga4"
                      class="w-full px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark text-sm"
                    >
                      <option value="essential">
                        {{ t('dashboard.settings.consent.tiers.essential.title') }}
                      </option>
                      <option value="analytics">
                        {{ t('dashboard.settings.consent.tiers.analytics.title') }}
                      </option>
                      <option value="functional">
                        {{ t('dashboard.settings.consent.tiers.functional.title') }}
                      </option>
                      <option value="marketing">
                        {{ t('dashboard.settings.consent.tiers.marketing.title') }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark mb-1">
                      {{ t('dashboard.settings.consent.trackers.gtm') }}
                    </label>
                    <select
                      v-model="analyticsSettings.tracker_consent_rules.gtm"
                      class="w-full px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark text-sm"
                    >
                      <option value="essential">
                        {{ t('dashboard.settings.consent.tiers.essential.title') }}
                      </option>
                      <option value="analytics">
                        {{ t('dashboard.settings.consent.tiers.analytics.title') }}
                      </option>
                      <option value="functional">
                        {{ t('dashboard.settings.consent.tiers.functional.title') }}
                      </option>
                      <option value="marketing">
                        {{ t('dashboard.settings.consent.tiers.marketing.title') }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark mb-1">
                      {{ t('dashboard.settings.consent.trackers.clarity') }}
                    </label>
                    <select
                      v-model="analyticsSettings.tracker_consent_rules.clarity"
                      class="w-full px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark text-sm"
                    >
                      <option value="essential">
                        {{ t('dashboard.settings.consent.tiers.essential.title') }}
                      </option>
                      <option value="analytics">
                        {{ t('dashboard.settings.consent.tiers.analytics.title') }}
                      </option>
                      <option value="functional">
                        {{ t('dashboard.settings.consent.tiers.functional.title') }}
                      </option>
                      <option value="marketing">
                        {{ t('dashboard.settings.consent.tiers.marketing.title') }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark mb-1">
                      {{ t('dashboard.settings.consent.trackers.meta') }}
                    </label>
                    <select
                      v-model="analyticsSettings.tracker_consent_rules.meta_pixel"
                      class="w-full px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark text-sm"
                    >
                      <option value="essential">
                        {{ t('dashboard.settings.consent.tiers.essential.title') }}
                      </option>
                      <option value="analytics">
                        {{ t('dashboard.settings.consent.tiers.analytics.title') }}
                      </option>
                      <option value="functional">
                        {{ t('dashboard.settings.consent.tiers.functional.title') }}
                      </option>
                      <option value="marketing">
                        {{ t('dashboard.settings.consent.tiers.marketing.title') }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark mb-1">
                      {{ t('dashboard.settings.consent.trackers.tiktok') }}
                    </label>
                    <select
                      v-model="analyticsSettings.tracker_consent_rules.tiktok_pixel"
                      class="w-full px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark text-sm"
                    >
                      <option value="essential">
                        {{ t('dashboard.settings.consent.tiers.essential.title') }}
                      </option>
                      <option value="analytics">
                        {{ t('dashboard.settings.consent.tiers.analytics.title') }}
                      </option>
                      <option value="functional">
                        {{ t('dashboard.settings.consent.tiers.functional.title') }}
                      </option>
                      <option value="marketing">
                        {{ t('dashboard.settings.consent.tiers.marketing.title') }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark mb-1">
                      {{ t('dashboard.settings.consent.trackers.linkedin') }}
                    </label>
                    <select
                      v-model="analyticsSettings.tracker_consent_rules.linkedin"
                      class="w-full px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark text-sm"
                    >
                      <option value="essential">
                        {{ t('dashboard.settings.consent.tiers.essential.title') }}
                      </option>
                      <option value="analytics">
                        {{ t('dashboard.settings.consent.tiers.analytics.title') }}
                      </option>
                      <option value="functional">
                        {{ t('dashboard.settings.consent.tiers.functional.title') }}
                      </option>
                      <option value="marketing">
                        {{ t('dashboard.settings.consent.tiers.marketing.title') }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Funnels Section -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.settings.funnels.title') }}
              </h3>
              <button
                type="button"
                class="text-sm font-medium text-es-accent-primary dark:text-es-accent-primary-dark"
                @click="addFunnel"
              >
                {{ t('dashboard.settings.funnels.add') }}
              </button>
            </div>
            <div class="space-y-3">
              <div
                v-for="(funnel, funnelIndex) in analyticsSettings.funnels"
                :key="funnel.id + funnelIndex"
                class="rounded-xl border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark p-4 space-y-3"
              >
                <div class="grid gap-3 md:grid-cols-3">
                  <input
                    v-model="funnel.id"
                    type="text"
                    :placeholder="t('dashboard.settings.funnels.idPlaceholder')"
                    class="px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                  >
                  <input
                    v-model="funnel.name"
                    type="text"
                    :placeholder="t('dashboard.settings.funnels.namePlaceholder')"
                    class="px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                  >
                  <label class="inline-flex items-center gap-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                    <input
                      v-model="funnel.active"
                      type="checkbox"
                      class="h-4 w-4"
                    > {{ t('dashboard.settings.funnels.active') }}
                  </label>
                </div>
                <input
                  v-model="funnel.description"
                  type="text"
                  :placeholder="t('dashboard.settings.funnels.descriptionPlaceholder')"
                  class="w-full px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                >
                <div class="space-y-2">
                  <div
                    v-for="(step, stepIndex) in funnel.steps"
                    :key="`${funnel.id}-${stepIndex}`"
                    class="grid gap-2 md:grid-cols-4"
                  >
                    <input
                      v-model="step.name"
                      type="text"
                      :placeholder="t('dashboard.settings.funnels.steps.namePlaceholder')"
                      class="px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                    >
                    <input
                      v-model="step.event_name"
                      type="text"
                      :placeholder="t('dashboard.settings.funnels.steps.eventNamePlaceholder')"
                      class="px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                    >
                    <input
                      v-model="step.path"
                      type="text"
                      :placeholder="t('dashboard.settings.funnels.steps.pathPlaceholder')"
                      class="px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                    >
                    <div class="flex items-center justify-between gap-2">
                      <input
                        v-model.number="step.order"
                        type="number"
                        min="1"
                        class="w-full px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                      >
                      <button
                        type="button"
                        class="text-xs font-medium text-red-600"
                        @click="removeFunnelStep(funnelIndex, stepIndex)"
                      >
                        {{ t('dashboard.settings.funnels.steps.remove') }}
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="text-sm font-medium text-es-accent-primary dark:text-es-accent-primary-dark"
                    @click="addFunnelStep(funnelIndex)"
                  >
                    {{ t('dashboard.settings.funnels.steps.add') }}
                  </button>
                </div>
                <button
                  type="button"
                  class="text-sm font-medium text-red-600"
                  @click="removeFunnel(funnelIndex)"
                >
                  {{ t('dashboard.settings.funnels.removeFunnel') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Analytics Save Button -->
          <div class="flex justify-end pt-4 border-t border-es-border dark:border-es-border-dark">
            <button
              class="px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
              :disabled="analyticsSaving"
              @click="saveAnalyticsSettings"
            >
              {{ analyticsSaving ? t('dashboard.settings.saveInProgress') : t('dashboard.settings.analyticsSaveButton') }}
            </button>
          </div>
        </div>
      </UCard>

      <!-- Backup Section -->
      <UCard
        :ui="{
          root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
          header: 'border-b border-es-border/70 px-6 py-5 dark:border-es-border-dark/70',
          body: 'px-6 py-5'
        }"
      >
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-es-text-secondary dark:text-es-text-secondary-dark">
                Backup & Recovery
              </p>
              <h2 class="mt-1 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                {{ t('dashboard.settings.backup.title') }}
              </h2>
            </div>
            <button
              type="button"
              class="px-4 py-2 rounded-lg border border-es-border dark:border-es-border-dark text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors"
              :disabled="backupLoading"
              @click="refreshBackupData"
            >
              {{ t('dashboard.settings.backup.refreshButton') }}
            </button>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Backup Settings -->
          <div class="grid gap-4 md:grid-cols-2">
            <label class="inline-flex items-center gap-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
              <input
                v-model="backupSettings.schedule_enabled"
                type="checkbox"
                class="h-4 w-4"
              > {{ t('dashboard.settings.backup.schedule.enabled') }}
            </label>
            <label class="inline-flex items-center gap-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
              <input
                v-model="backupSettings.encryption_enabled"
                type="checkbox"
                class="h-4 w-4"
              > {{ t('dashboard.settings.backup.encryption.enabled') }}
            </label>
            <div>
              <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">{{ t('dashboard.settings.backup.schedule.cronTitle') }}</label>
              <input
                v-model="backupSettings.schedule_cron"
                type="text"
                class="w-full px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark text-sm"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">{{ t('dashboard.settings.backup.schedule.retentionTitle') }}</label>
              <input
                v-model.number="backupSettings.retention_count"
                type="number"
                min="1"
                class="w-full px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark text-sm"
              >
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">{{ t('dashboard.settings.backup.schedule.filesDirTitle') }}</label>
              <input
                v-model="backupSettings.files_directory"
                type="text"
                class="w-full px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark text-sm"
              >
            </div>
          </div>

          <!-- Backup Actions -->
          <div class="flex flex-wrap gap-3">
            <button
              class="px-4 py-2 rounded-lg bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark text-sm font-medium hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
              :disabled="backupSaving"
              @click="saveBackupSettings"
            >
              {{ backupSaving ? t('dashboard.settings.saveInProgress') : t('dashboard.settings.backup.savePolicyButton') }}
            </button>
            <button
              class="px-4 py-2 rounded-lg border border-es-border dark:border-es-border-dark text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors"
              :disabled="backupRunning"
              @click="runBackup"
            >
              {{ backupRunning ? t('dashboard.settings.backupRunning') : t('dashboard.settings.backup.runNowButton') }}
            </button>
          </div>

          <!-- Backup History -->
          <div class="space-y-3">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ t('dashboard.settings.backup.history.title') }}
            </h3>
            <div
              v-if="backupHistory.length"
              class="space-y-2"
            >
              <div
                v-for="job in backupHistory"
                :key="job.id"
                class="rounded-xl border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark p-4"
              >
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
                    {{ job.id }}
                  </p>
                  <span
                    class="text-xs px-2 py-1 rounded-full"
                    :class="job.status === 'completed' ? 'bg-green-100 text-green-700' : job.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'"
                  >{{ job.status }}</span>
                </div>
                <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark mt-1">
                  {{ t('dashboard.settings.backup.history.scopesLabel') }} {{ job.scopes.join(', ') }} • {{ job.created_at || '-' }}
                </p>
                <div class="mt-2 flex flex-wrap items-center gap-2">
                  <select
                    v-model="restoreScope"
                    class="px-2 py-1 rounded border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-xs"
                  >
                    <option value="database">
                      {{ t('dashboard.settings.backup.history.restoreScope.options.database') }}
                    </option>
                    <option value="files">
                      {{ t('dashboard.settings.backup.history.restoreScope.options.files') }}
                    </option>
                    <option value="all">
                      {{ t('dashboard.settings.backup.history.restoreScope.options.all') }}
                    </option>
                  </select>
                  <button
                    class="text-xs font-medium text-red-600 hover:underline"
                    :disabled="restoring"
                    @click="restoreBackup(job.id)"
                  >
                    {{ restoring ? t('dashboard.settings.backup.restoreInProgress') : t('dashboard.settings.backup.history.restoreButton') }}
                  </button>
                </div>
              </div>
            </div>
            <p
              v-else
              class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark"
            >
              {{ t('dashboard.settings.backup.history.noHistory') }}
            </p>
          </div>
        </div>
      </UCard>

      <!-- Monitoring Section -->
      <UCard
        :ui="{
          root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
          header: 'border-b border-es-border/70 px-6 py-5 dark:border-es-border-dark/70',
          body: 'px-6 py-5'
        }"
      >
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-es-text-secondary dark:text-es-text-secondary-dark">
                System Observability
              </p>
              <h2 class="mt-1 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                {{ t('dashboard.settings.monitoring.title') }}
              </h2>
            </div>
            <button
              type="button"
              class="px-4 py-2 rounded-lg border border-es-border dark:border-es-border-dark text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors"
              :disabled="loading"
              @click="refreshMonitoringData"
            >
              {{ t('dashboard.settings.monitoring.refreshButton') }}
            </button>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Error/Success Messages -->
          <div
            v-if="errorMessage"
            class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {{ errorMessage }}
          </div>

          <div
            v-if="successMessage"
            class="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {{ successMessage }}
          </div>

          <!-- Integrations -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ t('dashboard.settings.monitoring.integrations.title') }}
            </h3>
            <div class="grid gap-4 md:grid-cols-3">
              <div class="rounded-xl border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark p-4 space-y-3">
                <p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
                  Uptime
                </p>
                <input
                  v-model="monitoringSettings.integrations.uptime.provider"
                  type="text"
                  class="w-full px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                >
                <label class="inline-flex items-center gap-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                  <input
                    v-model="monitoringSettings.integrations.uptime.enabled"
                    type="checkbox"
                    class="h-4 w-4"
                  > {{ t('dashboard.settings.monitoring.integrations.uptime.enabled') }}
                </label>
              </div>

              <div class="rounded-xl border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark p-4 space-y-3">
                <p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
                  Errors
                </p>
                <input
                  v-model="monitoringSettings.integrations.errors.provider"
                  type="text"
                  class="w-full px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                >
                <label class="inline-flex items-center gap-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                  <input
                    v-model="monitoringSettings.integrations.errors.enabled"
                    type="checkbox"
                    class="h-4 w-4"
                  > {{ t('dashboard.settings.monitoring.integrations.errors.enabled') }}
                </label>
              </div>

              <div class="rounded-xl border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark p-4 space-y-3">
                <p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
                  Performance
                </p>
                <input
                  v-model="monitoringSettings.integrations.performance.provider"
                  type="text"
                  class="w-full px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                >
                <label class="inline-flex items-center gap-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                  <input
                    v-model="monitoringSettings.integrations.performance.enabled"
                    type="checkbox"
                    class="h-4 w-4"
                  > {{ t('dashboard.settings.monitoring.integrations.performance.enabled') }}
                </label>
              </div>
            </div>
          </div>

          <!-- Services -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.settings.monitoring.services.title') }}
              </h3>
              <button
                type="button"
                class="text-sm font-medium text-es-accent-primary dark:text-es-accent-primary-dark"
                @click="addService"
              >
                {{ t('dashboard.settings.monitoring.services.add') }}
              </button>
            </div>
            <div class="space-y-3">
              <div
                v-for="(service, index) in monitoringSettings.enabled_services"
                :key="service.id + index"
                class="rounded-xl border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark p-4 grid gap-3 md:grid-cols-4"
              >
                <input
                  v-model="service.id"
                  type="text"
                  :placeholder="t('dashboard.settings.monitoring.services.idPlaceholder')"
                  class="px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                >
                <input
                  v-model="service.name"
                  type="text"
                  :placeholder="t('dashboard.settings.monitoring.services.namePlaceholder')"
                  class="px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                >
                <input
                  v-model="service.url"
                  type="text"
                  :placeholder="t('dashboard.settings.monitoring.services.urlPlaceholder')"
                  class="px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                >
                <div class="flex items-center justify-between gap-2">
                  <label class="inline-flex items-center gap-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                    <input
                      v-model="service.enabled"
                      type="checkbox"
                      class="h-4 w-4"
                    > {{ t('dashboard.settings.monitoring.services.enabled') }}
                  </label>
                  <button
                    type="button"
                    class="text-sm font-medium text-red-600"
                    @click="removeService(index)"
                  >
                    {{ t('dashboard.settings.monitoring.services.remove') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Thresholds -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.settings.monitoring.thresholds.title') }}
              </h3>
              <button
                type="button"
                class="text-sm font-medium text-es-accent-primary dark:text-es-accent-primary-dark"
                @click="addThreshold"
              >
                {{ t('dashboard.settings.monitoring.thresholds.add') }}
              </button>
            </div>
            <div class="space-y-3">
              <div
                v-for="(threshold, index) in monitoringSettings.thresholds"
                :key="threshold.id + index"
                class="rounded-xl border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark p-4 grid gap-3 md:grid-cols-7"
              >
                <input
                  v-model="threshold.id"
                  type="text"
                  :placeholder="t('dashboard.settings.monitoring.thresholds.idPlaceholder')"
                  class="px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                >
                <input
                  v-model="threshold.service_id"
                  type="text"
                  :placeholder="t('dashboard.settings.monitoring.thresholds.servicePlaceholder')"
                  class="px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                >
                <select
                  v-model="threshold.signal_type"
                  class="px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                >
                  <option value="uptime">
                    {{ t('dashboard.settings.monitoring.thresholds.signalType.options.uptime') }}
                  </option>
                  <option value="error_rate">
                    {{ t('dashboard.settings.monitoring.thresholds.signalType.options.error_rate') }}
                  </option>
                  <option value="latency_ms">
                    {{ t('dashboard.settings.monitoring.thresholds.signalType.options.latency_ms') }}
                  </option>
                </select>
                <select
                  v-model="threshold.operator"
                  class="px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                >
                  <option value="gt">
                    {{ t('dashboard.settings.monitoring.thresholds.operator.options.gt') }}
                  </option>
                  <option value="gte">
                    {{ t('dashboard.settings.monitoring.thresholds.operator.options.gte') }}
                  </option>
                  <option value="lt">
                    {{ t('dashboard.settings.monitoring.thresholds.operator.options.lt') }}
                  </option>
                  <option value="lte">
                    {{ t('dashboard.settings.monitoring.thresholds.operator.options.lte') }}
                  </option>
                  <option value="eq">
                    {{ t('dashboard.settings.monitoring.thresholds.operator.options.eq') }}
                  </option>
                  <option value="ne">
                    {{ t('dashboard.settings.monitoring.thresholds.operator.options.ne') }}
                  </option>
                </select>
                <input
                  v-model.number="threshold.threshold_value"
                  type="number"
                  step="0.01"
                  class="px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                >
                <select
                  v-model="threshold.severity"
                  class="px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                >
                  <option value="info">
                    {{ t('dashboard.settings.monitoring.thresholds.severityLabel.options.info') }}
                  </option>
                  <option value="warning">
                    {{ t('dashboard.settings.monitoring.thresholds.severityLabel.options.warning') }}
                  </option>
                  <option value="critical">
                    {{ t('dashboard.settings.monitoring.thresholds.severityLabel.options.critical') }}
                  </option>
                </select>
                <div class="flex items-center justify-between gap-2">
                  <label class="inline-flex items-center gap-2 text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                    <input
                      v-model="threshold.enabled"
                      type="checkbox"
                      class="h-4 w-4"
                    > {{ t('dashboard.settings.monitoring.thresholds.enabled') }}
                  </label>
                  <button
                    type="button"
                    class="text-sm font-medium text-red-600"
                    @click="removeThreshold(index)"
                  >
                    {{ t('dashboard.settings.monitoring.thresholds.remove') }}
                  </button>
                </div>
                <div class="md:col-span-7">
                  <label class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('dashboard.settings.monitoring.thresholds.cooldownLabel') }}</label>
                  <input
                    v-model.number="threshold.cooldown_minutes"
                    type="number"
                    min="1"
                    class="mt-1 w-full px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Destinations -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.settings.monitoring.destinations.title') }}
              </h3>
              <button
                type="button"
                class="text-sm font-medium text-es-accent-primary dark:text-es-accent-primary-dark"
                @click="addDestination"
              >
                {{ t('dashboard.settings.monitoring.destinations.add') }}
              </button>
            </div>
            <div class="space-y-3">
              <div
                v-for="(destination, index) in monitoringSettings.destinations"
                :key="destination.id + index"
                class="rounded-xl border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark p-4 grid gap-3 md:grid-cols-5"
              >
                <input
                  v-model="destination.id"
                  type="text"
                  :placeholder="t('dashboard.settings.monitoring.destinations.idPlaceholder')"
                  class="px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                >
                <input
                  v-model="destination.name"
                  type="text"
                  :placeholder="t('dashboard.settings.monitoring.destinations.namePlaceholder')"
                  class="px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                >
                <select
                  v-model="destination.channel"
                  class="px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                >
                  <option value="email">
                    {{ t('dashboard.settings.monitoring.destinations.channel.options.email') }}
                  </option>
                  <option value="webhook">
                    {{ t('dashboard.settings.monitoring.destinations.channel.options.webhook') }}
                  </option>
                </select>
                <input
                  v-model="destination.target"
                  type="text"
                  :placeholder="destination.channel === 'email' ? t('dashboard.settings.monitoring.destinations.targetPlaceholderEmail') : t('dashboard.settings.monitoring.destinations.targetPlaceholderWebhook')"
                  class="px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
                >
                <div class="flex items-center justify-between gap-2">
                  <label class="inline-flex items-center gap-2 text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                    <input
                      v-model="destination.enabled"
                      type="checkbox"
                      class="h-4 w-4"
                    > {{ t('dashboard.settings.monitoring.destinations.enabled') }}
                  </label>
                  <button
                    type="button"
                    class="text-sm font-medium text-red-600"
                    @click="removeDestination(index)"
                  >
                    {{ t('dashboard.settings.monitoring.destinations.remove') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Current Status -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ t('dashboard.settings.monitoring.currentStatus.title') }}
            </h3>
            <div
              v-if="monitoringStatus"
              class="space-y-3"
            >
              <p class="text-sm text-es-text-primary dark:text-es-text-primary-dark">
                {{ t('dashboard.settings.monitoring.currentStatus.overall') }} <span class="font-semibold capitalize">{{ monitoringStatus.overall_status }}</span>
              </p>
              <div class="grid gap-3 md:grid-cols-2">
                <div
                  v-for="service in monitoringStatus.services"
                  :key="service.service_id"
                  class="rounded-xl border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark p-4"
                >
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
                      {{ service.name }}
                    </p>
                    <span
                      class="text-xs px-2 py-1 rounded-full"
                      :class="statusBadgeClass(service.health)"
                    >{{ service.health }}</span>
                  </div>
                  <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark mt-2">
                    {{ service.url }}
                  </p>
                  <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark mt-1">
                    {{ t('dashboard.settings.monitoring.servicesTable.status') }}: {{ service.status_code ?? '-' }} • {{ t('dashboard.settings.monitoring.servicesTable.latency') }}: {{ service.latency_ms ? service.latency_ms.toFixed(1) : '-' }}ms
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Alerts -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.settings.monitoring.alerts.title') }}
              </h3>
              <button
                type="button"
                class="text-sm font-medium text-es-accent-primary dark:text-es-accent-primary-dark"
                :disabled="loading"
                @click="refreshMonitoringData"
              >
                {{ t('dashboard.settings.monitoring.alerts.refreshButton') }}
              </button>
            </div>
            <div
              v-if="recentAlerts.length"
              class="space-y-2"
            >
              <div
                v-for="alert in recentAlerts"
                :key="alert.id"
                class="rounded-xl border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark p-3"
              >
                <p class="text-sm text-es-text-primary dark:text-es-text-primary-dark">
                  {{ alert.message }}
                </p>
                <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark mt-1">
                  {{ t('dashboard.settings.monitoring.alerts.serviceLabel') }}: {{ alert.service }} • {{ t('dashboard.settings.monitoring.alerts.signalLabel') }}: {{ alert.signal_type }} • {{ t('dashboard.settings.monitoring.alerts.severityLabel') }}: {{ alert.severity }} • {{ t('dashboard.settings.monitoring.alerts.firedAtLabel') }}: {{ alert.fired_at || '-' }}
                </p>
              </div>
            </div>
            <p
              v-else
              class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark"
            >
              {{ t('dashboard.settings.monitoring.alerts.noAlerts') }}
            </p>
          </div>

          <!-- Test Alert -->
          <div class="rounded-xl border border-es-border dark:border-es-border-dark bg-es-bg-primary dark:bg-es-bg-primary-dark p-4 space-y-3">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ t('dashboard.settings.monitoring.test.title') }}
            </h3>
            <input
              v-model="testAlertMessage"
              type="text"
              :placeholder="t('dashboard.settings.monitoring.test.messagePlaceholder')"
              class="w-full px-3 py-2 rounded-lg border border-es-border dark:border-es-border-dark bg-es-bg-secondary dark:bg-es-bg-secondary-dark text-sm"
            >
            <button
              type="button"
              class="px-4 py-2 rounded-lg bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark text-sm font-medium hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
              :disabled="testing"
              @click="sendTestAlert"
            >
              {{ testing ? t('dashboard.settings.monitoring.test.sending') : t('dashboard.settings.monitoring.test.sendButton') }}
            </button>
          </div>

          <!-- Save Button -->
          <div class="flex justify-end pt-4 border-t border-es-border dark:border-es-border-dark">
            <button
              class="px-8 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
              :disabled="saving"
              @click="saveMonitoringSettings"
            >
              {{ saving ? t('dashboard.settings.saveInProgress') : t('dashboard.settings.monitoring.saveButton') }}
            </button>
          </div>
        </div>
      </UCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import type {
  AlertDestination,
  AlertInstanceItem,
  AnalyticsFunnel,
  AnalyticsSettings,
  BackupJob,
  BackupSettings,
  MonitoringSettings,
  MonitoringStatusResponse,
  MonitoringThreshold,
  MonitoredService
} from '../../types/api'
import { useAnalyticsApi, useBackupApi, useMonitoringApi } from '../../composables/useApi'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()

useSeoMeta({ title: t('dashboard.settings.title'), description: t('dashboard.settings.seo.description') })

const monitoringApi = useMonitoringApi()
const analyticsApi = useAnalyticsApi()
const backupApi = useBackupApi()

const loading = ref(false)
const saving = ref(false)
const testing = ref(false)
const analyticsSaving = ref(false)
const backupLoading = ref(false)
const backupSaving = ref(false)
const backupRunning = ref(false)
const restoring = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const testAlertMessage = ref('')
const restoreScope = ref<'database' | 'files' | 'all'>('database')

const monitoringSettings = reactive<MonitoringSettings>(createDefaultMonitoringSettings())
const analyticsSettings = reactive<AnalyticsSettings>(createDefaultAnalyticsSettings())
const backupSettings = reactive<BackupSettings>(createDefaultBackupSettings())
const monitoringStatus = ref<MonitoringStatusResponse | null>(null)
const recentAlerts = ref<AlertInstanceItem[]>([])
const backupHistory = ref<BackupJob[]>([])

function createDefaultMonitoringSettings(): MonitoringSettings {
  return {
    integrations: {
      uptime: { provider: 'uptime-kuma', enabled: true },
      errors: { provider: 'sentry', enabled: true },
      performance: { provider: 'synthetic-http', enabled: true }
    },
    enabled_services: [],
    thresholds: [],
    destinations: []
  }
}

function applySettings(nextSettings: MonitoringSettings) {
  monitoringSettings.integrations = nextSettings.integrations
  monitoringSettings.enabled_services = nextSettings.enabled_services
  monitoringSettings.thresholds = nextSettings.thresholds
  monitoringSettings.destinations = nextSettings.destinations
}

function createDefaultAnalyticsSettings(): AnalyticsSettings {
  return {
    integrations: {
      ga4_measurement_id: null,
      gtm_container_id: null,
      clarity_project_id: null,
      meta_pixel_id: null,
      tiktok_pixel_id: null,
      linkedin_partner_id: null,
      enabled: true
    },
    funnels: [],
    // NEW: Consent defaults
    consent_required: false,
    consent_tiers: {
      essential: { enabled: true, name: 'Essential', description: 'Required for site functionality', required: true, default_value: true },
      analytics: { enabled: true, name: 'Analytics', description: 'Performance and usage analytics', required: false, default_value: true },
      functional: { enabled: true, name: 'Functional', description: 'Enhanced features and preferences', required: false, default_value: false },
      marketing: { enabled: true, name: 'Marketing', description: 'Personalized advertising', required: false, default_value: false }
    },
    consent_version: '1.0.0',
    tracker_consent_rules: {
      ga4: 'analytics',
      gtm: 'analytics',
      clarity: 'functional',
      meta_pixel: 'marketing',
      tiktok_pixel: 'marketing',
      linkedin: 'marketing'
    }
  }
}

function createDefaultBackupSettings(): BackupSettings {
  return {
    schedule_enabled: false,
    schedule_cron: '0 3 * * *',
    retention_count: 14,
    encryption_enabled: false,
    files_directory: 'uploads'
  }
}

function applyAnalyticsSettings(nextSettings: AnalyticsSettings) {
  analyticsSettings.integrations = nextSettings.integrations
  analyticsSettings.funnels = nextSettings.funnels
  // NEW: Apply consent settings
  analyticsSettings.consent_required = nextSettings.consent_required ?? false
  analyticsSettings.consent_tiers = nextSettings.consent_tiers ?? createDefaultAnalyticsSettings().consent_tiers
  analyticsSettings.consent_version = nextSettings.consent_version ?? '1.0.0'
  analyticsSettings.tracker_consent_rules = nextSettings.tracker_consent_rules ?? createDefaultAnalyticsSettings().tracker_consent_rules
}

function applyBackupSettings(nextSettings: BackupSettings) {
  backupSettings.schedule_enabled = nextSettings.schedule_enabled
  backupSettings.schedule_cron = nextSettings.schedule_cron
  backupSettings.retention_count = nextSettings.retention_count
  backupSettings.encryption_enabled = nextSettings.encryption_enabled
  backupSettings.files_directory = nextSettings.files_directory
}

const loadMonitoringData = async (clearMessages = true) => {
  loading.value = true
  if (clearMessages) {
    errorMessage.value = ''
    successMessage.value = ''
  }
  try {
    const [settings, status, alerts] = await Promise.all([
      monitoringApi.getSettings(),
      monitoringApi.getStatus(),
      monitoringApi.getAlerts({ limit: 10, offset: 0 })
    ])
    applySettings(settings)
    monitoringStatus.value = status
    recentAlerts.value = alerts.data
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('dashboard.settings.monitoring.refreshButton')
  } finally {
    loading.value = false
  }
}

const refreshMonitoringData = async () => {
  await loadMonitoringData()
}

const loadAnalyticsData = async () => {
  try {
    const settings = await analyticsApi.getSettings()
    applyAnalyticsSettings(settings)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('dashboard.settings.monitoring.refreshButton')
  }
}

const saveAnalyticsSettings = async () => {
  analyticsSaving.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const updated = await analyticsApi.updateSettings(analyticsSettings)
    applyAnalyticsSettings(updated)
    successMessage.value = t('dashboard.settings.analyticsSaveSuccess')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('dashboard.settings.monitoringSaveFailed')
  } finally {
    analyticsSaving.value = false
  }
}

const loadBackupData = async () => {
  backupLoading.value = true
  try {
    const [settings, history] = await Promise.all([
      backupApi.getSettings(),
      backupApi.getHistory({ limit: 20, offset: 0 })
    ])
    applyBackupSettings(settings)
    backupHistory.value = history.data
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('dashboard.settings.backupRunning')
  } finally {
    backupLoading.value = false
  }
}

const refreshBackupData = async () => {
  await loadBackupData()
}

const saveBackupSettings = async () => {
  backupSaving.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const updated = await backupApi.updateSettings(backupSettings)
    applyBackupSettings(updated)
    successMessage.value = t('dashboard.settings.backupSaveSuccess')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('dashboard.settings.backupRunning')
  } finally {
    backupSaving.value = false
  }
}

const runBackup = async () => {
  backupRunning.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const job = await backupApi.createBackup({ scopes: ['database', 'files'] })
    successMessage.value = `${t('dashboard.settings.backupCompleted', { id: job.id })}`
    await loadBackupData()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('dashboard.settings.backupFailed')
  } finally {
    backupRunning.value = false
  }
}

const restoreBackup = async (backupId: string) => {
  restoring.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const confirmation = `RESTORE ${backupId}`
    const result = await backupApi.restoreBackup({
      backup_id: backupId,
      scope: restoreScope.value,
      confirmation
    })
    successMessage.value = result.message
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('dashboard.settings.backupRestoreFailed')
  } finally {
    restoring.value = false
  }
}

const saveMonitoringSettings = async () => {
  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const updated = await monitoringApi.updateSettings(monitoringSettings)
    applySettings(updated)
    successMessage.value = t('dashboard.settings.monitoringSaved')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('dashboard.settings.monitoringSaveFailed')
  } finally {
    saving.value = false
  }
}

const sendTestAlert = async () => {
  testing.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const result = await monitoringApi.sendTestAlert({
      message: testAlertMessage.value || undefined
    })
    successMessage.value = t('dashboard.settings.monitoring.testSent', { delivered: result.delivered, failed: result.failed })
    await loadMonitoringData(false)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('dashboard.settings.monitoring.failedToSendTest')
  } finally {
    testing.value = false
  }
}

const addService = () => {
  const service: MonitoredService = {
    id: `service-${monitoringSettings.enabled_services.length + 1}`,
    name: 'New Service',
    url: 'http://localhost:8080/health',
    enabled: true
  }
  monitoringSettings.enabled_services.push(service)
}

const removeService = (index: number) => {
  monitoringSettings.enabled_services.splice(index, 1)
}

const addThreshold = () => {
  const threshold: MonitoringThreshold = {
    id: `threshold-${monitoringSettings.thresholds.length + 1}`,
    service_id: monitoringSettings.enabled_services[0]?.id || 'backend',
    signal_type: 'latency_ms',
    operator: 'gt',
    threshold_value: 1500,
    severity: 'warning',
    cooldown_minutes: 5,
    enabled: true
  }
  monitoringSettings.thresholds.push(threshold)
}

const removeThreshold = (index: number) => {
  monitoringSettings.thresholds.splice(index, 1)
}

const addDestination = () => {
  const destination: AlertDestination = {
    id: `destination-${monitoringSettings.destinations.length + 1}`,
    name: 'New Destination',
    channel: 'email',
    target: '',
    enabled: true
  }
  monitoringSettings.destinations.push(destination)
}

const removeDestination = (index: number) => {
  monitoringSettings.destinations.splice(index, 1)
}

const addFunnel = () => {
  const funnel: AnalyticsFunnel = {
    id: `funnel-${analyticsSettings.funnels.length + 1}`,
    name: 'New Funnel',
    description: null,
    active: true,
    steps: [
      {
        name: 'Step 1',
        event_name: 'page_view',
        path: null,
        order: 1
      }
    ]
  }
  analyticsSettings.funnels.push(funnel)
}

const removeFunnel = (index: number) => {
  analyticsSettings.funnels.splice(index, 1)
}

const addFunnelStep = (funnelIndex: number) => {
  const funnel = analyticsSettings.funnels[funnelIndex]
  if (!funnel) return
  funnel.steps.push({
    name: `Step ${funnel.steps.length + 1}`,
    event_name: 'custom_event',
    path: null,
    order: funnel.steps.length + 1
  })
}

const removeFunnelStep = (funnelIndex: number, stepIndex: number) => {
  const funnel = analyticsSettings.funnels[funnelIndex]
  if (!funnel) return
  funnel.steps.splice(stepIndex, 1)
}

const statusBadgeClass = (health: string) => {
  if (health === 'healthy') return 'bg-green-100 text-green-700'
  if (health === 'degraded') return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
}

onMounted(async () => {
  await Promise.all([
    loadMonitoringData(),
    loadAnalyticsData(),
    loadBackupData()
  ])
})
</script>
