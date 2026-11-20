# Pookie character animation

The approved character reference supplied for this project defines Pookie's pearl-white and lavender seated body, glossy navy face, cyan illuminated eyes and ear rings, cyan orb antenna, pink blush, and lavender scarf with a white P. `src/assets/pookie-pose-atlas-clean.png` is a transparent 4 × 4 pose atlas derived from that reference. Each cell is a separate character pose; the reference sheet itself is not displayed in the app. `src/assets/pookie-icon-source.png` is the matching icon source, and `src-tauri/icons/` contains the generated platform icons.

`src/animations/states.ts` maps named states to cells in the atlas. The three unused cells in the final row provide alternate idle and blink poses for future motion work. `src/components/companion/Pookie.tsx` shows one cell at a time and crossfades most state changes over 180 ms. Blink changes switch directly to keep the eye movement crisp. `src/styles/app.css` adds small float, bounce, tilt, sway, and glow effects. CSS animations pause when the document is hidden and stop when the system requests reduced motion.

| State | Trigger or behavior |
| --- | --- |
| Idle | Default gentle float |
| Blink | Randomly scheduled while idle, every 4–9 seconds |
| Thinking | A chat request is waiting for its first response |
| Listening | The message input has focus |
| Speaking | A response is streaming |
| Happy | A response completes |
| Confused | The required model or vision capability is missing |
| Sleepy | No interaction for two minutes |
| Processing | A captured image is being sent with a chat request |
| Capture | The screen or window capture is in progress |
| Offline | Ollama cannot be reached |
| Dragging | The mascot is being moved |
| Error | A request or capture fails |

To inspect the artwork in a browser, run `npm run dev` and then `npm run preview:mascot` in another terminal. The latter uses a local Microsoft Edge installation and saves ignored screenshots in `.preview/`. For a native desktop check, run `npm run tauri dev` on a Windows machine with the Visual C++ Build Tools installed.
