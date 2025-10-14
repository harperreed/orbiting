# App Clip Testing Strategy

## Local Testing (Simulator)

### Test 1: Basic Build and Launch
```bash
xcodebuild -scheme OrbitingClip -configuration Debug -sdk iphonesimulator clean build
```
Expected: Build succeeds, no errors

Run OrbitingClip scheme in Xcode, verify:
- ✅ App launches with splash screen
- ✅ Main interface loads
- ✅ Bottom banner shows "Using Orbiting App Clip"
- ✅ "Get Full App" button visible

### Test 2: URL Invocation with Parameters

Configure scheme:
- Edit Scheme → Run → Arguments → Environment Variables
- Add: `_XCAppClipURL` = `https://orbiting.app/clip?text=Test&theme=mono`

Run and verify:
- ✅ Console shows URL invocation log
- ✅ Theme applied correctly
- ✅ No crashes

### Test 3: Shared Storage

1. Run OrbitingClip scheme
2. Create message "Test from Clip"
3. Stop app
4. Run Orbiting (main app) scheme
5. Verify message appears in history

Expected: ✅ Message persists across app/clip

### Test 4: Data Migration

1. Run OrbitingClip, create 3 messages
2. Stop app
3. Run Orbiting (main app)
4. Check console for migration logs: `✅ Migrated 3 messages from App Clip`
5. Verify messages in history

Expected: ✅ Seamless migration

---

## TestFlight Testing

### Prerequisites
- App uploaded to App Store Connect
- TestFlight build processed
- Internal testers added

### Test 5: Safari Smart Banner Invocation

**Note:** Requires AASA file hosted on orbiting.app

1. Open Safari on test device
2. Navigate to `https://orbiting.app/clip`
3. Look for App Clip card/banner at top
4. Tap to launch

Expected: ✅ App Clip launches via Safari

### Test 6: Messages Link Sharing

1. Send iMessage with `https://orbiting.app/clip?text=Hello`
2. Tap link in Messages
3. Verify App Clip launches with pre-populated text

Expected: ✅ App Clip launches from Messages

### Test 7: Maps Location Card

**Note:** Requires location registered in App Store Connect

1. Search for business in Maps
2. Look for App Clip card on location page
3. Tap to launch

Expected: ✅ App Clip launches from Maps

### Test 8: Upgrade Flow

1. Launch App Clip via any method
2. Use app, create messages
3. Tap "Get Full App"
4. Verify SKOverlay shows App Store card
5. Download full app
6. Open full app
7. Check console for migration: `✅ Migrated X messages from App Clip`
8. Verify messages appear in history

Expected: ✅ Seamless upgrade with data preserved

---

## Physical Device Testing

### Test 9: Size Verification

After archiving:
1. Xcode → Window → Organizer
2. Select archive → Distribute App → App Store Connect
3. View "App Thinning Size Report"
4. Check OrbitingClip.ipa size

Expected: ✅ < 15 MB uncompressed

### Test 10: Real-World Invocation

**Safari:**
1. Open Safari on iPhone
2. Navigate to orbiting.app/clip
3. Verify Smart Banner or App Clip card appears

**QR Code (if enabled):**
1. Generate QR code: `https://orbiting.app/clip`
2. Scan with Camera app
3. Tap notification

Expected: ✅ App Clip launches smoothly

---

## Automated Tests (Future Enhancement)

Currently manual testing only. Consider adding:
- Unit tests for URL parsing in OrbitingClip.swift
- Unit tests for StorageManager.isRunningInAppClip
- Unit tests for SharedDataMigration logic
- UI tests for App Clip banner visibility

---

## Test Checklist

### Pre-Submission
- [ ] OrbitingClip builds successfully
- [ ] Main app builds successfully
- [ ] App Clip launches in simulator
- [ ] URL invocation works (_XCAppClipURL)
- [ ] Shared storage works between targets
- [ ] Data migration works on first launch
- [ ] Banner displays correctly
- [ ] SKOverlay triggers without crashing

### TestFlight
- [ ] Uploaded to App Store Connect
- [ ] AASA file deployed and validated
- [ ] Safari invocation tested
- [ ] Messages invocation tested
- [ ] Upgrade flow tested
- [ ] Data persists after upgrade

### Physical Device
- [ ] Size < 15 MB verified
- [ ] Real Safari Smart Banner works
- [ ] Performance acceptable
- [ ] No crashes during invocation
