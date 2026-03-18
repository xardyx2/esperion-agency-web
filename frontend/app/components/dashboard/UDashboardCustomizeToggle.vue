<script setup lang="ts">
/**
 * UDashboardCustomizeToggle - Toggle button to enter/exit dashboard customize mode
 * 
 * Features:
 * - Shows "Customize" button when not in edit mode
 * - Shows "Done" button when in edit mode
 * - Icon: i-lucide-layout-template
 * 
 * @usage
 * ```vue
 * <UDashboardCustomizeToggle v-model:edit-mode="isEditing" />
 * ```
 */

interface Props {
  editMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editMode: false
})

const emit = defineEmits<{
  'update:editMode': [value: boolean]
}>()

const isEditing = computed({
  get: () => props.editMode,
  set: (value) => emit('update:editMode', value)
})

const toggleEditMode = () => {
  isEditing.value = !isEditing.value
}
</script>

<template>
  <UButton
    :color="isEditing ? 'es-accent-primary' : 'gray'"
    :variant="isEditing ? 'solid' : 'outline'"
    size="sm"
    @click="toggleEditMode"
    class="rounded-xl"
  >
    <UIcon :name="isEditing ? 'i-lucide-check' : 'i-lucide-layout-template'" class="h-4 w-4" />
    <span class="text-sm font-medium">
      {{ isEditing ? 'Done' : 'Customize' }}
    </span>
  </UButton>
</template>
