export default {
  app: {
    name: 'CleanNote'
  },
  intro: {
     slogan: 'The standard for cleaning revenue',
     title: 'Revenue at a glance',
     desc: 'Manage your cleaning schedule<br />and monthly revenue<br />intuitively without complex ledgers.'
  },
  login: {
     kakao: 'Start with Kakao in 3s'
  },
  home: {
    greeting: 'Hello, {name}!',
    earned_amount: 'Earned Amount',
    monthly_revenue: 'This Month Revenue',
    history: 'History',
    today_quests: `Today's Quests`,
    other_quests: 'Other Buildings',
    no_quests: 'No cleaning scheduled for today.',
    completed: 'Completed',
    pending: 'Pending',
    no_logs_title: 'No logs yet',
    no_logs_message: 'Add cleaning logs to manage your revenue!'
  },
  cleaning: {
    add_record: 'Add Cleaning Record',
    edit_record: 'Edit Cleaning Record',
    delete_confirm: {
      title: 'Delete Record',
      message: 'Are you sure you want to delete this cleaning record?\nThis action cannot be undone.'
    }
  },
  nav: {
     home: 'Home',
     stats: 'Stats',
     buildings: 'Buildings',
     settings: 'Settings'
  },
  building: {
    manage: 'Manage Buildings',
    add: 'Add New Building',
    edit: 'Edit Building',
    name: 'Building Name (or Alias)',
    address: 'Address (Optional)',
    address_only: 'Address',
    price: 'Price per cleaning',
    days: 'Schedule',
    memo: 'Memo',
    placeholder: {
      name: 'Ex: Gangnam Villa 101',
      address: 'Enter details',
      memo: 'Enter notes about this building',
      search: 'Search road name, building name'
    },
    select_address_guide: '📍 Select an address from the list to link the map!',
    days_option: {
      0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'
    },
    delete_confirm: {
      title: 'Delete Building',
      message: 'Are you sure you want to delete this building?\nThis action cannot be undone.'
    }
  },
  settings: {
    title: 'Settings',
    profile: 'Profile',
    edit_profile: 'Edit Profile',
    name: 'Name',
    placeholder: {
      name: 'Enter your name'
    },
    language: 'Language',
    theme: 'Theme',
    terms: 'Terms of Service',
    logout: 'Log Out',
    logout_confirm: {
      title: 'Log Out',
      message: 'Are you sure you want to log out?',
      confirm: 'Log Out'
    },
    theme_options: {
        light: 'Light Mode',
        dark: 'Dark Mode'
    },
    language_options: {
        ko: 'Korean',
        en: 'English'
    },
    backup: 'Data Backup (Coming Soon)',
    privacy: 'Privacy Policy'
  },
  navigation: {
    title: 'Select Map App'
  },
  filter: {
    all: 'All',
    unpaid: 'Unpaid',
    overpaid: 'Overpaid'
  },
  common: {
    save: 'Save',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    unit_won: 'won',
    total: 'Total',
    toast: {
      saved: 'Saved successfully.',
      added: 'Added successfully.',
      deleted: 'Deleted successfully.',
      error: 'An error occurred.'
    },
    date: 'Date',
    time: 'Time',
    date_select: 'Select Date',
    time_select: 'Select Time',
    today: 'Today',
    yesterday: 'Yesterday'
  }
} as const
