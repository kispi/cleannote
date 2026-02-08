<script lang="ts">
  import { t } from '$lib/i18n'
  import { priceWithSign } from '$lib/utils/format'
  import dayjs from 'dayjs'
  import 'dayjs/locale/ko'
  import { settings } from '$lib/store/settings.svelte'

  interface Props {
    date: string | Date | dayjs.Dayjs
    amount: number
  }

  let { date, amount }: Props = $props()

  let day = $derived(dayjs(date).locale(settings.locale))
  let dateStr = $derived(day.format('YYYY-MM-DD'))
  let isToday = $derived(dateStr === dayjs().format('YYYY-MM-DD'))
  let isYesterday = $derived(dateStr === dayjs().subtract(1, 'day').format('YYYY-MM-DD'))
</script>

<div class="mb-3 flex items-center justify-start gap-3 px-1">
  <h4 class="text-sub-content text-xs font-bold">
    {#if isToday}
      {t('common.today')}
    {:else if isYesterday}
      {t('common.yesterday')}
    {:else}
      {day.format('MM.DD dddd')}
    {/if}
  </h4>
  <span class="text-xs font-bold text-gray-400 dark:text-gray-500">
    {priceWithSign(amount)}
  </span>
</div>
