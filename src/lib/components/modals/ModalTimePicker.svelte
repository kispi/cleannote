<script lang="ts">
  import { X } from 'lucide-svelte'
  import { ui } from '$lib/store/ui.svelte'
  import { t } from '$lib/i18n'
  import dayjs from 'dayjs'

  interface Props {
    time?: string // HH:mm
    onConfirm: (time: string) => void
  }

  let { time, onConfirm }: Props = $props()

  // Parse initial time
  const initialTime = time ? time.split(':') : [dayjs().format('HH'), dayjs().format('mm')]

  let selectedHour = $state(parseInt(initialTime[0]))
  let selectedMinute = $state(parseInt(initialTime[1]))

  // Snap minutes to nearest 5 for initial if needed, or just let wheel handle it
  // Logic: 0-23 hours, 0,5...55 minutes
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5)

  const formatWithZero = (n: number) => n.toString().padStart(2, '0')

  const handleConfirm = () => {
    const formattedHour = selectedHour.toString().padStart(2, '0')
    const formattedMinute = selectedMinute.toString().padStart(2, '0')
    onConfirm(`${formattedHour}:${formattedMinute}`)
    ui.modal.close()
  }

  // Scroll Handler for Hour
  const handleScroll = (e: Event, type: 'hour' | 'minute') => {
    const target = e.target as HTMLElement
    const itemHeight = 48 // h-12 = 3rem = 48px roughly. Let's enforce 48px.
    const scrollTop = target.scrollTop
    const index = Math.round(scrollTop / itemHeight)

    if (type === 'hour') {
      const h = hours[index]
      if (h !== undefined) selectedHour = h
    } else {
      const m = minutes[index]
      if (m !== undefined) selectedMinute = m
    }
  }

  // Scroll to specific value on click
  const handleClick = (value: number, type: 'hour' | 'minute') => {
    const target = type === 'hour' ? hourScrollNode : minuteScrollNode
    if (!target) return

    // Find index
    const index = type === 'hour' ? hours.indexOf(value) : minutes.indexOf(value)

    if (index >= 0) {
      target.scrollTo({
        top: index * 48,
        behavior: 'smooth'
      })
      // Update state immediately for visual feedback
      if (type === 'hour') selectedHour = value
      else selectedMinute = value
    }
  }

  let hourScrollNode: HTMLElement | undefined = $state()
  let minuteScrollNode: HTMLElement | undefined = $state()

  // Initial Scroll Position Setup
  const setupScroll = (node: HTMLElement, type: 'hour' | 'minute') => {
    if (type === 'hour') hourScrollNode = node
    else minuteScrollNode = node

    // Defer initial scroll slightly to ensure layout
    setTimeout(() => {
      const itemHeight = 48
      const index =
        type === 'hour'
          ? hours.indexOf(selectedHour)
          : minutes.indexOf(selectedMinute - (selectedMinute % 5))

      if (index >= 0) {
        node.scrollTop = index * itemHeight
      }
    }, 0)
  }
</script>

<div class="modal-time-picker bg-base-100 flex w-full flex-col p-6">
  <!-- Header -->
  <div class="mb-6 flex items-center justify-between">
    <h3 class="text-base-content text-lg font-bold">
      {t('common.time_select')}
    </h3>
    <button
      type="button"
      onclick={() => ui.modal.close()}
      class="text-sub-content hover:bg-base-200 hover:text-base-content rounded-full p-2 transition-colors"
    >
      <X size={20} />
    </button>
  </div>

  <!-- Scroll Wheels Container -->
  <div class="relative flex h-[200px] w-full items-center justify-center overflow-hidden">
    <!-- Selection Highlight Bar -->
    <div
      class="pointer-events-none absolute top-1/2 right-0 left-0 -z-10 h-12 -translate-y-1/2 rounded-lg bg-gray-100 dark:bg-gray-800"
    ></div>

    <!-- Hour Wheel -->
    <div class="relative h-full w-1/3 text-center">
      <div
        use:setupScroll={'hour'}
        onscroll={(e) => handleScroll(e, 'hour')}
        class="no-scrollbar h-full w-full snap-y snap-mandatory overflow-y-auto pt-[76px] pb-[76px]"
      >
        {#each hours as h}
          <button
            type="button"
            onclick={() => handleClick(h, 'hour')}
            class="flex h-12 w-full cursor-pointer snap-center items-center justify-center rounded-lg text-lg font-bold transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-gray-700/30
            {h === selectedHour ? 'scale-110 text-blue-600' : 'scale-90 text-gray-400 opacity-60'}"
          >
            {formatWithZero(h)}
          </button>
        {/each}
      </div>
    </div>

    <div class="text-base-content pb-1 text-xl font-bold">:</div>

    <!-- Minute Wheel -->
    <div class="relative h-full w-1/3 text-center">
      <div
        use:setupScroll={'minute'}
        onscroll={(e) => handleScroll(e, 'minute')}
        class="no-scrollbar h-full w-full snap-y snap-mandatory overflow-y-auto pt-[76px] pb-[76px]"
      >
        {#each minutes as m}
          <button
            type="button"
            onclick={() => handleClick(m, 'minute')}
            class="flex h-12 w-full cursor-pointer snap-center items-center justify-center rounded-lg text-lg font-bold transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-gray-700/30
            {m === selectedMinute
              ? 'scale-110 text-blue-600'
              : 'scale-90 text-gray-400 opacity-60'}"
          >
            {formatWithZero(m)}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <div class="mt-8 flex w-full">
    <button onclick={handleConfirm} class="btn-primary w-full">
      {t('common.confirm')}
    </button>
  </div>
</div>

<style>
  /* Hide Scrollbar */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
