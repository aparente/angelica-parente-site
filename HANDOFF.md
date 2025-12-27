# Handoff Note: Angelica Parente Site Migration

## Design Goals & Context
- **User**: Angelica Parente, Biophysicist & Venture Capitalist (AI, Novel Therapeutics, Microglia).
- **Core Theme**: "Emergent Network Intelligence". A visualization of distributed systems found in nature (immune swarms, neural firing) and machines (AI).
- **Visuals**: A "thinking" network of nodes that drift, form transient connections, and propagate signals.
    - **Interaction**: Cursor acts as a stimulus, injecting energy that pulses through the network.
    - **Aesthetic**: Deep blues/cyans, glowing connections, organic but computational. Distinct from the "Starling Murmuration" of the original repo.

## Current Technical Status
- **Repository**: `~/github_repositories/angelica-parente-site` (Cloned and active).
- **Live Site**: `https://aparente.github.io/angelica-parente-site/`

## The Issue
The user reports the **animation is not visible**.

## Critical Debugging Context
1.  **Server Conflict**: The `Play` folder (Alexander's site) is likely running on **port 5173**.
2.  **The Fixes (Applied in this folder only)**:
    - **Retina Support**: Added `devicePixelRatio` scaling to `src/main.js` (essential for visibility on Mac).
    - **High Contrast**: Increased alpha/size of nodes in `node.js` and `network.js`.
    - **Visual Verification**: Previous agent confirmed visibility of a "blue vignette" network *locally* on the correct port.

## Next Steps for Agent
1.  **Kill old server**: Stop process in `~/github_repositories/Play`.
2.  **Start new server**: Run `npm run dev` in `~/github_repositories/angelica-parente-site`.
3.  **Verify**: Confirm the animation (blue network) is visible on localhost.
4.  **Refine**: If needed, verify the `style.css` background contrast or further tune opacity.
