# FlowFrame V2

FlowFrame V2 is a cross-platform AI workflow product MVP. It turns complex ComfyUI-style workflows into task templates that normal users can run through simple forms, while keeping advanced controls available behind a secondary mode.

## Workspace

- `packages/core`: shared business models, template schema, task model, provider abstraction, mock API.
- `apps/web`: Next.js App Router web MVP for desktop and mobile browsers.
- `apps/android`: Expo / React Native Android MVP shell using the same templates and task model.
- `docs`: product and architecture notes for the V2 implementation.

## Run

```bash
npm install
npm run dev:web
```

Android development:

```bash
npm run dev:android
```

## Product Direction

The default path is:

1. Choose a scene template.
2. Fill in a small form.
3. Submit a task.
4. Watch status.
5. View, save, or rerun results.

Advanced mode exists, but it is intentionally not the default home page.
