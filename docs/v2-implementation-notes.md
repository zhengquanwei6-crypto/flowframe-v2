# V2 Implementation Notes

## Product Decisions

- The product layer stores templates, fields, tasks, assets, providers, and plans.
- The UI never asks normal users to edit workflow JSON.
- Advanced mode exposes extra parameters and provider diagnostics, but not as the default entry point.
- Web and Android share `@flowframe/core` for templates, task semantics, provider types, plan limits, and API-facing shapes.

## MVP Behavior

- The current provider is a mock hosted provider so the full task loop can be demonstrated without a GPU backend.
- `custom_comfyui`, `hosted_comfyui`, and `managed_provider` are already represented in the shared model.
- API routes in the web app expose templates, tasks, providers, and task submission through unified JSON endpoints.

## Deferred Production Work

- Replace the mock provider with a real queue-backed service.
- Persist users, tasks, assets, and provider settings in a database.
- Add object storage for uploads and generated results.
- Add push notification registration for Android task completion.
- Add Stripe or another billing provider after the free trial loop is validated.
