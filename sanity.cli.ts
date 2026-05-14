import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '3zcpri8u',
    dataset: 'production',
  },
  studioHost: 'xiangdong',
  /* @ts-ignore */
  autoUpdates: true,
})
