# Quick Test Guide - App Clip URL Invocation

**⚡ Fast track guide for testing App Clip URL parameter handling**

## Step 1: Configure Scheme (One Time Setup)
```bash
open Orbiting/Orbiting.xcodeproj
```

In Xcode:
1. Select **OrbitingClip** scheme (top left)
2. **⌘⇧<** (Edit Scheme)
3. Run → Arguments → Environment Variables → **+**
4. Add:
   - Name: `_XCAppClipURL`
   - Value: `https://orbiting.app/clip?text=Hello%20from%20App%20Clip&theme=contrast`
   - ☑️ Enabled
5. Close

## Step 2: Run & Verify
1. Select iPhone 17 simulator
2. **⌘R** (Run)
3. **⌘⇧C** (Show Console)

## Expected Console Output
```
📱 App Clip invoked with URL: https://orbiting.app/clip?text=Hello%20from%20App%20Clip&theme=contrast
📝 Pre-populating with text: Hello from App Clip
🎨 Setting theme: contrast
✅ App Clip using shared container at: [path]
```

## Visual Checks
- ✅ Black background (contrast theme)
- ✅ Bottom banner: "Using Orbiting App Clip"
- ✅ "Get Full App" button visible
- ✅ Tap button → console shows "📱 Presented App Store overlay"

## Quick Test Variations
Edit the URL value in scheme and re-run:

**Text only:**
```
https://orbiting.app/clip?text=Quick%20test
```

**Theme only:**
```
https://orbiting.app/clip?theme=fire
```

**No params:**
```
https://orbiting.app/clip
```

**Invalid theme (should handle gracefully):**
```
https://orbiting.app/clip?theme=invalid&text=Test
```

## Pass Criteria
- ✅ All console logs appear
- ✅ Theme applies visually
- ✅ Banner displays at bottom
- ✅ No crashes with any URL variation

## If Something Fails
1. Verify `_XCAppClipURL` is **checked** (enabled)
2. Confirm running **OrbitingClip** scheme (not Orbiting)
3. Clean: **⌘⇧K**, then rebuild and run

## Document Results
Copy this to `docs/test-results.txt` under "ACTUAL TEST RESULTS":

```
Test 1 - URL Invocation:     [✅ PASS / ❌ FAIL]
Test 2 - Theme Application:  [✅ PASS / ❌ FAIL]
Test 3 - Banner Display:     [✅ PASS / ❌ FAIL]
Test 4 - SKOverlay:          [✅ PASS / ❌ FAIL]
Test 5 - URL Variations:     [✅ PASS / ❌ FAIL]

Issues: [none / describe any issues]
```

## Then Commit
```bash
git add docs/test-results.txt
git commit -m "test: execute App Clip URL invocation tests - all pass"
```

---

**Full Details**: See `docs/app-clip-testing-instructions.md`
**Test Procedures**: See `docs/test-results.txt`
**Task Summary**: See `docs/task-9-completion-summary.md`
