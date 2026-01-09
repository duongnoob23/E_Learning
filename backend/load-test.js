/**
 * Load Test Script cho k6
 * 
 * Cài đặt: choco install k6 (hoặc tải từ https://k6.io)
 * Chạy: k6 run load-test.js
 * 
 * Hoặc dùng Artillery:
 * npm install -g artillery
 * artillery run load-test-artillery.yml
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

export const options = {
  stages: [
    // Warm up: 10 users trong 30s
    { duration: '30s', target: 10 },
    
    // Load test: 50 users trong 2 phút
    { duration: '2m', target: 50 },
    
    // Stress test: 100 users trong 1 phút
    { duration: '1m', target: 100 },
    
    // Spike test: 200 users trong 30s
    { duration: '30s', target: 200 },
    
    // Cool down: Giảm về 0
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% requests < 500ms
    http_req_failed: ['rate<0.01'],    // Error rate < 1%
    errors: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';
const AUTH_TOKEN = __ENV.AUTH_TOKEN || 'YOUR_TOKEN_HERE';

export default function () {
  // Test 1: Start Exam Session
  const startExamPayload = JSON.stringify({
    test_id: 1,
    session_type: 'FULL_TEST',
    selected_parts: [1, 2, 3, 4, 5, 6, 7],
    time_limit_minutes: 120,
  });

  const startExamParams = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`,
    },
    tags: { name: 'StartExamSession' },
  };

  const startRes = http.post(
    `${BASE_URL}/exam/exam-sessions/start`,
    startExamPayload,
    startExamParams
  );

  const startSuccess = check(startRes, {
    'start exam status is 200': (r) => r.status === 200,
    'start exam response time < 500ms': (r) => r.timings.duration < 500,
    'start exam has session_id': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.DT?.exam_session_id !== undefined;
      } catch {
        return false;
      }
    },
  });

  errorRate.add(!startSuccess);

  // Nếu start thành công, test auto-save
  if (startRes.status === 200) {
    try {
      const body = JSON.parse(startRes.body);
      const sessionId = body.DT?.exam_session_id;

      if (sessionId) {
        // Test 2: Auto-save answer
        const autoSavePayload = JSON.stringify({
          question_id: 1,
          selected_choice_id: 10,
        });

        const autoSaveParams = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AUTH_TOKEN}`,
          },
          tags: { name: 'AutoSaveAnswer' },
        };

        const autoSaveRes = http.post(
          `${BASE_URL}/exam/exam-sessions/${sessionId}/auto-save`,
          autoSavePayload,
          autoSaveParams
        );

        check(autoSaveRes, {
          'auto-save status is 200': (r) => r.status === 200,
          'auto-save response time < 200ms': (r) => r.timings.duration < 200,
        });
      }
    } catch (e) {
      // Ignore parse errors
    }
  }

  sleep(1); // Nghỉ 1 giây giữa các requests
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'summary.json': JSON.stringify(data),
  };
}

