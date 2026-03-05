import { JobRole } from './types'

export const JOB_ROLES: JobRole[] = [
  {
    id: 'warehouse',
    title: 'Warehouse Worker',
    icon: '📦',
    tasks: ['Loading trucks', 'Packing goods', 'Forklift operation', 'Night shifts'],
  },
  {
    id: 'construction',
    title: 'Construction Worker',
    icon: '🏗️',
    tasks: ['Operating tools', 'Building site work', 'Lifting materials', 'Safety procedures'],
  },
  {
    id: 'cleaner',
    title: 'Cleaner / Housekeeping',
    icon: '🧹',
    tasks: ['Cleaning offices & hotels', 'Using cleaning equipment', 'Working independently'],
  },
]
