<template>
  <div class="space-y-6">
    <DashboardPageHeader
      eyebrow="Email Configuration"
      title="Email Settings"
      description="Configure email providers and delivery settings"
    />

    <!-- Provider Selection -->
    <UCard
      :ui="{
        root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
        header: 'border-b border-es-border/70 px-6 py-5 dark:border-es-border-dark/70',
        body: 'px-6 py-5'
      }"
    >
      <template #header>
        <h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
          Email Provider
        </h2>
      </template>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
            Provider
          </label>
          <select
            v-model="selectedProvider"
            class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
          >
            <option value="smtp">SMTP (Built-in)</option>
            <option value="sendgrid">SendGrid</option>
            <option value="mailgun">Mailgun</option>
            <option value="ses">Amazon SES</option>
            <option value="postmark">Postmark</option>
            <option value="smtp2go">SMTP2GO</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
            From Address
          </label>
          <input
            v-model="settings.from_address"
            type="email"
            placeholder="noreply@yourdomain.com"
            class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
          >
        </div>
      </div>
    </UCard>

    <!-- SMTP Configuration -->
    <UCard
      v-if="selectedProvider === 'smtp'"
      :ui="{
        root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
        header: 'border-b border-es-border/70 px-6 py-5 dark:border-es-border-dark/70',
        body: 'px-6 py-5'
      }"
    >
      <template #header>
        <h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
          SMTP Configuration
        </h2>
      </template>

      <div class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
              SMTP Host
            </label>
            <input
              v-model="settings.smtp_host"
              type="text"
              placeholder="smtp.example.com"
              class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
              SMTP Port
            </label>
            <input
              v-model.number="settings.smtp_port"
              type="number"
              placeholder="587"
              class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            >
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
              Username
            </label>
            <input
              v-model="settings.smtp_username"
              type="text"
              placeholder="your-username"
              class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
              Password
            </label>
            <input
              v-model="settings.smtp_password"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
            Encryption
          </label>
          <select
            v-model="settings.smtp_encryption"
            class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
          >
            <option value="starttls">STARTTLS</option>
            <option value="tls">TLS</option>
            <option value="ssl">SSL</option>
          </select>
        </div>
      </div>
    </UCard>

    <!-- API Key Configuration (SendGrid, Mailgun, Postmark, SMTP2GO) -->
    <UCard
      v-if="['sendgrid', 'mailgun', 'postmark', 'smtp2go'].includes(selectedProvider)"
      :ui="{
        root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
        header: 'border-b border-es-border/70 px-6 py-5 dark:border-es-border-dark/70',
        body: 'px-6 py-5'
      }"
    >
      <template #header>
        <h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
          API Configuration
        </h2>
      </template>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
            API Key
          </label>
          <input
            v-model="settings.api_key"
            type="password"
            placeholder="Your API key"
            class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
          >
        </div>

        <div v-if="selectedProvider === 'mailgun'">
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
            Domain
          </label>
          <input
            v-model="settings.domain"
            type="text"
            placeholder="mg.yourdomain.com"
            class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
          >
        </div>
      </div>
    </UCard>

    <!-- AWS SES Configuration -->
    <UCard
      v-if="selectedProvider === 'ses'"
      :ui="{
        root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
        header: 'border-b border-es-border/70 px-6 py-5 dark:border-es-border-dark/70',
        body: 'px-6 py-5'
      }"
    >
      <template #header>
        <h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
          AWS SES Configuration
        </h2>
      </template>

      <div class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
              Access Key ID
            </label>
            <input
              v-model="settings.access_key_id"
              type="text"
              placeholder="AKIAIOSFODNN7EXAMPLE"
              class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
              Secret Access Key
            </label>
            <input
              v-model="settings.secret_access_key"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
            Region
          </label>
          <input
            v-model="settings.region"
            type="text"
            placeholder="us-east-1"
            class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
          >
        </div>
      </div>
    </UCard>

    <!-- Actions -->
    <div class="flex gap-4">
      <UButton
        color="primary"
        :loading="saving"
        @click="saveSettings"
      >
        Save Settings
      </UButton>
      <UButton
        v-if="activeSettings"
        color="gray"
        variant="outline"
        @click="testEmail"
      >
        Send Test Email
      </UButton>
    </div>

    <!-- Active Settings Info -->
    <div v-if="activeSettings" class="mt-6 p-4 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark rounded-lg">
      <h3 class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2">
        Current Active Configuration
      </h3>
      <div class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
        <p>Provider: <strong>{{ activeSettings.provider }}</strong></p>
        <p>From: <strong>{{ activeSettings.from_address }}</strong></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()

const selectedProvider = ref('smtp')
const saving = ref(false)
const activeSettings = ref<any>(null)

const settings = ref({
  provider: 'smtp',
  smtp_host: null as string | null,
  smtp_port: null as number | null,
  smtp_username: null as string | null,
  smtp_password: null as string | null,
  smtp_encryption: 'starttls',
  api_key: null as string | null,
  from_address: '',
  domain: null as string | null,
  region: null as string | null,
  access_key_id: null as string | null,
  secret_access_key: null as string | null,
  is_active: true,
})

// Load existing settings
const loadSettings = async () => {
  try {
    const response = await $api('/api/v1/email/settings')
    if (response.data && response.data.settings.length > 0) {
      activeSettings.value = response.data.settings.find((s: any) => s.is_active)
      if (activeSettings.value) {
        selectedProvider.value = activeSettings.value.provider
        settings.value = { ...settings.value, ...activeSettings.value }
      }
    }
  } catch (error) {
    console.error('Failed to load email settings:', error)
  }
}

const saveSettings = async () => {
  saving.value = true
  try {
    const payload = { ...settings.value, provider: selectedProvider.value }
    
    if (activeSettings.value) {
      // Update existing
      await $api(`/api/v1/email/settings/${activeSettings.value.id.split(':')[1]}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      // Create new
      await $api('/api/v1/email/settings', {
        method: 'POST',
        body: payload
      })
    }
    
    await loadSettings()
    
    // Show success
    alert('Email settings saved successfully!')
  } catch (error: any) {
    console.error('Failed to save settings:', error)
    alert(`Failed to save settings: ${error.message}`)
  } finally {
    saving.value = false
  }
}

const testEmail = async () => {
  const testEmail = prompt('Enter test email address:', '')
  if (!testEmail) return

  try {
    await $api('/api/v1/email/send', {
      method: 'POST',
      body: {
        to: testEmail,
        subject: 'Test Email from Esperion',
        body: 'This is a test email to verify your email configuration is working correctly.',
        html_body: '<h1>Test Email</h1><p>This is a test email to verify your email configuration is working correctly.</p>'
      }
    })
    
    alert('Test email sent successfully!')
  } catch (error: any) {
    console.error('Failed to send test email:', error)
    alert(`Failed to send test email: ${error.message}`)
  }
}

onMounted(() => {
  loadSettings()
})
</script>
