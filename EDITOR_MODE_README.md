# Editor Mode Feature

This document describes the implementation of the editor mode feature for the Reel Insights Clone app.

## Overview

Editor mode allows users to edit all data displayed in the Instagram Reel Insights screen. When activated, users can modify:
- Video thumbnail
- Engagement metrics (likes, comments, reposts, shares, saves)
- Summary statistics (views, accounts reached, watch time, follows)
- Views over time chart data
- Rate values and labels
- Top sources of views
- Profile visits and interactions
- Audience demographics (age, country, gender splits)

## Implementation Structure

### Context Management (`src/context/ReelDataContext.js`)
- **ReelDataProvider**: Context provider that wraps the entire app
- **useReelData**: Hook to access state and dispatch actions
- **State**: Contains all editable data plus `isEditing` boolean
- **Persistence**: All changes automatically saved to AsyncStorage
- **Reset**: Menu option to reset data to defaults

### Core Components

#### Editable Components
- **EditableNumber** (`src/components/EditableNumber.js`)
  - Renders as Text in read mode
  - Renders as TextInput with magenta underline in edit mode
  - Supports suffix (e.g., "%") and custom formatters
  
- **EditableText** (`src/components/EditableText.js`)
  - Same as EditableNumber but for text fields
  - Used for labels and non-numeric values

#### UI Components
- **EditModeBadge** (`src/components/EditModeBadge.js`)
  - Magenta pill badge showing "✏ Editing"
  - Replaces title in header during edit mode

- **FadeToast** (`src/components/FadeToast.js`)
  - Animated toast message
  - Shows "Tap any number or label to edit" on first edit mode activation

- **ViewsOverTimeModal** (`src/components/ViewsOverTimeModal.js`)
  - Bottom sheet modal for editing chart data points
  - 7 rows with inputs for "This reel" and "Typical" values
  - Auto-saves on close

### Updated Components

#### Header (`src/components/Header.js`)
- **Read mode**: Shows title with small pencil icon hint
- **Edit mode**: Shows EditModeBadge and "Done" button
- Title is tappable to enter edit mode
- Kebab menu opens reset dialog

#### VideoPreviewCard (`src/components/VideoPreviewCard.js`)
- Displays user-selected thumbnail when set
- Shows "Change thumbnail" button in edit mode
- Uses expo-image-picker to select photos

#### EngagementIconRow (`src/components/EngagementIconRow.js`)
- All counts (likes, comments, etc.) are editable
- Updates context in real-time

#### SectionHeading (`src/components/SectionHeading.js`)
- Shows 3px magenta left border in edit mode
- Visual indicator that section is editable

#### RateRow & HorizontalBarRow
- Both label and value editable
- Trash icon to delete rows (minimum 1 required)
- Pink background tint for editable rows in edit mode

#### DualLineChart (`src/components/DualLineChart.js`)
- Accepts data as prop instead of hardcoded values
- Auto-scales Y-axis based on data range
- Rounds to nearest 5000 for clean labels

### Tab Screens

#### OverviewTab (`src/screens/OverviewTab.js`)
- Summary cards: all 4 values editable
- Views chart: "Edit chart data" button opens modal
- Rates: label and value editable, can delete
- Top sources: label and value editable, can add/delete
- KeyboardAvoidingView for mobile keyboards

#### EngagementTab (`src/screens/EngagementTab.js`)
- All numeric values editable (profile visits, follows, interactions)
- SimpleRow component wraps EditableNumber

#### AudienceTab (`src/screens/AudienceTab.js`)
- Followers % editable, non-followers auto-computed
- Age groups: label and value editable, can add/delete
- Countries: label and value editable, can add/delete
- Gender: Men % editable, women auto-computed
- Auto-computed values show "auto" badge and italic gray style

## Visual Design

### Edit Mode Indicators
1. **Header**: EditModeBadge replaces title, "Done" replaces icons
2. **Sections**: 3px magenta left border on section headings
3. **Rows**: Very subtle pink background (#FFF8FD) on editable rows
4. **Fields**: Magenta underline appears on focus
5. **Toast**: Semi-transparent black pill at bottom on first activation

### Color Palette
- **Magenta**: #DD2A7B (primary edit color)
- **Edit bg**: #FFF8FD (subtle pink tint)
- **Delete red**: #FF3B30
- **Gray text**: #8E8E8E

## User Flow

1. **Enter Edit Mode**: Tap "Reel insights" title (with pencil icon)
2. **See Toast**: "Tap any number or label to edit" (first time only)
3. **Edit Fields**: Tap any number or label to edit inline
4. **Edit Chart**: Tap "Edit chart data" card to open modal
5. **Change Thumbnail**: Tap "Change thumbnail" button below video
6. **Add/Delete Items**: Use + button to add, trash icon to delete
7. **Exit Edit Mode**: Tap "Done" button in header
8. **Reset Data**: Tap kebab menu → "Reset data" (with confirmation)

## Data Persistence

- All edits saved to AsyncStorage with key `@reelInsights:data`
- Automatic save on every state change
- Data loaded on app startup
- Reset option clears storage and restores defaults

## Platform Compatibility

- **iOS**: KeyboardAvoidingView with "padding" behavior
- **Android**: KeyboardAvoidingView with "height" behavior
- **Web**: Works but keyboard behavior may vary

## Dependencies Added

- `@react-native-async-storage/async-storage`: Data persistence
- `expo-image-picker`: Photo selection for thumbnail

## Future Enhancements (Not Implemented)

- Retention curve editing (currently shows "coming soon" tooltip)
- Undo/redo functionality
- Export/import data as JSON
- Multiple reel profiles
- Cloud sync across devices
