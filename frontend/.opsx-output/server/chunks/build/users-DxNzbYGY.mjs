import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue'
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrGetDynamicModelProps, ssrRenderList, ssrRenderAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer'
import { t as toVeeTypedSchema, c as createUserSchema, u as useForm } from './useValidation-ClFrraDa.mjs'
import { useUsersApi } from './useApi-L_axzZs3.mjs'
import { defineStore } from 'pinia'
import { b as useI18n, c as useSeoMeta } from './server.mjs'
import 'zod'
import '../_/nitro.mjs'
import 'node:http'
import 'node:https'
import 'node:events'
import 'node:buffer'
import 'consola'
import 'uncsrf'
import 'vue-router'
import 'lru-cache'
import 'node:fs'
import 'node:path'
import 'node:url'
import '@iconify/utils'
import 'node:crypto'
import 'fast-xml-parser'
import 'xss'
import 'ms'
import 'node:fs/promises'
import '@modelcontextprotocol/sdk/server/mcp.js'
import '@modelcontextprotocol/sdk/server/streamableHttp.js'
import 'satori'
import 'ipx'
import '@vue/shared'
import '@unhead/schema-org/vue'
import 'tailwindcss/colors'
import '@iconify/vue'
import '../routes/renderer.mjs'
import 'vue-bundle-renderer/runtime'
import 'unhead/server'
import 'devalue'
import 'unhead/plugins'
import 'unhead/utils'

const useUiStore = defineStore('ui', {
  state: () => ({
    sidebarCollapsed: false,
    notifications: []
  }),
  getters: {
    isSidebarCollapsed: state => state.sidebarCollapsed,
    allNotifications: state => state.notifications,
    unreadNotifications: state => state.notifications.filter(n => !n.read)
  },
  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    expandSidebar() {
      this.sidebarCollapsed = false
    },
    collapseSidebar() {
      this.sidebarCollapsed = true
    },
    addNotification(notification) {
      const newNotification = {
        id: Math.random().toString(36).substring(7),
        // Simple ID generation
        ...notification,
        createdAt: /* @__PURE__ */ new Date(),
        read: false
      }
      this.notifications.push(newNotification)
      if (this.notifications.length > 50) {
        this.notifications = this.notifications.slice(-50)
      }
      if (notification.type === 'info') {
        setTimeout(() => {
          this.markAsRead(newNotification.id)
        }, 5e3)
      }
    },
    removeNotification(id) {
      this.notifications = this.notifications.filter(notif => notif.id !== id)
    },
    markAsRead(id) {
      const notification = this.notifications.find(notif => notif.id === id)
      if (notification) {
        notification.read = true
      }
    },
    markAllAsRead() {
      this.notifications.forEach((notif) => {
        notif.read = true
      })
    },
    clearAllNotifications() {
      this.notifications = []
    }
  },
  persist: {
    key: 'ui-store',
    pick: ['sidebarCollapsed']
  }
})
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: 'users',
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n()
    useSeoMeta({
      title: t('dashboard.users.seo.title'),
      description: t('dashboard.users.seo.description')
    })
    const usersApi = useUsersApi()
    const uiStore = useUiStore()
    const users = ref([])
    const roles = ref([])
    const pending = ref(false)
    const submitting = ref(false)
    const error = ref(null)
    const accessDenied = ref(false)
    const showForm = ref(false)
    const editingUserId = ref(null)
    const isEditMode = computed(() => Boolean(editingUserId.value))
    const locale = useI18n().locale
    const schema = computed(() => toVeeTypedSchema(createUserSchema(t, locale.value, !isEditMode.value)))
    const {
      values,
      errors,
      defineField,
      handleSubmit,
      resetForm,
      setValues
    } = useForm({
      validationSchema: schema,
      initialValues: {
        full_name: '',
        username: '',
        email: '',
        phone: '',
        role: 'editor',
        password: ''
      }
    })
    const [fullName, fullNameField] = defineField('full_name')
    const [username, usernameField] = defineField('username')
    const [email, emailField] = defineField('email')
    const [phone, phoneField] = defineField('phone')
    const [role, roleField] = defineField('role')
    const [password, passwordField] = defineField('password')
    const roleClass = (role2) => {
      if (role2 === 'admin') return 'bg-red-100 text-red-700'
      if (role2 === 'editor') return 'bg-blue-100 text-blue-700'
      return 'bg-gray-100 text-gray-700'
    }
    const formatDate = (value) => {
      if (!value) return '-'
      const date = new Date(value)
      return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
    }
    const getError = (field) => {
      return errors.value[field]
    }
    const resetUserForm = () => {
      resetForm({
        values: {
          full_name: '',
          username: '',
          email: '',
          phone: '',
          role: 'editor',
          password: ''
        }
      })
      editingUserId.value = null
    }
    const closeForm = () => {
      resetUserForm()
      showForm.value = false
    }
    const loadUsers = async () => {
      const response = await usersApi.list({ page: 1, limit: 50 })
      users.value = response.data
    }
    handleSubmit(async () => {
      submitting.value = true
      error.value = null
      try {
        if (editingUserId.value) {
          const payload = {
            full_name: values.full_name,
            username: values.username,
            phone: values.phone || void 0,
            role: values.role
          }
          await usersApi.update(editingUserId.value, payload)
          uiStore.addNotification({
            title: t('dashboard.users.notifications.userUpdated.title'),
            message: t('dashboard.users.notifications.userUpdated.message'),
            type: 'success'
          })
        } else {
          const payload = {
            email: values.email,
            password: values.password || '',
            full_name: values.full_name,
            username: values.username,
            phone: values.phone || void 0,
            role: values.role
          }
          await usersApi.create(payload)
          uiStore.addNotification({
            title: t('dashboard.users.notifications.userCreated.title'),
            message: t('dashboard.users.notifications.userCreated.message'),
            type: 'success'
          })
        }
        await loadUsers()
        closeForm()
      } catch (err) {
        error.value = err instanceof Error ? err.message : t('dashboard.users.create.createButton')
        uiStore.addNotification({
          title: t('dashboard.users.notifications.error.title'),
          message: error.value,
          type: 'error'
        })
      } finally {
        submitting.value = false
      }
    })
    return (_ctx, _push, _parent, _attrs) => {
      let _temp0, _temp1, _temp2, _temp3, _temp4
      _push(`<div${ssrRenderAttrs(mergeProps({ class: 'space-y-6' }, _attrs))}><div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.users.title'))}</h1><p class="text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.users.description'))}</p></div><button type="button" class="inline-flex items-center justify-center rounded-lg bg-es-accent-primary px-5 py-3 font-semibold text-es-text-inverse transition-colors hover:bg-es-accent-primary-hover dark:bg-es-accent-primary-dark dark:text-es-text-inverse-dark dark:hover:bg-es-accent-primary-hover-dark"${ssrIncludeBooleanAttr(unref(pending) || unref(accessDenied)) ? ' disabled' : ''}>${ssrInterpolate(unref(t)('dashboard.users.newButton'))}</button></div>`)
      if (unref(pending)) {
        _push(`<div class="rounded-xl border border-es-border bg-es-bg-secondary px-4 py-6 text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.users.create.loading'))}</div>`)
      } else if (unref(accessDenied)) {
        _push(`<div class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">${ssrInterpolate(unref(t)('dashboard.users.create.denied'))}</div>`)
      } else if (unref(error)) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">${ssrInterpolate(unref(error))}</div>`)
      } else {
        _push(`<!---->`)
      }
      if (unref(showForm) && !unref(accessDenied)) {
        _push(`<section class="rounded-xl border border-es-border bg-es-bg-secondary p-5 shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><div class="mb-4 flex items-center justify-between gap-4"><div><h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(editingUserId) ? unref(t)('dashboard.users.create.update') : unref(t)('dashboard.users.create.title'))}</h2><p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(editingUserId) ? 'Update identity fields and fixed role assignment.' : unref(t)('dashboard.users.create.title'))}</p></div><button type="button" class="rounded-lg border border-es-border px-3 py-2 text-sm text-es-text-primary hover:bg-es-bg-tertiary dark:border-es-border-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"${ssrIncludeBooleanAttr(unref(submitting)) ? ' disabled' : ''}>${ssrInterpolate(unref(t)('dashboard.users.create.cancel'))}</button></div><form class="grid gap-4 md:grid-cols-2"><label class="space-y-2 text-sm"><span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.users.create.fullNameTitle'))}</span><input${ssrRenderAttrs((_temp0 = mergeProps({
          value: unref(values).full_name
        }, unref(fullNameField), {
          type: 'text',
          required: '',
          class: ['w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark', { 'border-red-500': getError('full_name') }]
        }), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, unref(values).full_name))))}>`)
        if (getError('full_name')) {
          _push(`<p class="text-xs text-red-600">${ssrInterpolate(getError('full_name'))}</p>`)
        } else {
          _push(`<!---->`)
        }
        _push(`</label><label class="space-y-2 text-sm"><span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.users.create.usernameTitle'))}</span><input${ssrRenderAttrs((_temp1 = mergeProps({
          value: unref(values).username
        }, unref(usernameField), {
          type: 'text',
          required: '',
          class: ['w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark', { 'border-red-500': getError('username') }]
        }), mergeProps(_temp1, ssrGetDynamicModelProps(_temp1, unref(values).username))))}>`)
        if (getError('username')) {
          _push(`<p class="text-xs text-red-600">${ssrInterpolate(getError('username'))}</p>`)
        } else {
          _push(`<!---->`)
        }
        _push(`</label><label class="space-y-2 text-sm"><span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.users.create.emailTitle'))}</span><input${ssrRenderAttrs((_temp2 = mergeProps({
          value: unref(values).email
        }, unref(emailField), {
          type: 'email',
          required: '',
          disabled: Boolean(unref(editingUserId)),
          class: ['w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary disabled:opacity-60 dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark', { 'border-red-500': getError('email') }]
        }), mergeProps(_temp2, ssrGetDynamicModelProps(_temp2, unref(values).email))))}>`)
        if (getError('email')) {
          _push(`<p class="text-xs text-red-600">${ssrInterpolate(getError('email'))}</p>`)
        } else {
          _push(`<!---->`)
        }
        _push(`</label><label class="space-y-2 text-sm"><span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.users.create.phoneTitle'))}</span><input${ssrRenderAttrs((_temp3 = mergeProps({
          value: unref(values).phone
        }, unref(phoneField), {
          type: 'tel',
          class: 'w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark'
        }), mergeProps(_temp3, ssrGetDynamicModelProps(_temp3, unref(values).phone))))}></label><label class="space-y-2 text-sm"><span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.users.create.roleTitle'))}</span><select${ssrRenderAttrs(mergeProps(unref(roleField), {
          class: ['w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark', { 'border-red-500': getError('role') }]
        }))}><!--[-->`)
        ssrRenderList(unref(roles), (role2) => {
          _push(`<option${ssrRenderAttr('value', role2.role)}${ssrIncludeBooleanAttr(Array.isArray(unref(values).role) ? ssrLooseContain(unref(values).role, role2.role) : ssrLooseEqual(unref(values).role, role2.role)) ? ' selected' : ''}>${ssrInterpolate(role2.role)}</option>`)
        })
        _push(`<!--]--></select>`)
        if (getError('role')) {
          _push(`<p class="text-xs text-red-600">${ssrInterpolate(getError('role'))}</p>`)
        } else {
          _push(`<!---->`)
        }
        _push(`</label>`)
        if (!unref(editingUserId)) {
          _push(`<label class="space-y-2 text-sm"><span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(unref(t)('dashboard.users.create.passwordTitle'))}</span><input${ssrRenderAttrs((_temp4 = mergeProps({
            value: unref(values).password
          }, unref(passwordField), {
            type: 'password',
            required: '',
            class: ['w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark', { 'border-red-500': getError('password') }]
          }), mergeProps(_temp4, ssrGetDynamicModelProps(_temp4, unref(values).password))))}>`)
          if (getError('password')) {
            _push(`<p class="text-xs text-red-600">${ssrInterpolate(getError('password'))}</p>`)
          } else {
            _push(`<!---->`)
          }
          _push(`</label>`)
        } else {
          _push(`<!---->`)
        }
        _push(`<div class="md:col-span-2 flex justify-end"><button type="submit" class="inline-flex items-center justify-center rounded-lg bg-es-accent-primary px-5 py-3 font-semibold text-es-text-inverse transition-colors hover:bg-es-accent-primary-hover disabled:opacity-60 dark:bg-es-accent-primary-dark dark:text-es-text-inverse-dark dark:hover:bg-es-accent-primary-hover-dark"${ssrIncludeBooleanAttr(unref(submitting)) ? ' disabled' : ''}>${ssrInterpolate(unref(submitting) ? unref(t)('dashboard.users.create.saveInProgress') : unref(editingUserId) ? unref(t)('dashboard.users.create.saveButton') : unref(t)('dashboard.users.create.createButton'))}</button></div></form></section>`)
      } else {
        _push(`<!---->`)
      }
      if (!unref(pending) && !unref(accessDenied)) {
        _push(`<section class="overflow-hidden rounded-xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark"><table class="w-full"><thead class="bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark"><tr><th class="px-6 py-3 text-left text-xs font-medium uppercase text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.users.table.user'))}</th><th class="px-6 py-3 text-left text-xs font-medium uppercase text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.users.table.role'))}</th><th class="px-6 py-3 text-left text-xs font-medium uppercase text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.users.table.phone'))}</th><th class="px-6 py-3 text-left text-xs font-medium uppercase text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.users.table.joined'))}</th><th class="px-6 py-3 text-right text-xs font-medium uppercase text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.users.table.actions'))}</th></tr></thead><tbody class="divide-y divide-es-border dark:divide-es-border-dark"><!--[-->`)
        ssrRenderList(unref(users), (user) => {
          _push(`<tr class="hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark"><td class="px-6 py-4"><div class="font-medium text-es-text-primary dark:text-es-text-primary-dark">${ssrInterpolate(user.full_name)}</div><div class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(user.email)}</div></td><td class="px-6 py-4"><span class="${ssrRenderClass([roleClass(user.role), 'rounded-full px-3 py-1 text-xs font-semibold capitalize'])}">${ssrInterpolate(user.role)}</span></td><td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(user.phone || '-')}</td><td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(formatDate(user.created_at))}</td><td class="px-6 py-4"><div class="flex justify-end gap-2"><button type="button" class="rounded-lg px-3 py-2 text-sm font-medium text-es-text-primary hover:bg-es-bg-primary dark:text-es-text-primary-dark dark:hover:bg-es-bg-primary-dark">${ssrInterpolate(unref(t)('dashboard.users.buttons.edit'))}</button><button type="button" class="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">${ssrInterpolate(unref(t)('dashboard.users.buttons.delete'))}</button></div></td></tr>`)
        })
        _push(`<!--]--></tbody></table>`)
        if (!unref(users).length) {
          _push(`<div class="px-6 py-10 text-center text-sm text-es-text-secondary dark:text-es-text-secondary-dark">${ssrInterpolate(unref(t)('dashboard.users.table.noResults'))}</div>`)
        } else {
          _push(`<!---->`)
        }
        _push(`</section>`)
      } else {
        _push(`<!---->`)
      }
      _push(`</div>`)
    }
  }
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('app/pages/dashboard/users.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
// # sourceMappingURL=users-DxNzbYGY.mjs.map
