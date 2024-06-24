import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json' assert { type: 'json' }

export default defineManifest({
  name: '__MSG_extName__',
  description: '__MSG_extDescription__',
  version: packageData.version,
  manifest_version: 3,
  author: packageData.author,
  default_locale: "en",
  icons: {
    128: 'img/logo-128.png',
  },
  action: {
    default_title: '__MSG_actionTitle__',
    default_icon: 'img/logo-128.png',
  },
  background: {
    service_worker: 'src/background/index.js',
    type: 'module',
  },
  side_panel: {
    default_path: 'sidepanel.html',
  },
  commands: {
    _execute_action: {
      suggested_key: {
        default: 'Alt+R',
      },
    },
  },
  web_accessible_resources: [
    {
      resources: ['img/logo-128.png'],
      matches: [],
    },
  ],
  permissions: ['sidePanel', 'storage', 'tabs'],
})
