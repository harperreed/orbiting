# App Clip Testing Instructions - Task 9

## Overview
This document provides step-by-step instructions for testing the Orbiting App Clip with simulated URL invocations. This is Task 9 from the App Clip implementation plan.

## Prerequisites
- Xcode installed and Orbiting project open
- OrbitingClip scheme available and building successfully
- iOS Simulator available (iPhone 17 or similar)

## Test Configuration

### Step 1: Open Xcode Project
```bash
cd /Users/harper/workspace/personal/orbiting/packages/ios
open Orbiting/Orbiting.xcodeproj
```

### Step 2: Configure the OrbitingClip Scheme

This is the **critical step** that enables URL invocation testing in the simulator.

1. In Xcode, select the **OrbitingClip** scheme from the scheme selector (top left, next to the Stop button)

2. Open the Scheme Editor:
   - Method A: Product → Scheme → Edit Scheme...
   - Method B: Click the scheme selector, then "Edit Scheme..."
   - Method C: Keyboard shortcut: **⌘⇧<** (Cmd + Shift + <)

3. In the Scheme Editor dialog:
   - Select **Run** in the left sidebar
   - Click the **Arguments** tab at the top
   - Locate the **Environment Variables** section (middle of the window)

4. Add the test URL environment variable:
   - Click the **+** button below "Environment Variables"
   - Enter the following:
     - **Name**: `_XCAppClipURL`
     - **Value**: `https://orbiting.app/clip?text=Hello%20from%20App%20Clip&theme=contrast`
   - **Important**: Make sure the checkbox next to the variable is **checked** (enabled)

5. Click **Close** to save the scheme

### What is _XCAppClipURL?
The `_XCAppClipURL` environment variable is Apple's official mechanism for simulating App Clip invocations during development. When set, it provides a `NSUserActivity` with the specified URL to the App Clip on launch, exactly as would happen with a real invocation from Safari, Messages, or Maps.

## Test Execution

### Test 1: Basic URL Invocation
**Objective**: Verify the App Clip receives and logs the invocation URL

1. Select OrbitingClip scheme (if not already selected)
2. Select iPhone 17 (or any available iPhone simulator)
3. Run the app: **⌘R** (Cmd + R)
4. **Immediately** open the Xcode console: View → Debug Area → Activate Console (or **⌘⇧C**)

**Expected Console Output**:
```
📱 App Clip invoked with URL: https://orbiting.app/clip?text=Hello%20from%20App%20Clip&theme=contrast
📝 Pre-populating with text: Hello from App Clip
🎨 Setting theme: contrast
✅ App Clip using shared container at: [path to shared container]
```

**What to verify**:
- ✅ All four log messages appear
- ✅ URL is parsed correctly
- ✅ Text parameter is decoded (spaces, not %20)
- ✅ Theme parameter is recognized
- ✅ Shared container path is valid

**Code location**: `Orbiting/OrbitingClip/OrbitingClipApp.swift`, method `handleInvocation(userActivity:)`, lines 68-99

### Test 2: Visual Theme Application
**Objective**: Verify the theme parameter actually changes the app appearance

1. After app launches (from Test 1), observe the visual appearance
2. Expected appearance for `theme=contrast`:
   - **Black background**
   - **White text**
   - **High contrast interface elements**

**Alternative themes to test** (modify scheme environment variable):
- `theme=mono` - Monochrome theme
- `theme=fire` - Fire theme
- `theme=quiet` - Quiet theme
- `theme=event` - Event theme

**How to test different themes**:
1. Stop the app
2. Edit Scheme → Run → Arguments → Environment Variables
3. Change the URL to test different theme values
4. Run again and observe the visual change

### Test 3: App Clip Banner Display
**Objective**: Verify the upgrade banner is visible and properly styled

1. Launch the App Clip (from Test 1)
2. After splash screen fades, look at the **bottom of the screen**

**Expected UI**:
```
┌─────────────────────────────────────┐
│                                     │
│  [Main App Content Area]           │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ Using Orbiting App Clip  [Get Full App] │
└─────────────────────────────────────┘
```

**What to verify**:
- ✅ Banner appears at bottom of screen
- ✅ Text reads "Using Orbiting App Clip"
- ✅ "Get Full App" button is visible and styled
- ✅ Banner has semi-transparent material background
- ✅ Banner does not cover main content

**Code location**: `Orbiting/OrbitingClip/AppClipView.swift`, struct `AppClipBanner`, lines 50-71

### Test 4: SKOverlay Trigger
**Objective**: Verify that tapping "Get Full App" invokes SKOverlay without crashing

1. Launch the App Clip
2. Tap the **"Get Full App"** button in the bottom banner
3. Watch the console for log output

**Expected Console Output**:
```
📱 Presented App Store overlay
```

**Expected Behavior**:
- ✅ Console log appears
- ✅ No crash or error
- ⚠️ Overlay **may not visually appear** in simulator (this is a simulator limitation)
- ✅ On a real device, an App Store card would slide up from the bottom

**Note**: Full SKOverlay functionality requires a physical device and TestFlight distribution. In the simulator, we can only verify it doesn't crash.

**Code location**: `Orbiting/OrbitingClip/AppClipView.swift`, method `presentAppStoreOverlay()`, lines 36-47

### Test 5: Shared Storage Configuration
**Objective**: Verify App Clip uses the shared App Group container

1. Launch the App Clip
2. Check console for the shared container log (should appear near app launch)

**Expected Console Output**:
```
✅ App Clip using shared container at: /Users/[username]/Library/Developer/CoreSimulator/Devices/[UUID]/data/Containers/Shared/AppGroup/[UUID]
```

**What to verify**:
- ✅ Log message appears
- ✅ Path includes "Shared/AppGroup" (not just the app's container)
- ✅ No warning or error about container configuration

**Why this matters**: This confirms that data created in the App Clip will be accessible to the main app after upgrade, enabling the seamless migration flow.

**Code location**: `Orbiting/OrbitingClip/OrbitingClipApp.swift`, lines 14-39

### Test 6: URL Parameter Variations
**Objective**: Test different URL parameter combinations

For each test, modify the `_XCAppClipURL` in the scheme and run:

#### 6a. Text Only
```
https://orbiting.app/clip?text=Quick%20message%20test
```
Expected: Text extracted, default theme applied

#### 6b. Theme Only
```
https://orbiting.app/clip?theme=fire
```
Expected: Fire theme applied, no text parameter

#### 6c. No Parameters
```
https://orbiting.app/clip
```
Expected: App launches with defaults, no warnings/errors

#### 6d. Multiple Parameters (Order Test)
```
https://orbiting.app/clip?theme=mono&text=Multiple%20params&extra=ignored
```
Expected: Theme and text both applied, unknown parameters ignored gracefully

#### 6e. Invalid Theme Value
```
https://orbiting.app/clip?theme=invalid&text=Still%20works
```
Expected: Invalid theme ignored, text still extracted, no crash

#### 6f. URL Encoded Characters
```
https://orbiting.app/clip?text=Hello%20World%21%20%F0%9F%91%8B
```
Expected: "Hello World! 👋" (spaces and emoji decoded correctly)

**What to verify**:
- ✅ App handles all variations without crashing
- ✅ Valid parameters are applied
- ✅ Invalid parameters are safely ignored
- ✅ Console logs show appropriate warnings for invalid values

### Test 7: Splash Screen Timing
**Objective**: Verify splash screen displays and fades correctly

1. Launch the App Clip
2. Observe the splash screen behavior

**Expected Behavior**:
- ✅ Splash screen appears immediately on launch
- ✅ Remains visible for approximately 1.5 seconds
- ✅ Fades out smoothly (0.5 second fade animation)
- ✅ Banner and main content revealed after fade

**Code location**: `Orbiting/OrbitingClip/OrbitingClipApp.swift`, lines 52-58

## Test Results Template

Copy this to `docs/test-results.txt` and fill in actual results:

```
=== App Clip Testing Session ===
Date: [DATE]
Tester: [NAME]
Xcode Version: [VERSION]
Simulator: iPhone 17, iOS 26.0

Test 1: Basic URL Invocation
[ ] PASS  [ ] FAIL  [ ] PARTIAL
Notes:


Test 2: Visual Theme Application
[ ] PASS  [ ] FAIL  [ ] PARTIAL
Notes:


Test 3: App Clip Banner Display
[ ] PASS  [ ] FAIL  [ ] PARTIAL
Notes:


Test 4: SKOverlay Trigger
[ ] PASS  [ ] FAIL  [ ] PARTIAL
Notes:


Test 5: Shared Storage Configuration
[ ] PASS  [ ] FAIL  [ ] PARTIAL
Notes:


Test 6: URL Parameter Variations
[ ] PASS  [ ] FAIL  [ ] PARTIAL
Notes:


Test 7: Splash Screen Timing
[ ] PASS  [ ] FAIL  [ ] PARTIAL
Notes:


Overall Status: [ ] ALL PASS  [ ] ISSUES FOUND

Issues Found:
1.
2.

Recommendations:
1.
2.
```

## Troubleshooting

### Issue: No URL invocation logs appear
**Symptoms**: Console doesn't show "📱 App Clip invoked with URL"

**Solutions**:
1. Verify `_XCAppClipURL` environment variable is **enabled** (checkbox checked) in scheme
2. Confirm you're running the **OrbitingClip** scheme, not Orbiting
3. Clean build folder: **⌘⇧K** (Cmd + Shift + K)
4. Rebuild and run again
5. Make sure console is visible and showing all messages (not filtered)

### Issue: Theme not applying visually
**Symptoms**: Console shows theme log but UI doesn't change

**Solutions**:
1. Verify theme value is exactly one of: `mono`, `contrast`, `quiet`, `fire`, `event`
2. Check that `ThemeType` enum in `AppSettings.swift` includes the value
3. Try a different theme to confirm mechanism works
4. Check that settings object is properly passed to views

### Issue: Banner not visible
**Symptoms**: Bottom banner doesn't appear

**Solutions**:
1. Check that `AppClipView` is being used (not `RootView` directly)
2. Verify `VStack` layout in `AppClipView.swift`
3. Use Xcode's Debug View Hierarchy: Debug → View Debugging → Capture View Hierarchy
4. Check if banner is behind other views (z-index issue)

### Issue: SKOverlay crashes
**Symptoms**: App crashes when tapping "Get Full App"

**Solutions**:
1. Verify StoreKit framework is linked to OrbitingClip target
2. Check that scene is available (may not work in old simulators)
3. Try on a physical device via TestFlight for full overlay support
4. Check console for specific error message

### Issue: Shared container path not showing
**Symptoms**: No "✅ App Clip using shared container" log

**Solutions**:
1. Verify App Groups capability is enabled in OrbitingClip target
2. Check `OrbitingClip.entitlements` includes `group.com.harperrules.Orbiting`
3. Clean and rebuild project
4. Check console for warning/error about container configuration

## Next Steps After Testing

Once all tests pass:

1. **Document results** in `docs/test-results.txt`
2. **Commit test documentation**:
   ```bash
   git add docs/test-results.txt docs/app-clip-testing-instructions.md
   git commit -m "docs: complete App Clip URL invocation testing (Task 9)"
   ```
3. **Proceed to Task 10**: Create App Clip icon assets (see plan)

## Production Testing

This simulator testing is just the first phase. Full production validation requires:

- **AASA file deployed** to orbiting.app domain
- **TestFlight distribution** to testers
- **Physical device testing** (real iPhone)
- **Real invocation testing** (Safari, Messages, Maps)

See `docs/app-clip-testing.md` for comprehensive production test strategy.

## Related Documentation

- Implementation Plan: `docs/plans/2025-10-13-app-clip-support.md`
- Complete Test Strategy: `docs/app-clip-testing.md`
- AASA Requirements: `docs/aasa-file-spec.md`
- Test Results: `docs/test-results.txt`

## Questions or Issues?

If tests fail or produce unexpected results, check:
1. Console output for specific error messages
2. Xcode's Issue Navigator (⌘5) for build warnings
3. Implementation code in `Orbiting/OrbitingClip/` directory
4. Entitlements files for proper configuration

Remember: The goal is to verify URL parameter handling works correctly **before** deploying to production. Thorough testing now prevents issues later.
