import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import DashboardSettingsPage from '../../app/pages/dashboard/settings.vue'

const getSettings = vi.fn()
const getStatus = vi.fn()
const getAlerts = vi.fn()
const updateSettings = vi.fn()
const sendTestAlert = vi.fn()
const getAnalyticsSettings = vi.fn()
const updateAnalyticsSettings = vi.fn()
const getBackupSettings = vi.fn()
const updateBackupSettings = vi.fn()
const getBackupHistory = vi.fn()
const createBackup = vi.fn()
const restoreBackup = vi.fn()

vi.mock('../../app/composables/useApi', () => ({
  useMonitoringApi: () => ({
    getSettings,
    getStatus,
    getAlerts,
    updateSettings,
    sendTestAlert
  }),
  useAnalyticsApi: () => ({
    getSettings: getAnalyticsSettings,
    updateSettings: updateAnalyticsSettings
  }),
  useBackupApi: () => ({
    getSettings: getBackupSettings,
    updateSettings: updateBackupSettings,
    getHistory: getBackupHistory,
    createBackup,
    restoreBackup
  })
}))

describe('Dashboard Settings Monitoring', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('useSeoMeta', vi.fn())
    vi.stubGlobal('onMounted', (callback: () => void | Promise<void>) => {
      void callback()
    })

    getSettings.mockResolvedValue({
      integrations: {
        uptime: { provider: 'uptime-kuma', enabled: true },
        errors: { provider: 'sentry', enabled: true },
        performance: { provider: 'synthetic-http', enabled: true }
      },
      enabled_services: [
        { id: 'backend', name: 'Backend API', url: 'http://localhost:8080/health', enabled: true }
      ],
      thresholds: [
        {
          id: 'backend-latency',
          service_id: 'backend',
          signal_type: 'latency_ms',
          operator: 'gt',
          threshold_value: 1500,
          severity: 'warning',
          cooldown_minutes: 5,
          enabled: true
        }
      ],
      destinations: [
        { id: 'ops-email', name: 'Ops Email', channel: 'email', target: 'ops@example.com', enabled: true }
      ]
    })

    getStatus.mockResolvedValue({
      overall_status: 'healthy',
      services: [
        {
          service_id: 'backend',
          name: 'Backend API',
          url: 'http://localhost:8080/health',
          health: 'healthy',
          status_code: 200,
          latency_ms: 120,
          error_signal: 0,
          checked_at: '2026-03-09T01:00:00Z'
        }
      ]
    })

    getAlerts.mockResolvedValue({
      data: [],
      total: 0
    })

    updateSettings.mockImplementation(async payload => payload)
    sendTestAlert.mockResolvedValue({
      alert_id: 'alert_instances:test',
      delivered: 1,
      failed: 0
    })

    getAnalyticsSettings.mockResolvedValue({
      integrations: {
        ga4_measurement_id: 'G-TEST1234',
        gtm_container_id: 'GTM-TEST',
        clarity_project_id: 'clarity-demo',
        meta_pixel_id: '123456',
        tiktok_pixel_id: 'tt-demo',
        linkedin_partner_id: 'ln-demo',
        enabled: true
      },
      funnels: []
    })
    updateAnalyticsSettings.mockImplementation(async payload => payload)

    getBackupSettings.mockResolvedValue({
      schedule_enabled: false,
      schedule_cron: '0 3 * * *',
      retention_count: 14,
      encryption_enabled: false,
      files_directory: 'uploads'
    })
    updateBackupSettings.mockImplementation(async payload => payload)
    getBackupHistory.mockResolvedValue({ data: [], total: 0 })
    createBackup.mockResolvedValue({ id: 'backup_jobs:test', status: 'completed', scopes: ['database', 'files'] })
    restoreBackup.mockResolvedValue({ success: true, message: 'ok' })
  })

  it('loads monitoring settings from real API composable', async () => {
    const wrapper = mount(DashboardSettingsPage, {
      global: {
        stubs: {
          DashboardPageHeader: true,
          UCard: {
            template: '<div class="ucard-stub"><slot name="header" /><slot /></div>'
          },
          NuxtLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(getSettings).toHaveBeenCalled()
    expect(getStatus).toHaveBeenCalled()
    expect(getAlerts).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Monitoring & Alerting')
    expect(wrapper.text()).toContain('Backend API')
  })

  it('saves monitoring settings', async () => {
    const wrapper = mount(DashboardSettingsPage, {
      global: {
        stubs: {
          DashboardPageHeader: true,
          UCard: {
            template: '<div class="ucard-stub"><slot name="header" /><slot /></div>'
          },
          NuxtLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })
    await new Promise(resolve => setTimeout(resolve, 0))

    const buttons = wrapper.findAll('button')
    const saveButton = buttons.find(button => button.text().includes('Save Monitoring Changes'))
    expect(saveButton).toBeDefined()
    await saveButton!.trigger('click')

    expect(updateSettings).toHaveBeenCalled()
  })

  it('sends test alert', async () => {
    const wrapper = mount(DashboardSettingsPage, {
      global: {
        stubs: {
          DashboardPageHeader: true,
          UCard: {
            template: '<div class="ucard-stub"><slot name="header" /><slot /></div>'
          },
          NuxtLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })
    await new Promise(resolve => setTimeout(resolve, 0))

    const buttons = wrapper.findAll('button')
    const testAlertButton = buttons.find(button => button.text().includes('Send Test Alert'))
    expect(testAlertButton).toBeDefined()

    await testAlertButton!.trigger('click')
    await new Promise(resolve => setTimeout(resolve, 0))
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(sendTestAlert).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Test alert sent.')
  })
})
