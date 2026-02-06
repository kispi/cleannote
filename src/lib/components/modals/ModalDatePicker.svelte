<script lang="ts">
  import { ChevronLeft, ChevronRight, X, Calendar } from 'lucide-svelte'
  import { ui } from '$lib/store/ui.svelte'
  import { t } from '$lib/i18n'
  import dayjs from 'dayjs'
  import 'dayjs/locale/ko'
  import 'dayjs/locale/en'
  import { settings } from '$lib/store/settings.svelte'

  // Sync dayjs locale with app settings
  $effect(() => {
    dayjs.locale(settings.locale)
  })

  interface Props {
    date?: string | Date // YYYY-MM-DD or Date object
    onConfirm: (date: string) => void
  }

  let { date, onConfirm }: Props = $props()

  // Internal state
  let currentMonth = $state(dayjs(date || undefined)) // For navigation
  let selectedDate = $state(dayjs(date || undefined)) // The actual selection

  // View Mode: 'calendar' | 'month' | 'year'
  let viewMode = $state<'calendar' | 'month' | 'year'>('calendar')

  // Year Picker Pagination State
  // Default to a range centered somewhat around the current selected year or today
  let yearPickerStartYear = $state(Math.floor(dayjs().year() / 20) * 20)

  // Calendar Logic
  // weekDays should depend on locale.
  // Since we rely on global dayjs locale potentially or just manual mapping.
  // Let's use dayjs().localeData().weekdaysShort() if available or manual map.
  // But dayjs locale loading might be tricky if not set up globally.
  // Simple map based on $lib/i18n locale is safer given we have 'ko' | 'en'.
  let weekDays = $derived.by(() => {
    // Rely on the dayjs locale which should be set by the app.
    // If not set globally, we force it here for display.
    // However, clean way is manual map to match app theme perfectly.
    // Let's assume standard starts at Sun.
    // We can use the 't' function key if we added weekdays there, but we didn't.
    // Let's hardcode for now based on strict 'ko'/'en' from i18n logic if possible or update i18n.
    // The user rules say DO NOT hardcode locale checks like `locale === 'ko'`.
    // So we should use `t()` keys.
    // But adding 7 keys is annoying.
    // Best: dayjs(someSunday).add(i, 'day').format('dd')
    // We need to ensure dayjs locale is correct.
    // Let's try formatting.
    const startOfWeek = dayjs().startOf('week')
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day').format('dd'))
  })

  let calendarDays = $derived.by(() => {
    const startOfMonth = currentMonth.startOf('month')
    const endOfMonth = currentMonth.endOf('month')
    const startDay = startOfMonth.day()
    const daysInMonth = currentMonth.daysInMonth()

    const days = []

    // Previous month padding
    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, date: null })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = startOfMonth.date(i)
      days.push({
        day: i,
        date: d,
        isToday: d.isSame(dayjs(), 'day'),
        isSelected: d.isSame(selectedDate, 'day')
      })
    }

    return days
  })

  // Navigation Handlers
  const handlePrev = () => {
    if (viewMode === 'calendar') {
      currentMonth = currentMonth.subtract(1, 'month')
    } else if (viewMode === 'month') {
      currentMonth = currentMonth.subtract(1, 'year')
    } else if (viewMode === 'year') {
      yearPickerStartYear -= 20
    }
  }

  const handleNext = () => {
    if (viewMode === 'calendar') {
      currentMonth = currentMonth.add(1, 'month')
    } else if (viewMode === 'month') {
      currentMonth = currentMonth.add(1, 'year')
    } else if (viewMode === 'year') {
      yearPickerStartYear += 20
    }
  }

  const selectDate = (d: dayjs.Dayjs) => {
    selectedDate = d
    // Maybe verify visual feedback?
  }

  const handleConfirm = () => {
    onConfirm(selectedDate.format('YYYY-MM-DD'))
    ui.modal.close()
  }

  // Years for Year Picker
  // Now paginated based on `yearPickerStartYear`
  // Range size 20 seems reasonable (4x5 grid)
  let yearRange = $derived.by(() => {
    const years = []
    for (let i = 0; i < 20; i++) {
      years.push(yearPickerStartYear + i)
    }
    return years
  })

  // When switching to 'year' view, reset the pagination to center the current view's year
  const switchToYearView = () => {
    const currentViewYear = currentMonth.year()
    // Align start year to be a multiple of 20
    yearPickerStartYear = Math.floor(currentViewYear / 20) * 20
    viewMode = 'year'
  }
</script>

<div class="modal-date-picker bg-base-100 flex w-full flex-col p-6">
  <!-- Header -->
  <div class="mb-4 flex items-center justify-between">
    <h3 class="text-base-content text-lg font-bold">
      {t('common.date_select')}
    </h3>
    <button
      type="button"
      onclick={() => ui.modal.close()}
      class="text-sub-content hover:bg-base-200 hover:text-base-content rounded-full p-2 transition-colors"
    >
      <X size={20} />
    </button>
  </div>

  <!-- Navigator -->
  <div class="mb-4 flex items-center justify-between">
    <button
      onclick={handlePrev}
      class="text-sub-content hover:bg-base-200 hover:text-base-content rounded-full p-2"
    >
      <ChevronLeft size={20} />
    </button>

    <div class="flex gap-2">
      <button
        onclick={switchToYearView}
        class="text-base-content hover:bg-base-200 rounded-lg px-2 py-1 font-bold transition-colors"
      >
        {viewMode === 'year'
          ? `${yearPickerStartYear} ~ ${yearPickerStartYear + 19}`
          : currentMonth.year()}
      </button>
      {#if viewMode !== 'year'}
        <button
          onclick={() => (viewMode = 'month')}
          class="text-base-content hover:bg-base-200 rounded-lg px-2 py-1 font-bold transition-colors"
        >
          {currentMonth.format('MMMM')}
        </button>
      {/if}
    </div>

    <button
      onclick={handleNext}
      class="text-sub-content hover:bg-base-200 hover:text-base-content rounded-full p-2"
    >
      <ChevronRight size={20} />
    </button>
  </div>

  <!-- Content -->
  <div class="min-h-[300px]">
    {#if viewMode === 'calendar'}
      <!-- Days Header -->
      <div class="mb-2 grid grid-cols-7 text-center">
        {#each weekDays as day}
          <div class="text-sub-content text-xs font-semibold uppercase">{day}</div>
        {/each}
      </div>

      <!-- Days Grid -->
      <div class="grid grid-cols-7 gap-1">
        {#each calendarDays as item}
          {#if item.day}
            <button
              onclick={() => selectDate(item.date!)}
              class="
                relative flex aspect-square items-center justify-center rounded-full text-sm font-medium transition-all
                {item.isSelected
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none'
                : 'text-base-content hover:bg-base-200 hover:font-bold hover:text-blue-600'}
                {item.isToday && !item.isSelected ? 'font-bold text-blue-600' : ''}
              "
            >
              {item.day}
              {#if item.isToday && !item.isSelected}
                <div class="absolute bottom-1 h-1 w-1 rounded-full bg-blue-600"></div>
              {/if}
            </button>
          {:else}
            <div></div>
            <!-- Empty slot -->
          {/if}
        {/each}
      </div>
    {:else if viewMode === 'month'}
      <div class="grid grid-cols-3 gap-3">
        {#each Array.from({ length: 12 }, (_, i) => i) as monthIndex}
          <button
            onclick={() => {
              currentMonth = currentMonth.month(monthIndex)
              viewMode = 'calendar'
            }}
            class="
                        rounded-xl py-4 text-sm font-bold transition-colors
                        {currentMonth.month() === monthIndex
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-base-200 text-base-content hover:bg-base-300'}
                    "
          >
            {dayjs().month(monthIndex).format('MMM')}
          </button>
        {/each}
      </div>
    {:else if viewMode === 'year'}
      <div class="custom-scrollbar grid h-[300px] grid-cols-4 gap-2 overflow-y-auto pr-2">
        {#each yearRange as year}
          <button
            onclick={() => {
              currentMonth = currentMonth.year(year)
              viewMode = 'month' // Go to month selection after year
            }}
            class="
                        rounded-xl py-2 text-sm font-bold transition-colors
                        {currentMonth.year() === year
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-base-200 text-base-content hover:bg-base-300'}
                    "
          >
            {year}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <div class="mt-6 flex w-full">
    <button onclick={handleConfirm} class="btn-primary w-full">
      {t('common.confirm') || 'Confirm'}
    </button>
  </div>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 4px;
  }
  :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #4b5563;
  }
</style>
