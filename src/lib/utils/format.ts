export const korPrice = (price: number): string => {
  if (price === 0) return '0원'
  if (!price) return ''

  const units = ['', '만', '억', '조']
  const result: string[] = []
  let unitIndex = 0

  let currentPrice = price
  
  while (currentPrice > 0) {
    const remainder = currentPrice % 10000
    if (remainder > 0) {
      if (unitIndex === 0) {
        // For the last unit (won), we format with commas if needed, 
        // effectively 1234 -> 1,234원
        // But requested format:
        // 15000 -> 1만 5천원 ?
        // 155000 -> 15만 5천원
        // 1552836 -> 155만 2,836원
        result.unshift(`${remainder.toLocaleString()}${units[unitIndex]}`)
      } else {
        result.unshift(`${remainder.toLocaleString()}${units[unitIndex]}`)
      }
    }
    
    currentPrice = Math.floor(currentPrice / 10000)
    unitIndex++
  }
  
  // The logic above is slightly off for combining.
  // Example 15000:
  // Loop 1: remainder 5000. unitIndex 0. result=['5,000'] (Need to check strict requirements)
  // Loop 2: remainder 1. unitIndex 1. result=['1만', '5,000']
  // Join -> 1만 5,000원?
  
  // User examples:
  // 15000 -> "1만 5천원"  (Wait, 5000 is 5천? Or 5,000?)
  // 155000 -> "15만 5천원"
  // 1552836 -> "155만 2,836원"

  // It seems like:
  // - If the chunk (lowest 4 digits) is exactly divisible by 1000 (like 5000), it writes '5천'.
  // - Otherwise just writes the number with comma.
  // - Wait, 1552836 -> "155만 2,836원". Here 2836 is just 2,836.
  // - 15000 -> "1만 5천원". Here 5000 becomes 5천.
  
  // Let's refine.
  // Maybe just simplest approach:
  // Manually handle '만', '억'. The rest part, if it looks like X000, maybe replace 000 with '천'?
  // Actually, standard Korean formatting is usually: 1억 5,300만 2,000원
  // But user specifically said "1만 5천원".
  // This implies if the last part is 5000, it shows 5천.
  
  // Let's stick to standard number formatting first but split by 10000.
  // 15000 -> 1, 5000 -> 1만 5,000원.
  // User's "5천원" might be a preference.
  // Let's implement a formatter that does:
  // [10000 unit]만 [rest]원
  
  // Let's rewrite simple logic.
  
  const unit = 10000;
  const man = Math.floor(price / unit);
  const remainder = price % unit;
  
  let str = '';
  if (man > 0) {
    str += `${man.toLocaleString()}만`;
  }
  
  if (remainder > 0) {
    if (str.length > 0) str += ' ';
    
    // User requested "5천원" for 5000?
    // Let's verify: 155000 -> 15만 5천원
    // 5000 -> 5천
    if (remainder % 1000 === 0 && remainder !== 0) {
      const cheon = remainder / 1000;
      str += `${cheon}천`;
    } else {
      str += remainder.toLocaleString();
    }
  }
  

  return str + '원';
}

export const priceWithSign = (price: number): string => {
  return `₩${price.toLocaleString()}`
}
