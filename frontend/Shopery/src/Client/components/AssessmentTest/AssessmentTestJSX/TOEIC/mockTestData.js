/**
 * Mock data để test TOEIC Speaking và Writing
 *
 * Cách sử dụng:
 * 1. Tạm thời mock API response trong assessmentApi.js
 * 2. Hoặc thêm vào database với test_id tương ứng
 */

// Mock data cho TOEIC Speaking (7 questions, 5 parts)
// Part 1: 2 câu (Q1-2), Part 2: 2 câu (Q3-4), Part 3: 1 câu (Q5), Part 4: 1 câu (Q6), Part 5: 1 câu (Q7)
export const mockSpeakingQuestions = {
  EC: "0",
  DT: [
    // Part 1: Questions 1-2 (2 câu)
    {
      question_id: "q_speaking_1",
      question_number: 1,
      part_number: 1,
      part_id: "p_speaking_1",
      type: "read-aloud",
      content: {
        text: "The city's annual summer festival will take place next Saturday and Sunday. There will be activities that are fun for the whole family. You can try a variety of food, hear different kinds of music, and enjoy games for all ages. Tickets cost fifteen dollars at the gate. However, if you buy your ticket in advance, you will get a ten percent discount. Tickets are available at many local stores, as well as at City Hall. Don't miss this fun event!",
      },
      max_record_seconds: 45,
    },
    {
      question_id: "q_speaking_2",
      question_number: 2,
      part_number: 1,
      part_id: "p_speaking_1",
      type: "read-aloud",
      content: {
        text: "Could we have your attention, please? We'd like to take this time to thank you for attending this athletic banquet. This has been a fantastic year for our team and our athletes. We now hold a new record for most wins in our states division. Your support has allowed us to purchase new uniforms and a new scoreboard for our field. To show our appreciation for the coaches, the staff, and our fans, we'd like to invite you to view the new scoreboard, enjoy some refreshments, and meet the team. Let's give a round of applause for the three candidates for player of the year.",
      },
      max_record_seconds: 45,
    },
    // Part 2: Questions 3-4 (2 câu)
    {
      question_id: "q_speaking_3",
      question_number: 3,
      part_number: 2,
      part_id: "p_speaking_2",
      type: "read-aloud",
      content: {
        text: "Good morning, everyone. I'm pleased to announce that our company has achieved record sales this quarter. This success is due to the hard work and dedication of all our employees. We will be hosting a celebration dinner next Friday evening at the Grand Hotel. All staff members and their families are invited. Please RSVP by Wednesday so we can make the necessary arrangements. Thank you for your continued commitment to excellence.",
      },
      max_record_seconds: 45,
    },
    {
      question_id: "q_speaking_4",
      question_number: 4,
      part_number: 2,
      part_id: "p_speaking_2",
      type: "read-aloud",
      content: {
        text: "Attention all passengers. Flight 345 to New York has been delayed due to weather conditions. The new departure time is 3:30 PM. We apologize for any inconvenience this may cause. Please check the information board for updates. Passengers with connecting flights should speak to a gate agent immediately. Refreshments will be available at the food court on the second floor.",
      },
      max_record_seconds: 45,
    },
    // Part 3: Question 5 (1 câu)
    {
      question_id: "q_speaking_5",
      question_number: 5,
      part_number: 3,
      part_id: "p_speaking_3",
      type: "read-aloud",
      content: {
        text: "Welcome to the monthly staff meeting. Today we'll be discussing several important topics including the upcoming product launch, budget allocations for next quarter, and the new employee training program. We'll also have time for questions and suggestions at the end. Please make sure your phones are on silent mode. Let's begin with the first item on the agenda.",
      },
      max_record_seconds: 45,
    },
    // Part 4: Question 6 (1 câu) - tương ứng Questions 8-10 (nhưng chỉ có 1 câu)
    {
      question_id: "q_speaking_6",
      question_number: 6,
      part_number: 4,
      part_id: "p_speaking_4",
      type: "read-aloud",
      content: {
        text: "The library will be closed this weekend for renovations. We apologize for any inconvenience. During this time, you can return books using the drop box located outside the main entrance. All due dates have been extended by one week. The library will reopen on Monday with new study rooms and updated computer facilities. We look forward to serving you with improved services.",
      },
      max_record_seconds: 45,
    },
    // Part 5: Question 7 (1 câu) - tương ứng Question 11
    {
      question_id: "q_speaking_7",
      question_number: 7,
      part_number: 5,
      part_id: "p_speaking_5",
      type: "read-aloud",
      content: {
        text: "Thank you for calling Tech Support. All our representatives are currently busy assisting other customers. Your call is important to us. Please hold and the next available representative will be with you shortly. For faster service, you can visit our website at www.techsupport.com or send us an email at support@techsupport.com. Estimated wait time is approximately five minutes.",
      },
      max_record_seconds: 45,
    },
  ],
};

// Mock data cho TOEIC Writing (8 questions, 3 parts)
// Part 1: 5 câu (Q1-5), Part 2: 2 câu (Q6-7), Part 3: 1 câu (Q8)
export const mockWritingQuestions = {
  EC: "0",
  DT: [
    // Part 1: Questions 1-5 (5 câu) - Describe Picture
    {
      question_id: "q_writing_1",
      question_number: 1,
      part_number: 1,
      part_id: "p_writing_1",
      type: "describe-picture",
      content: {
        image_file:
          "https://images.unsplash.com/photo-1601825085812-548b1c4d94b1?w=600",
      },
    },
    {
      question_id: "q_writing_2",
      question_number: 2,
      part_number: 1,
      part_id: "p_writing_1",
      type: "describe-picture",
      content: {
        image_file:
          "https://images.unsplash.com/photo-1601825085812-548b1c4d94b1?w=600",
      },
    },
    {
      question_id: "q_writing_3",
      question_number: 3,
      part_number: 1,
      part_id: "p_writing_1",
      type: "describe-picture",
      content: {
        image_file:
          "https://images.unsplash.com/photo-1601825085812-548b1c4d94b1?w=600",
      },
    },
    {
      question_id: "q_writing_4",
      question_number: 4,
      part_number: 1,
      part_id: "p_writing_1",
      type: "describe-picture",
      content: {
        image_file:
          "https://images.unsplash.com/photo-1601825085812-548b1c4d94b1?w=600",
      },
    },
    {
      question_id: "q_writing_5",
      question_number: 5,
      part_number: 1,
      part_id: "p_writing_1",
      type: "describe-picture",
      content: {
        image_file:
          "https://images.unsplash.com/photo-1601825085812-548b1c4d94b1?w=600",
      },
    },
    // Part 2: Questions 6-7 (2 câu) - Respond to Email
    {
      question_id: "q_writing_6",
      question_number: 6,
      part_number: 2,
      part_id: "p_writing_2",
      type: "respond-email",
      content: {
        email: {
          from: "update@dailyjobseeker.com",
          to: "Anna Billings",
          subject: "Daily Jobseeker update",
          sent: "March 14, 20-",
          body: "Dear Daily Jobseeker subscriber,\n\nHere is the most recent job opening:\n\nMarleyhome Inc. is looking for an experienced accountant to fill a vacancy in its Accounting Department. The company needs someone with an accounting degree and at least three years of experience. Contact Ralph Kramer, r_kramer@marleyhome.com.",
        },
        directions:
          "Respond to the e-mail as if you are interested in applying for the position. Make ONE statement about your professional background and TWO requests for information about the job.",
      },
    },
    {
      question_id: "q_writing_7",
      question_number: 7,
      part_number: 2,
      part_id: "p_writing_2",
      type: "respond-email",
      content: {
        email: {
          from: "events@cityhall.gov",
          to: "Residents",
          subject: "Community Meeting Invitation",
          sent: "April 5, 20-",
          body: "Dear Residents,\n\nWe would like to invite you to attend a community meeting to discuss the proposed park renovation project. The meeting will be held on April 15th at 7 PM in the Community Center. Your input is valuable to us.",
        },
        directions:
          "Respond to the e-mail as if you plan to attend. Make ONE statement about your interest in the project and TWO questions about the meeting details.",
      },
    },
    // Part 3: Question 8 (1 câu) - Write Essay
    {
      question_id: "q_writing_8",
      question_number: 8,
      part_number: 3,
      part_id: "p_writing_3",
      type: "write-essay",
      content: {
        text: "Do you agree or disagree with the following statement? 'Technology has made our lives more complicated rather than simpler.' Use specific reasons and examples to support your answer.",
      },
    },
  ],
};

// Mock test data để thêm vào AssessmentList
export const mockSpeakingTest = {
  test_id: "test_speaking_001",
  title: "TOEIC Speaking Practice Test",
  skill_type: "speaking",
  exam_type: "toeic",
  total_duration: 20,
  total_parts: 5, // 5 parts
  total_questions: 7,
};

export const mockWritingTest = {
  test_id: "test_writing_001",
  title: "TOEIC Writing Practice Test",
  skill_type: "writing",
  exam_type: "toeic",
  total_duration: 60,
  total_parts: 3, // 3 parts
  total_questions: 8,
};
