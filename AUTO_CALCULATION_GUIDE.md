# Auto-Calculation System for Engagement Rates

## ✅ What Was Added

An automatic calculation system that computes engagement rate percentages based on the **Accounts Reached** value and individual engagement metrics.

## 🔢 How It Works

### Formula
```
Rate % = (Engagement Count / Accounts Reached) × 100
```

### Auto-Calculated Rates

When you edit any of these fields, the rates automatically recalculate:

| Rate | Calculation | Example |
|------|-------------|---------|
| **Skip Rate** | `((Accounts Reached - Views) / Accounts Reached) × 100` | If 9,601 reached but only 8,000 views = 16.7% skip rate |
| **Like Rate** | `(Likes / Accounts Reached) × 100` | 662 likes ÷ 9,601 reached = 6.9% like rate |
| **Comment Rate** | `(Comments / Accounts Reached) × 100` | 15 comments ÷ 9,601 reached = 0.2% comment rate |
| **Repost Rate** | `(Reposts / Accounts Reached) × 100` | 22 reposts ÷ 9,601 reached = 0.2% repost rate |
| **Share Rate** | `(Shares / Accounts Reached) × 100` | 921 shares ÷ 9,601 reached = 9.6% share rate |
| **Save Rate** | `(Saves / Accounts Reached) × 100` | 53 saves ÷ 9,601 reached = 0.6% save rate |

## 📱 Where to Edit Values

### Overview Tab (Summary Section):
- ✏️ **Accounts Reached** - The denominator for all rate calculations
- ✏️ **Views** - Used for skip rate calculation

### Engagement Tab (Interactions Section):
- ✏️ **Likes** - Updates like rate
- ✏️ **Comments** - Updates comment rate
- ✏️ **Reposts** - Updates repost rate
- ✏️ **Shares** - Updates share rate
- ✏️ **Saves** - Updates save rate

## 🎯 Usage Example

### Scenario: Update Accounts Reached

1. Enable **Editor Mode** (toggle at top)
2. Go to **Overview** tab
3. Tap on **Accounts Reached** (e.g., change from 9,601 to 10,000)
4. Watch as **all rates** automatically recalculate in real-time!

```
Before: 9,601 reached
- Like rate: 6.9% (662 likes)
- Share rate: 9.6% (921 shares)

After: 10,000 reached
- Like rate: 6.6% (662 likes) ✅ Auto-updated!
- Share rate: 9.2% (921 shares) ✅ Auto-updated!
```

### Scenario: Update Engagement Count

1. Enable **Editor Mode**
2. Go to **Engagement** tab
3. Tap on **Likes** (e.g., change from 662 to 1,000)
4. Return to **Overview** tab
5. See the **Like rate** automatically updated!

```
Before: 662 likes, 9,601 reached
- Like rate: 6.9%

After: 1,000 likes, 9,601 reached
- Like rate: 10.4% ✅ Auto-updated!
```

## 🔄 What Triggers Recalculation

The system automatically recalculates when you edit:
- ✅ Accounts Reached
- ✅ Views
- ✅ Likes
- ✅ Comments
- ✅ Reposts
- ✅ Shares
- ✅ Saves

## 💡 Smart Features

### Zero Division Protection
If **Accounts Reached** is 0, rates show as **0%** (no errors)

### Precision
All rates are rounded to **1 decimal place** (e.g., 6.7%, not 6.689%)

### Real-time Updates
Changes are **instant** - no need to save or refresh

### Consistent Base
All engagement rates use **Accounts Reached** as the denominator (not Views) to match Instagram's standard

## 📊 Visual Indicator

In the **"What affects your views"** section:
- Rates display with their calculated percentage
- Values update in real-time as you type
- Changes are saved automatically to AsyncStorage

## 🎨 Example Walkthrough

### Step 1: Check Current Values
```
Overview Tab:
- Accounts Reached: 9,601
- Views: 11,891

Engagement Tab:
- Likes: 662
- Shares: 921
```

### Step 2: View Current Rates
```
What affects your views:
- Skip rate: 34.9%
- Share rate: 9.6%
- Like rate: 6.9%
- Save rate: 0.6%
```

### Step 3: Update Accounts Reached
```
Change to: 12,000
```

### Step 4: See Auto-Calculated Results
```
What affects your views:
- Skip rate: 0.8% ✅ (11,891 views / 12,000)
- Share rate: 7.7% ✅ (921 / 12,000)
- Like rate: 5.5% ✅ (662 / 12,000)
- Save rate: 0.4% ✅ (53 / 12,000)
```

## 🔍 Technical Details

### Implementation Location
`src/context/ReelDataContext.js` → `UPDATE_FIELD` action

### Calculation Logic
```javascript
const calculateRate = (count) => {
  if (accountsReached > 0) {
    return parseFloat(((count / accountsReached) * 100).toFixed(1));
  }
  return 0;
};
```

### Skip Rate Special Case
```javascript
const calculateSkipRate = () => {
  if (accountsReached > 0 && views > 0) {
    const skipped = accountsReached - views;
    if (skipped > 0) {
      return parseFloat(((skipped / accountsReached) * 100).toFixed(1));
    }
  }
  return 0;
};
```

## ⚠️ Important Notes

1. **Skip Rate Logic**: If Views > Accounts Reached, skip rate = 0% (can't skip if more viewed than reached)
2. **Persistence**: All calculated values are saved to AsyncStorage automatically
3. **Editor Mode Required**: Editing only works when Editor Mode is enabled
4. **Manual Override**: You can still manually edit rate values if needed (they won't auto-calculate again unless you change the source values)

## 🎓 Best Practices

### For Accurate Rates:
1. Always set **Accounts Reached** first
2. Then set individual engagement counts
3. Verify the calculated rates make sense
4. Remember: rates should typically be single digits (except views-based metrics)

### Typical Instagram Rates:
- Share rate: 5-15% (high = viral)
- Like rate: 5-10% (normal)
- Save rate: 0.5-2% (good)
- Comment rate: 0.1-0.5% (normal)
- Skip rate: 20-40% (lower is better)

## 🚀 Benefits

✅ **Accuracy**: No manual calculation errors
✅ **Speed**: Instant updates as you type
✅ **Consistency**: Same formula used across all rates
✅ **Flexibility**: Can still manually edit if needed
✅ **User-friendly**: Works automatically in the background
