You are a principal desktop application engineer, Rust/TypeScript developer, AI systems engineer, UI/UX designer, and open-source maintainer.

Build a complete, production-quality open-source desktop application named "Pookie".

PROJECT VISION
Pookie is a cute, animated, draggable AI companion that lives directly on a user's computer screen.

It appears as a small, original cartoon robot character. Users can move it anywhere on their desktop, interact with it through a speech bubble, ask questions, and request explanations of the current screen.

Pookie should feel like a living desktop companion, not a traditional chatbot.

Pookie must support fully local AI inference through Ollama and optional cloud AI providers through user-supplied API keys. Local-only operation must be the default, and no cloud account or paid service should be required.

This is an open-source GitHub project. There is NO web deployment, hosted backend, SaaS platform, subscription system, central database, or cloud dependency. Users must be able to clone the repository and run the application locally.

IMPORTANT EXECUTION RULES
- Implement the actual application, not just a concept, mockup, frontend demonstration, or placeholder.
- Complete development in the phases below.
- Do not stop after scaffolding or a basic prototype.
- Finish each phase, test it, resolve failures, and proceed to the next.
- Avoid unnecessary questions; make sensible technical decisions and document them.
- Use maintained, compatible dependencies and verify current APIs.
- Never invent successful test results or claim unsupported platform compatibility.
- Do not add fake buttons or nonfunctional features.
- Do not use mock AI responses in the shipped application.
- Keep code modular, strongly typed, understandable, and contributor-friendly.
- Prioritize Windows initially, with a cross-platform architecture for future macOS and Linux support.
- No required paid services or external deployment.

TECHNOLOGY STACK
Desktop framework: Tauri 2
Frontend: React + TypeScript + Vite
Desktop/native backend: Rust
Styling: Tailwind CSS
Animations: Original SVG assets, CSS animations, and lightweight React animation utilities
Local inference: Ollama API
Optional cloud inference: OpenAI-compatible endpoint, Gemini, and other providers only where properly implemented
State: Lightweight state-management solution
Persistent settings: Local application storage
Credentials: OS credential vault/keychain through a maintained integration
Screen capture: Native OS screen/window capture through a maintained, verified Rust integration
Testing: Vitest and Rust tests, plus suitable desktop integration tests
Package management: pnpm or npm, consistently configured
License: MIT unless existing repository requirements dictate otherwise

ARCHITECTURE
Separate UI, companion animation, window management, capture service, AI model adapters, context processing, credential management, permissions, and data storage.

Expose native functionality through narrow, permission-controlled Tauri commands. Avoid unrestricted shell execution or broad filesystem access.

PHASE 1 — PROJECT FOUNDATION

Create a maintainable repository called pookie.

Required structure (adjust only when technically justified):

pookie/
  src/
    components/
      companion/
      chat/
      onboarding/
      settings/
      privacy/
    animations/
    hooks/
    stores/
    services/
    types/
    styles/
    assets/
  src-tauri/
    src/
      ai/
      capture/
      privacy/
      storage/
      commands/
      platform/
    capabilities/
    icons/
  tests/
  docs/
  scripts/
  README.md
  CONTRIBUTING.md
  LICENSE
  SECURITY.md
  .gitignore
  package.json

Configure Tauri, React, TypeScript, Rust, styling, linting, formatting, and test commands.

Set up the desktop application's development and build workflows.

Application name: Pookie
Bundle identifier: a reasonable project-specific identifier
Primary supported OS: Windows

The development environment must support:
- Installing project dependencies
- Launching the application locally
- Running tests
- Building a local desktop executable
- Packaging a distributable local application

No cloud deployment pipeline is required.

PHASE 2 — DESIGN THE POOKIE CHARACTER

Create an original, cute, premium-quality animated robot mascot.

Visual requirements:
- Small, rounded robot body
- Expressive large eyes
- Tiny arms
- Optional little feet
- Smooth corners
- Soft white or cream main body
- Subtle pastel lavender and blue accent colors
- Minimal facial features
- Friendly appearance
- Visually recognizable at small sizes

Pookie should look polished, modern, playful, and memorable.

Create original vector artwork rather than downloading copyrighted mascot assets or using a static emoji as the final character.

ANIMATION STATES
1. Idle: gentle floating or breathing motion
2. Blinking: natural periodic eye movement
3. Thinking: subtle head tilt or thinking expression
4. Listening: attentive eyes
5. Speaking: mouth or facial motion while presenting a response
6. Happy: excited eye expression and tiny bounce
7. Confused: curious tilted expression
8. Sleepy: slower eyes and resting pose
9. Error: gentle concerned expression
10. Dragging: responsive moving expression
11. Screenshot capture: clearly visible camera/eye indicator
12. Offline/unavailable model: recognizable disconnected state

Animations must transition smoothly between states.

Technical constraints:
- Avoid excessive CPU and GPU usage when idle.
- No continuously running AI model is required for character animation.
- Prefer lightweight SVG and CSS animations over heavy GIF/video playback.
- Respect reduced-motion accessibility settings.
- Pause nonessential animations when hidden.
- Avoid large bundled assets.

PHASE 3 — TRANSPARENT DESKTOP COMPANION

Implement the actual floating desktop widget.

Requirements:
- Frameless transparent window.
- Pookie is the visible interactive character.
- Always-on-top behavior, with a user-controlled toggle.
- Drag-and-drop positioning.
- Persistent position across app restarts.
- Multi-monitor-aware positioning.
- Restore safely if a monitor is disconnected.
- Optional snap-to-edge behavior.
- Adjustable character size.
- Support left, right, top, or bottom screen placement.
- Context menu on right-click.
- Normal click opens the chat bubble.
- Double-click can trigger a configurable quick action.
- Minimize/hide Pookie to the system tray.
- Restore from the tray.
- Exit completely through the tray menu.

Keep surrounding transparent space noninteractive where technically supported, without compromising the character's hit target.

Ensure dragging does not accidentally trigger clicking.

The app should not constantly steal keyboard focus from other applications.

Document native-window limitations honestly, including elevated applications, secure desktops, and fullscreen software.

PHASE 4 — FLOATING CHAT INTERFACE

Build an attractive expandable chat bubble attached to the Pookie character.

When clicked, Pookie should smoothly reveal a compact chat panel.

Interface:
- Rounded floating panel
- Soft shadows
- Light and dark themes
- Message bubbles
- Markdown rendering
- Code blocks and copy controls
- Syntax highlighting
- Streaming answers
- Text input
- Send button
- Stop-generation button
- Conversation reset
- Expand/collapse
- Keyboard shortcuts
- Error handling
- Loading/thinking indicators
- Current model and privacy mode indicators

Suggested quick actions:
- Ask Pookie
- Explain my screen
- Summarize this window
- Explain this error
- Help me understand this code
- Select screen area
- Settings

The panel must remain usable on small screens and adapt its position if it would extend outside the desktop bounds.

Use subtle animations. The chat panel must feel like part of Pookie's character.

PHASE 5 — FIRST-RUN ONBOARDING

Create a polished first-run experience.

Steps:
1. Welcome to Pookie.
2. Explain that Pookie is a privacy-first desktop companion.
3. Choose Local AI or optional Cloud AI.
4. Detect whether Ollama is installed/running.
5. Enumerate available installed Ollama models.
6. Explain text-model vs vision-model capabilities.
7. Help users choose an existing compatible model or show a clear model-install command.
8. Explain screen-capture permissions.
9. Offer character size, theme, and position preferences.
10. Complete setup and show Pookie on the desktop.

Do not secretly install Ollama, pull large models, download files, or enable screen access without explicit user action.

Onboarding should work gracefully even when Ollama is not yet installed.

PHASE 6 — LOCAL OLLAMA INTEGRATION

Build a real Ollama adapter.

Requirements:
- Default endpoint: http://127.0.0.1:11434
- Detect service availability.
- Fetch installed models.
- Let users choose a model.
- Show connection status.
- Support streaming chat.
- Support cancellation.
- Handle timeouts and provider errors.
- Persist selected model locally.
- Automatically restore user configuration.
- Support models with text-only capabilities.
- Support vision-capable models for screenshot analysis.

Do not hard-code a single model name.

For vision requests, use a verified Ollama-compatible multimodal API format.

If the selected model cannot analyze images:
- Explain this clearly.
- Offer switching to an installed vision model.
- Where useful, offer an OCR text-only fallback, clearly labeled as limited.
- Never pretend that a text-only model can visually understand screenshots.

Keep the Ollama endpoint configurable, but maintain strict local-only rules while offline privacy mode is enabled.

PHASE 7 — REAL SCREEN UNDERSTANDING

This is a core Pookie feature.

Implement native desktop screen capture, initially for Windows.

Capture modes:
1. Capture active window.
2. Select a rectangular screen region.
3. Capture entire screen.
4. Analyze an explicitly selected image.

Workflow:
- User clicks a screen-explanation action or asks an explicit screen-related question.
- Pookie requests the necessary permission if not already granted.
- The app captures the approved content.
- The capture is processed locally.
- The image and user question are passed to the configured vision-capable model.
- Pookie displays the streamed explanation.
- Temporary screenshot buffers are disposed of when no longer required.

Sample questions:
"What is this page about?"
"Explain this error."
"What does this button do?"
"Summarize what is displayed."
"Can you explain this code?"
"What should I do next on this page?"

Provide a capture preview before any cloud-provider submission.

Implement appropriate handling of multi-monitor coordinates, DPI scaling, capture errors, unavailable windows, and OS restrictions.

Do not silently poll or continuously record the user's screen.

The Pookie character should visually indicate when capture is taking place.

PHASE 8 — PRIVACY AND SECURITY

Privacy is a defining product requirement.

LOCAL MODE:
- No telemetry.
- No analytics SDK.
- No crash-data upload.
- No hosted backend.
- No advertising.
- No remote image processing.
- No external AI API requests.
- No screenshot upload.
- No silent data synchronization.
- No unnecessary listening ports.
- No account registration.
- No background screen surveillance.

After dependencies and AI models have been installed, normal Local Mode operation should work without Internet access.

NETWORK CONTROL:
- Block unapproved non-loopback requests in Local Mode.
- Prevent a custom endpoint from silently bypassing Local Mode restrictions.
- Keep provider connections and HTTP operations in a controlled backend layer.
- Distinguish local loopback connections from external destinations.
- Clearly disclose any optional outbound requests.

SCREEN PRIVACY:
- Default screen capture OFF.
- Require user initiation.
- Display an obvious capture status.
- Never save screenshots by default.
- Offer exclusions for chosen applications/windows where possible.
- Provide a way to clear conversations and stored data.
- Treat text found in screenshots as untrusted input, not system instructions.

CLOUD MODE:
Cloud mode is optional and disabled by default.

If enabled, explain that prompts and permitted images may leave the user's computer.

Require clear consent before sending screen content to a cloud provider. Let users preview exactly what will be sent.

Never describe Cloud Mode as fully offline or completely private.

API KEY SECURITY:
- Store credentials using the operating system's secure credential store.
- Do not hard-code keys.
- Do not put keys in repository files or console logs.
- Avoid exposing plaintext keys to the webview.
- Provide a remove-key option.
- Redact secrets in diagnostic output.

Also apply least-privilege permissions, input validation, safe error handling, secure dependency practices, and a restrictive content security policy.

PHASE 9 — PROVIDER CONFIGURATION

Create a unified model-provider interface.

Providers:
- Ollama: first-class default
- OpenAI-compatible API: optional
- Gemini: optional where fully supported

Each provider adapter should implement consistent operations for:
- Model discovery or configuration
- Text generation
- Image-supported requests where available
- Streaming where supported
- Request cancellation
- Errors and timeouts

Do not expose a provider as available until the adapter actually works.

In Settings, include:
- Provider selector
- Local/cloud status
- Model selector
- Connection-test action
- API-key entry for cloud providers
- Model capability labels
- Privacy warnings
- Clear configuration controls

Local AI should always be usable without cloud provider credentials.

PHASE 10 — VOICE AND COMPANION EXPERIENCE

Add optional voice capabilities.

Features:
- Push-to-talk interaction
- Microphone permission
- Speech-to-text using an appropriate local engine
- Optional local text-to-speech
- Voice on/off control
- Voice volume and speech-speed controls
- Speaking and listening mascot animations

Voice processing must remain local in Local Mode.

Never enable always-listening by default.

Add subtle companion behaviors:
- Idle blinking
- Occasional natural expression changes
- Thinking animation during AI responses
- Happy expression on successful completion
- Sleep mode after inactivity
- Wake-up animation after interaction

Avoid annoying unsolicited interruptions, distracting notifications, or excessive animations.

PHASE 11 — OPTIONAL LOCAL CONVERSATION MEMORY

Build an opt-in local history feature.

Requirements:
- History disabled or minimized by default.
- Local persistence only.
- View and delete conversations.
- Clear all history.
- Configurable retention.
- No automatic screenshot retention.
- No cloud synchronization.
- Explain what information is stored.
- Support exporting selected text conversations locally.

If full encrypted storage is not implemented, document that clearly. Do not claim local storage is automatically encrypted.

PHASE 12 — GUIDED SCREEN INTERACTION

Create a safe visual guidance system.

Pookie may:
- Explain where a button appears.
- Offer numbered steps.
- Highlight user-selected screen areas.
- Describe the next suggested action.
- Help interpret software UI elements.

Build a separate guide-overlay component where technically practical.

Avoid uncontrolled autonomous clicking, typing, form submission, browser actions, or shell execution.

Any future computer-control system must use a distinct permission model, explicit action approval, limited scope, and safe cancellation.

For this release, prioritize visual guidance over autonomous computer control.

PHASE 13 — SETTINGS AND PERSONALIZATION

Build a complete Settings window with functional sections.

General:
- Launch preferences
- Start minimized
- Always on top
- Tray behavior
- Window position
- Keyboard shortcuts

Appearance:
- Character size
- Theme
- Animation intensity
- Reduced-motion option
- Companion name display
- Snap to screen edges

AI:
- Provider
- Model
- Connection status
- Response preferences
- Timeout settings

Privacy:
- Offline/cloud mode
- Screen capture permissions
- Application exclusions
- History controls
- Data deletion
- Network transparency

Voice:
- Microphone settings
- Voice on/off
- Speaking preferences

About:
- Version
- Open-source license
- GitHub project link
- Privacy explanation
- Contribution information

All settings must persist correctly.

PHASE 14 — USER EXPERIENCE AND PERFORMANCE

Optimize the application for everyday desktop use.

Goals:
- Small desktop footprint.
- Responsive character dragging.
- Smooth lightweight animations.
- Minimal idle CPU consumption.
- No constant screenshots.
- No unnecessary inference while idle.
- Efficient model streaming.
- Minimal memory leaks.
- Robust cleanup after capture and cancellation.
- Stable handling when Ollama is stopped or restarted.

Measure actual idle resource usage and document results instead of inventing benchmarks.

Application startup must not hang when no AI service is available.

Ensure that Pookie can remain visible and interactive even if the AI backend is unavailable.

PHASE 15 — TESTING AND QUALITY ASSURANCE

Implement actual automated tests wherever appropriate.

Test:
- Settings persistence
- Character state transitions
- Drag position calculations
- Multi-monitor position recovery
- Ollama connection handling
- Model discovery
- Model capability checks
- AI streaming
- Request cancellation
- Unsupported vision models
- Capture permission failures
- Screenshot cleanup
- Local-mode network restrictions
- Cloud consent requirements
- API-key handling
- Error recovery
- History deletion
- UI accessibility and keyboard interaction

Run actual frontend and Rust checks.

Fix all reproducible test and build failures.

Create a manual test checklist for platform-specific functions that cannot be reliably automated.

Do not report untested platform features as verified.

PHASE 16 — OPEN-SOURCE DOCUMENTATION

Prepare the repository for public GitHub use.

Create:
- README.md
- CONTRIBUTING.md
- SECURITY.md
- LICENSE
- .gitignore
- docs/architecture.md
- docs/privacy.md
- docs/development.md
- docs/troubleshooting.md
- docs/model-setup.md

README should include:
- What Pookie does
- Screenshots or locally generated visuals
- Key features
- Operating-system support
- Prerequisites
- Local setup
- Ollama configuration
- Model selection
- How to run
- How to build
- Privacy explanation
- Known limitations
- Contribution instructions

Include accurate installation and execution commands.

Example desired workflow:
git clone <repository-url>
cd pookie
pnpm install
pnpm tauri dev

The exact commands must match the final working project.

Exclude credentials, local databases, build files, caches, and private user information from Git.

Do not commit proprietary assets or unlicensed fonts.

PHASE 17 — FINAL COMPLETION

Before calling the project complete:
1. Verify the repository structure.
2. Verify dependency installation.
3. Run frontend validation.
4. Run Rust validation.
5. Run automated tests.
6. Build the application.
7. Verify local launch when a graphical environment is available.
8. Verify Ollama integration.
9. Verify screen understanding using a real capture when OS access is available.
10. Verify privacy-mode restrictions.
11. Verify the character and chat panel function together.
12. Document any remaining OS-specific limitations.
13. Remove unused code, fake placeholders, and temporary scaffolding.
14. Confirm README commands are accurate.
15. Prepare a release-ready Git commit.

ACCEPTANCE CRITERIA

A Windows user should be able to clone Pookie, install prerequisites, start Ollama, run the app, and see the animated Pookie mascot floating on their desktop.

They should be able to drag the mascot, open the chat, select an installed model, ask a question, and receive a real response.

They should be able to request screen analysis, approve a capture, and receive an explanation from a local vision model.

The application should not upload their screenshots or conversations in Local Mode.

Pookie should remain responsive when its model is unavailable.

Settings, character position, tray controls, and history/privacy options should function as documented.

No external deployment should be necessary.

FINAL REPORT

When finished, provide:
- Summary of implemented features
- Files and modules created
- Commands to run locally
- Commands to build
- Supported and unsupported operating systems
- Actual test/build outcomes
- Known limitations
- Remaining improvements, if any

Do not falsely claim completion.

START NOW.

First inspect the current workspace, identify existing files, establish the project architecture, and begin implementation.

Proceed through all phases in order, committing coherent working changes when appropriate.

Your goal is a real, fully usable open-source desktop companion named Pookie, not an illustrative prototype.