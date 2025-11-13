#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import json
import io

# Set UTF-8 encoding for stdout
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Add backend to path
sys.path.insert(0, r'D:\Code_PTIT\E_Learning-2\backend\src\ai')

from multiPA_score import score_writing

# Test input
test_text = "i'am art lost gwen,my um, she was my MJ, i coundn't save her. i never gonna be able to forgive myself for that"

print("=" * 80)
print("Testing Writing Assessment")
print("=" * 80)
print(f"\nInput text: {test_text}\n")

# Score the writing
result = score_writing(test_text, "en")

# Print result
print(json.dumps(result, ensure_ascii=False, indent=2))
print("\n" + "=" * 80)

