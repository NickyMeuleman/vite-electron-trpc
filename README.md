TODO: figure out how to put electron-builder in apps/desktop instead of in the root
now electron and electron-builder is installed in the root, eww

    "compile": "cross-env MODE=production npm run build && cross-env NODE_ENV=production electron-builder build --config .electron-builder.config.js --dir"
