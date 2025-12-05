# Database Migrations

## How to Run Migrations

### Step 1: Add SPEAKING/WRITING to part_type ENUM
Run this first to update the schema:

```bash
mysql -u your_username -p your_database < 001-add-speaking-writing-to-part-type.sql
```

### Step 2: Update Existing Test Data
After schema update, run this to update existing Speaking/Writing tests:

```bash
mysql -u your_username -p your_database < 002-update-existing-test-data.sql
```

## Manual Testing Steps

### 1. Verify Schema Changes
```sql
SHOW COLUMNS FROM parts LIKE 'part_type';
```

Expected output should show ENUM includes: 'LISTENING', 'READING', 'SPEAKING', 'WRITING'

### 2. Check Test Data
```sql
SELECT t.test_id, t.title, p.part_type, COUNT(*) as count
FROM tests t
JOIN parts p ON t.test_id = p.test_id
GROUP BY t.test_id, t.title, p.part_type
ORDER BY t.test_id;
```

### 3. Test Application Flow

#### Speaking Test:
1. Navigate to test list
2. Select a Speaking test
3. Click "Làm bài" 
4. Verify in browser console:
   - `part_type` should be 'SPEAKING'
   - `skill` should be 'speaking'
   - Component should be Speaking/Part1-5

#### Writing Test:
1. Select a Writing test
2. Click "Làm bài"
3. Verify:
   - `part_type` should be 'WRITING'
   - `skill` should be 'writing'
   - Component should be Writing/Part1-3

## Rollback Instructions

If you need to rollback the changes:

```sql
-- WARNING: This will remove SPEAKING and WRITING part types
-- Make sure to backup your data first!

-- Step 1: Convert SPEAKING/WRITING back to LISTENING (or delete the parts)
UPDATE parts SET part_type = 'LISTENING' WHERE part_type IN ('SPEAKING', 'WRITING');

-- Step 2: Revert the ENUM
ALTER TABLE parts 
MODIFY COLUMN part_type ENUM('LISTENING', 'READING') NOT NULL;
```

## Troubleshooting

### Error: "Data truncated for column 'part_type'"
This means there are existing parts with invalid part_type values. 
Run this to find them:

```sql
SELECT * FROM parts WHERE part_type NOT IN ('LISTENING', 'READING');
```

### Speaking/Writing tests not showing correct components
1. Check browser console for skill detection logs
2. Verify `partData` has correct `part_type` values
3. Clear browser cache and reload
4. Check that Part.js model file has updated ENUM values

