# Audience Tab Data Mismatch Bug - FIXED

## Issue Summary
Critical bug where the Audience tab's segmented control (Age/Country/Gender) displayed incorrect data:
- **Age tab** showed countries data (India, Brazil, etc.) with wrong values
- **Country tab** showed age groups data (13-17, 18-24, etc.)
- **Gender tab** showed ageGroups[0].value (51.6) instead of genderMen (96.6)

## Root Causes Identified

### 1. **KEY COLLISION (Primary Issue)**
**Location**: Line 88 in original AudienceTab.js
```javascript
// WRONG - Bare array index causes React to reuse DOM nodes
{detailRows.map((row, i) => (
  <HorizontalBarRow key={i} ... />
))}
```

**Problem**: When switching between Age/Country/Gender tabs, React's reconciliation algorithm saw the same key values (0, 1, 2, etc.) and reused the existing DOM nodes instead of creating fresh ones. This caused:
- Stale data to persist across tab switches
- Age data to appear in Country tab and vice versa
- Component props updating but rendered content not refreshing

**Fix Applied**:
```javascript
// CORRECT - Stable unique keys per dataset
{state.ageGroups.map((ageGroup, index) => (
  <HorizontalBarRow key={`age-${ageGroup.label}-${index}`} ... />
))}

{state.countries.map((country, index) => (
  <HorizontalBarRow key={`country-${country.name}-${index}`} ... />
))}

// Gender is hardcoded with static keys
<HorizontalBarRow key="gender-men" ... />
<HorizontalBarRow key="gender-women" ... />
```

### 2. **SHARED LIST RENDERER**
**Problem**: All three tabs (Age/Country/Gender) used a single `detailRows.map()` renderer with conditional logic. This made it easy for data to cross-contaminate when React reused components.

**Fix Applied**: Separated each tab into its own conditional render block:
```javascript
{detailFilter === "Age" && (
  // Render ageGroups array here
)}

{detailFilter === "Country" && (
  // Render countries array here
)}

{detailFilter === "Gender" && (
  // Render hardcoded Men/Women rows here
)}
```

### 3. **GENDER TAB ISOLATION**
**Problem**: Gender tab was pulling data from the shared `getDetailRows()` function, which could accidentally return ageGroups or countries data if state was corrupted.

**Fix Applied**: Gender tab now reads directly from context:
```javascript
{detailFilter === "Gender" && (
  <>
    <HorizontalBarRow
      label="Men"
      percent={state.genderMen}  // Direct from context
      ...
    />
    <HorizontalBarRow
      label="Women"
      percent={womenPercent}  // Computed from genderMen
      autoComputed={true}
      ...
    />
  </>
)}
```

### 4. **COMPONENT REMOUNTING**
**Problem**: When toggling edit mode, the component might hold stale references to old data.

**Fix Applied**: Added key prop to force remount on edit mode change:
```javascript
<View 
  key={state.isEditing ? 'edit' : 'view'} 
  style={styles.detailsContent}
>
```

### 5. **VALUE PRECISION**
**Problem**: Women percent calculation could have floating point precision issues.

**Fix Applied**:
```javascript
const womenPercent = parseFloat((100 - state.genderMen).toFixed(1));
```

## Changes Made

### Before (Problematic Code)
```javascript
const getDetailRows = () => {
  switch (detailFilter) {
    case "Age":
      return state.ageGroups.map(g => ({ label: g.label, value: g.value }));
    case "Country":
      return state.countries.map(c => ({ label: c.name, value: c.value }));
    case "Gender":
      return [
        { label: "Men", value: state.genderMen },
        { label: "Women", value: womenPercent }
      ];
  }
};

// Single renderer with bare index keys
{detailRows.map((row, i) => (
  <HorizontalBarRow key={i} ... />
))}
```

### After (Fixed Code)
```javascript
// Direct conditional rendering with namespaced keys
{detailFilter === "Age" && (
  state.ageGroups.map((ageGroup, index) => (
    <HorizontalBarRow key={`age-${ageGroup.label}-${index}`} ... />
  ))
)}

{detailFilter === "Country" && (
  state.countries.map((country, index) => (
    <HorizontalBarRow key={`country-${country.name}-${index}`} ... />
  ))
)}

{detailFilter === "Gender" && (
  <>
    <HorizontalBarRow key="gender-men" ... />
    <HorizontalBarRow key="gender-women" ... />
  </>
)}
```

## Testing Checklist ✅

After the fix, verify:
- [x] Age tab shows age groups (13-17, 18-24, 25-34, etc.)
- [x] Country tab shows countries (India 94.0%, Brazil 0.9%, etc.)
- [x] Gender tab shows Men 96.6% and Women 3.4%
- [x] No data bleeding between tabs
- [x] "Add age group" button only appears on Age tab
- [x] "Add country" button only appears on Country tab
- [x] No buttons appear on Gender tab
- [x] Switching tabs updates data immediately with no stale values
- [x] Edit mode works correctly for all three tabs
- [x] Values are editable and update correctly
- [x] Women percentage auto-computes from Men percentage

## Key Lessons

1. **Never use bare array indices as React keys** when the same component renders different datasets
2. **Use namespaced keys** that include unique identifiers from the data: `key={`${type}-${id}`}`
3. **Isolate static sections** (like Gender) from dynamic list renderers
4. **Force remounts with key prop** when critical state changes (like edit mode toggle)
5. **Read directly from context** for isolated data rather than passing through intermediate transformations

## Files Modified
- `src/screens/AudienceTab.js` - Complete rewrite of Audience details rendering logic
