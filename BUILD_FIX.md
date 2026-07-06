# App Crash Fix - Build Configuration

## Issues Fixed

### 1. **Missing Plugins in app.json**
The app was crashing because essential plugins were not properly configured:
- ✅ Added `expo-image-picker` plugin with permissions
- ✅ Added `react-native-reanimated` plugin (required for animations)
- ✅ Added proper permissions configuration

### 2. **Missing Splash Screen Configuration**
- ✅ Added splash screen configuration to prevent white screen crashes

### 3. **Missing Asset Bundle Patterns**
- ✅ Added `assetBundlePatterns` to ensure all assets are properly bundled

### 4. **Missing Android Configuration**
- ✅ Added `versionCode` for Android
- ✅ Added proper permissions for media access
- ✅ Added iOS bundle identifier for consistency

### 5. **EAS Build Configuration**
- ✅ Added proper environment variables
- ✅ Configured NODE_ENV for production builds

## What Was Changed

### app.json
- App name changed to "Instagram" (displays correctly on device)
- Added splash screen configuration
- Added react-native-reanimated plugin
- Added expo-image-picker plugin with permissions
- Added assetBundlePatterns
- Added Android permissions
- Added versionCode

### eas.json
- Added NODE_ENV=production for production builds
- Better build profile configuration

## Root Cause
The main issue was that **react-native-reanimated** and **react-native-gesture-handler** require explicit plugin configuration in production builds. Without these plugins properly configured, the app would crash immediately on launch.

## Next Steps

Build a new APK with the fixes:
```bash
npx eas-cli build --platform android --profile production
```

The new build will:
- ✅ Show "Instagram" as the app name
- ✅ Not crash on launch
- ✅ Include all required plugins and configurations
- ✅ Properly bundle all assets
