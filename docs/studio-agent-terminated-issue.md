# "terminated" in Social Studio: issue and how to change it

## The issue

In Social Studio (motion graphic mode) the "AI team at work" panel shows:

> terminated. If you do not see the draft in the list on the left within a minute, run it again.

Research, Write, Design and Review finish, then **Render** stays on "Working..." and the run ends with "terminated". No draft is saved.

## Why it happened

1. The browser calls the Next.js route `src/app/api/admin/social/agent/route.ts`.
2. That route streams from the Python agent service, `POST /run` in `services/studio-agents/app.py`.
3. Rendering the GIF (`services/studio-agents/render.py`) is slow and sends nothing while it runs.
4. The MP4 step (ffmpeg, up to 120 seconds) made the silence longer.
5. The host or proxy in front of the agent service cuts a connection that stays idle too long. Next.js sees the cut as "terminated".

## What was changed

| PR | Change |
| --- | --- |
| 133 | Motion graphics are GIF only. ffmpeg and the MP4 download, the "Video (MP4)" post option and the LinkedIn video upload are removed. LinkedIn posts the GIF as an image. |
| 134 | A **Step logs** pop-up with copy buttons in Studio, Autopilot and Blog. |
| 135 | `/run` sends a `{"type":"ping"}` every 5 seconds while rendering, so the stream is never idle. |

## Changes only take effect after redeploying

- **Website:** merge to `main`. The pipeline deploys it.
- **Agent service:** it is a separate Azure Container App (`ca-gennoor-studio`). Redeploy it by hand:

```bash
az login
```

```bash
az acr build -r <registry> -t gennoor-studio:<new-tag> services/studio-agents
```

```bash
az containerapp update -n ca-gennoor-studio -g <resource-group> --image <registry>.azurecr.io/gennoor-studio:<new-tag>
```

Use a new tag each time (for example `v135`). Find the registry with `az acr list -o table` and the resource group with `az containerapp list -o table`.

## Check it worked

1. `az containerapp revision list -n ca-gennoor-studio -g <resource-group> -o table` shows the newest revision as active.
2. `https://<agent-service-url>/health` returns `{"ok": true}`.
3. Run a motion-graphic post in Social Studio. Render should finish and a draft should appear.

## If "terminated" still appears

1. In the Azure portal, open the Container App, then **Ingress**, and raise the idle timeout (aim for 240 seconds or more).
2. Make rendering lighter by lowering `fps`, `duration` or the canvas size in the scene spec, or in `services/studio-agents/agents.py` where the design agent writes the scene.
3. Read the step logs: click **Step logs** on a saved draft, or on the panel while a run is open, and copy the output for debugging.
