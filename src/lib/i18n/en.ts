export default {
  app: {
    name: 'CleanQuest'
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
    revenue: 'This Month Revenue',
    today_quests: "Today's Quests",
    other_quests: 'Other Buildings',
    no_quests: 'No cleaning scheduled for today.',
    completed: 'Completed',
    pending: 'Pending'
  },
  cleaning: {
    add_record: 'Add Cleaning Record'
  },
  nav: {
     home: 'Home',
     buildings: 'Buildings',
     settings: 'Settings'
  },
  building: {
     manage: 'Manage Buildings',
     total: 'Managing {count} buildings.',
     add: 'Add New Building',
     edit: 'Edit Building',
     name: 'Building Name',
     address: 'Address (Optional)',
     price: 'Price per cleaning',
     days: 'Schedule',
     placeholder: {
         name: 'Ex: Gangnam Villa 101',
         address: 'Enter details'
     },
     days_option: {
        0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'
    },
     confirm_delete: {
         title: 'Delete Building',
         message: 'Are you sure you want to delete this building?\nThis action cannot be undone.'
     }
  },
  settings: {
    title: 'Settings',
    profile: 'Profile',
    language: 'Language',
    theme: 'Theme',
    backup: 'Data Backup / Export',
    terms: 'Terms of Service',
    logout: 'Log Out',
    theme_options: {
        light: 'Light Mode',
        dark: 'Dark Mode'
    },
    language_options: {
        ko: 'Korean',
        en: 'English'
    }
  },
  common: {
     save: 'Save',
     add: 'Add',
     edit: 'Edit',
     delete: 'Delete',
     cancel: 'Cancel',
     confirm: 'Confirm',
     unit_won: 'won',
     toast: {
         saved: 'Saved successfully.',
         added: 'Added successfully.',
         deleted: 'Deleted successfully.',
         error: 'An error occurred.'
     },
    date: 'Date',
    time: 'Time'
  }
} as const
