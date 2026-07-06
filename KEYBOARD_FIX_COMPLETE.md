# Keyboard Dismiss Scroll-Stuck Bug Fix - COMPLETE ✅

## Summary
Fixed the keyboard dismiss scroll-stuck bug in editor mode by replacing `KeyboardAvoidingView` with `KeyboardAwareScrollView` across all tabs and modals.

## Root Cause
- `KeyboardAvoidingView` with `ScrollView` unreliably restores container height after keyboard dismissal, especially on Android
- `ScrollView` with `contentContainerStyle={{ flex: 1 }}` locks content height to viewport, preventing expansion beyond keyboard-open size
- Result: User gets permanently stuck at scroll position when keyboard was open

## Solution Implemented
Replaced all `KeyboardAvoidingView + ScrollView` patterns with `KeyboardAwareScrollView` from `react-native-keyboard-aware-scroll-view`

## Files Modified

### 1. **OverviewTab.js** ✅
- ❌ Removed: `KeyboardAvoidingView` wrapper
- ✅ Added: `KeyboardAwareScrollView` with proper configuration
- ✅ Changed: `flex: 1` → `flexGrow: 1` in container style
- ✅ Added: Dynamic `paddingBottom` based on edit mode (80px editing, 40px viewing)
- ✅ Removed: Hardcoded `<View style={{ height: 40 }} />` spacer

### 2. **EngagementTab.js** ✅
- ❌ Removed: `KeyboardAvoidingView` wrapper
- ✅ Added: `KeyboardAwareScrollView` with proper configuration
- ✅ Changed: `flex: 1` → `flexGrow: 1` in container style
- ✅ Added: Dynamic `paddingBottom` based on edit mode (80px editing, 40px viewing)
- ✅ Removed: Hardcoded spacer

### 3. **AudienceTab.js** ✅
- ❌ Removed: `KeyboardAvoidingView` wrapper
- ✅ Added: `KeyboardAwareScrollView` with proper configuration
- ✅ Changed: `flex: 1` → `flexGrow: 1` in container style
- ✅ Added: Dynamic `paddingBottom` based on edit mode (80px editing, 40px viewing)
- ✅ Removed: Hardcoded spacer

### 4. **ReelInsightsScreen.js** ✅
- ✅ Added: `Keyboard` import from `react-native`
- ✅ Added: `handleTabChange` function that dismisses keyboard before switching tabs
- ✅ Updated: `<Tabs>` component to use `handleTabChange` instead of direct `setActiveTab`
- ✅ Added: `keyboardShouldPersistTaps="handled"` to main `ScrollView`

### 5. **Header.js** ✅
- ✅ Added: `Keyboard` import from `react-native`
- ✅ Added: `handleDone` function that:
  - Dismisses keyboard immediately
  - Waits 100ms for keyboard animation to complete
  - Then exits edit mode
- ✅ Updated: Done button to call `handleDone` instead of direct dispatch

### 6. **ViewsOverTimeModal.js** ✅
- ❌ Removed: `KeyboardAvoidingView` wrapper around modal content
- ✅ Added: `KeyboardAwareScrollView` for the modal scroll area
- ✅ Updated: `handleSave` to dismiss keyboard before closing modal
- ✅ Changed: Modal structure to use plain `View` wrapper instead of `KeyboardAvoidingView`
- ✅ Added: `flex: 1` to modalScroll style for proper layout

## Configuration Used

All `KeyboardAwareScrollView` instances use this standard configuration:

```javascript
<KeyboardAwareScrollView
  contentContainerStyle={[
    styles.container,
    { paddingBottom: state.isEditing ? 80 : 40 }
  ]}
  keyboardShouldPersistTaps="handled"
  enableOnAndroid={true}
  enableAutomaticScroll={true}
  extraScrollHeight={24}
  showsVerticalScrollIndicator={false}
>
```

### Key Props Explained:
- **`contentContainerStyle={{ flexGrow: 1 }}`** - Allows content to expand beyond viewport
- **`keyboardShouldPersistTaps="handled"`** - Prevents double-tap requirement on interactive elements
- **`enableOnAndroid={true}`** - Essential for Android support
- **`enableAutomaticScroll={true}`** - Auto-scrolls to focused input
- **`extraScrollHeight={24}`** - Adds breathing room above keyboard
- **`paddingBottom`** - 80px in edit mode, 40px otherwise (prevents last item from hiding behind keyboard)

## Additional Fixes Applied

### Fix 1: Remove `flex: 1` from contentContainerStyle ✅
Replaced all `flex: 1` with `flexGrow: 1` in scroll container styles to allow content expansion.

### Fix 2: Add `keyboardShouldPersistTaps="handled"` ✅
Added to all scroll components to prevent UX confusion where users need to tap twice.

### Fix 3: Dismiss keyboard on tab switch ✅
Implemented `handleTabChange` in `ReelInsightsScreen.js` that calls `Keyboard.dismiss()` before switching tabs.

### Fix 4: Dismiss keyboard on Done button ✅
Implemented `handleDone` in `Header.js` that:
1. Dismisses keyboard
2. Waits 100ms for animation
3. Exits edit mode

### Fix 5: Add bottom padding in edit mode ✅
All tabs now use dynamic `paddingBottom: state.isEditing ? 80 : 40` to provide breathing room for last editable items.

## Dependencies Installed

```bash
npx expo install react-native-keyboard-aware-scroll-view
```

Package: `react-native-keyboard-aware-scroll-view@0.9.5` (or latest)

## Test Checklist

To verify the fix works correctly:

- [ ] **Test 1**: Open editor mode → scroll to "What affects your views" → tap "Skip rate" label → change text → dismiss keyboard → confirm you can scroll further down to "Top sources of views"

- [ ] **Test 2**: Open editor mode → scroll to "Top sources of views" → tap a source name → change it → dismiss keyboard → confirm "Reels tab" and other rows are still reachable by scrolling

- [ ] **Test 3**: Switch tabs (Overview/Engagement/Audience) while an input is focused → confirm keyboard dismisses cleanly

- [ ] **Test 4**: Tap "Done" header button while editing a field → confirm keyboard dismisses before edit mode deactivates

- [ ] **Test 5**: Open "Edit chart points" modal → edit values → tap Done → confirm keyboard dismisses and modal closes smoothly

- [ ] **Test 6**: Test on **iOS** - verify smooth keyboard handling

- [ ] **Test 7**: Test on **Android** - verify `enableOnAndroid={true}` works correctly

## What Was NOT Changed

- ❌ Did NOT reintroduce `KeyboardAvoidingView` anywhere
- ❌ Did NOT set fixed heights on scroll containers
- ❌ Did NOT wrap `KeyboardAwareScrollView` inside `KeyboardAvoidingView`
- ❌ Did NOT modify the context or state management
- ❌ Did NOT change editable component behavior

## Verification Status

✅ All files compile without errors
✅ No TypeScript/ESLint diagnostics found
✅ Library successfully installed
✅ All imports updated correctly
✅ All scroll containers properly configured

## Next Steps

1. Test the app on both iOS and Android devices
2. Verify all items in the test checklist
3. If any scrolling issues persist, check for:
   - Parent container height constraints
   - Nested ScrollView/FlatList components
   - Custom gesture handlers that might interfere

---

**Fix completed on:** 2026-06-22  
**Total files modified:** 6  
**Lines changed:** ~120  
**Status:** ✅ READY FOR TESTING
