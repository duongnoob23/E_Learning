-- ============================================
-- INSERT LESSON: Tìm cặp Từ vựng TOEIC
-- Lesson ID: 72
-- Module ID: 12
-- Course ID: 4
-- ============================================

INSERT INTO lessons (
    lesson_id,
    module_id,
    course_id,
    title,
    description,
    content,
    video_url,
    video_duration,
    file_attachment,
    sort_order,
    lesson_type,
    has_exercise,
    exercise_type,
    exercise_data,
    exercise_duration,
    pass_score,
    max_score,
    is_free,
    is_active,
    view_count,
    created_at,
    updated_at
) VALUES (
    72,
    12,
    4,
    'Tìm cặp: 80 Từ vựng TOEIC',
    'Bài tập ghép từ tiếng Anh với nghĩa tiếng Việt tương ứng. Mỗi câu hỏi có 8 từ (4 cặp), học viên cần ghép đúng từ với nghĩa của nó.',
    'Luyện tập từ vựng TOEIC thông qua bài tập tìm cặp. Ghép các từ tiếng Anh ở cột trái với nghĩa tiếng Việt ở cột phải. Click vào từ để chọn, sau đó click vào nghĩa tương ứng để ghép cặp. Mỗi câu hỏi có 8 từ (4 cặp).',
    NULL,
    NULL,
    NULL,
    3,  -- sort_order (sau flashcard và multiple choice)
    'quiz',  -- lesson_type
    TRUE,  -- has_exercise
    'pair_matching',  -- exercise_type
    '[{"question_id":1,"pairs":[{"word":"abandon","meaning":"bỏ rơi, ruồng bỏ","image_url":"/media/vocabs_media/img/7_abandon.jpg"},{"word":"abolish","meaning":"cancel, revoke","image_url":"/media/vocabs_media/img/5_abolish.jpg"},{"word":"absolute","meaning":"hoàn toàn","image_url":"/media/vocabs_media/img/6_absolute.jpg"},{"word":"absorb","meaning":"suck up; take up, take in","image_url":"/media/vocabs_media/img/5_absorb.jpg"},{"word":"abstract","meaning":"lý thuyết, trừu tượng","image_url":"/media/vocabs_media/img/6_abstract.jpg"},{"word":"absurd","meaning":"ngớ ngẩn, lố bịch","image_url":"/media/vocabs_media/img/7_absurd.jpg"},{"word":"access","meaning":"tiếp cận, sử dụng","image_url":"/media/vocabs_media/img/5_access.jpg"},{"word":"accommodate","meaning":"host guests; provide lodging; adapt oneself; give, bestow","image_url":"/media/vocabs_media/img/5_accommodate.jpg"}],"shuffle":true},{"question_id":2,"pairs":[{"word":"accompany","meaning":"đồng hành, đi cùng, hộ tống","image_url":"/media/vocabs_media/img/7_accompany.jpg"},{"word":"accuracy","meaning":"preciseness, exactness","image_url":"/media/vocabs_media/img/5_accuracy.jpg"},{"word":"accuse","meaning":"buộc tội, tố cáo","image_url":"/media/vocabs_media/img/7_accuse.jpg"},{"word":"acquire","meaning":"thu được, đạt được","image_url":"/media/vocabs_media/img/5_acquire.jpg"},{"word":"acquisition","meaning":"sự giành được, thu được, đạt được (kiến thức, kĩ năng)","image_url":"/media/vocabs_media/img/7_acquisition.jpg"},{"word":"activate","meaning":"kích hoạt","image_url":"/media/vocabs_media/img/5_activate.jpg"},{"word":"acute","meaning":"nhanh nhạy, sắc sảo","image_url":"/media/vocabs_media/img/6_acute.jpg"},{"word":"adapt","meaning":"thích nghi (với môi trường...)","image_url":"/media/vocabs_media/img/5_adapt.jpg"}],"shuffle":true},{"question_id":3,"pairs":[{"word":"address","meaning":"phân tích và đề xuất cách giải quyết một vấn đề nào đó","image_url":"/media/vocabs_media/img/6_address2.jpg"},{"word":"adequate","meaning":"đủ, đầy đủ","image_url":"/media/vocabs_media/img/5_adequate.jpg"},{"word":"adhere","meaning":"stick to, cling to; be devoted to (an idea, group, etc.)","image_url":"/media/vocabs_media/img/5_adhere.jpg"},{"word":"adjacent","meaning":"kế bên, gần","image_url":"/media/vocabs_media/img/7_adjacent.jpg"},{"word":"adjust","meaning":"điều chỉnh, làm cho thích hợp","image_url":"/media/vocabs_media/img/5_adjust.jpg"},{"word":"adolescent","meaning":"thanh niên","image_url":"/media/vocabs_media/img/5_adolescent.jpg"},{"word":"adopt","meaning":"áp dụng (một phương pháp, một cách nhìn mới, ...)","image_url":"/media/vocabs_media/img/5_adopt.jpg"},{"word":"advocate","meaning":"ủng hộ, tán thành","image_url":"/media/vocabs_media/img/6_advocate.gif"}],"shuffle":true},{"question_id":4,"pairs":[{"word":"aesthetic","meaning":"(thuộc) mỹ học, thẩm mỹ","image_url":"/media/vocabs_media/img/6_aesthetic.jpg"},{"word":"affect","meaning":"ảnh hưởng đến, tác động đến","image_url":"/media/vocabs_media/img/5_affect.jpg"},{"word":"allocate","meaning":"ration; allot, set aside; designate a portion of system resources for a particular task or operation (Computers)","image_url":"/media/vocabs_media/img/7_allocate.png"},{"word":"alter","meaning":"thay đổi; làm cho cái gì đó thay đổi","image_url":"/media/vocabs_media/img/7_alter.jpg"},{"word":"alternative","meaning":"sự lựa chọn","image_url":"/media/vocabs_media/img/5_alternative.jpg"},{"word":"analogy","meaning":"sự so sánh những đặc điểm tương tự; sự tương tự, sự giống nhau","image_url":"/media/vocabs_media/img/6_analogy.jpg"},{"word":"analyse","meaning":"phân tích","image_url":"/media/vocabs_media/img/5_analyse.jpg"},{"word":"anonymous","meaning":"giấu tên, ẩn danh","image_url":"/media/vocabs_media/img/7_anonymous.jpg"}],"shuffle":true},{"question_id":5,"pairs":[{"word":"anticipate","meaning":"đoán trước, liệu trước","image_url":"/media/vocabs_media/img/7_anticipate.jpg"},{"word":"apparatus","meaning":"dụng cụ, thiết bị cho một hoạt động","image_url":"/media/vocabs_media/img/7_apparatus.jpg"},{"word":"appeal","meaning":"hấp dẫn, lôi cuốn","image_url":"/media/vocabs_media/img/7_appeal.jpg"},{"word":"appealing","meaning":"hấp dẫn, thú vị","image_url":"/media/vocabs_media/img/5_appealing.jpg"},{"word":"appetite","meaning":"desire, hunger","image_url":"/media/vocabs_media/img/5_appetite.jpg"},{"word":"appreciate","meaning":"tăng giá trị/lên giá (hàng hoá...) theo thời gian","image_url":"/media/vocabs_media/img/6_appreciate.jpg"},{"word":"appropriate","meaning":"thích hợp, thích đáng","image_url":"/media/vocabs_media/img/5_appropriate.jpg"},{"word":"arbitrary","meaning":"wanton, reckless; uncontrolled, unrestricted; unreasonable, unsupported","image_url":"/media/vocabs_media/img/6_arbitrary.jpg"}],"shuffle":true},{"question_id":6,"pairs":[{"word":"articulate","meaning":"diễn đạt suy nghĩ/cảm xúc một cách rõ ràng bằng lời","image_url":"/media/vocabs_media/img/6_articulate.jpg"},{"word":"artificial","meaning":"not genuine, simulated","image_url":"/media/vocabs_media/img/5_artificial.jpg"},{"word":"aspect","meaning":"point of view, facet; appearance, outlook; direction; action of a verb without relating to its time","image_url":"/media/vocabs_media/img/5_aspect.jpg"},{"word":"assert","meaning":"state, declare; insist on","image_url":"/media/vocabs_media/img/7_assert.png"},{"word":"assess","meaning":"đánh giá","image_url":"/media/vocabs_media/img/5_assess.jpg"},{"word":"asset","meaning":"của cải, tài sản","image_url":"/media/vocabs_media/img/5_asset.jpg"},{"word":"assignment","meaning":"task, mission; transfer of ownership or rights","image_url":"/media/vocabs_media/img/5_assignment.jpg"},{"word":"assist","meaning":"giúp đỡ, hỗ trợ","image_url":"/media/vocabs_media/img/5_assist.jpg"}],"shuffle":true},{"question_id":7,"pairs":[{"word":"associate","meaning":"gắn kết, kết nối (những ý nghĩ về người hoặc vật)","image_url":"/media/vocabs_media/img/7_associate.png"},{"word":"asylum","meaning":"shelter, refuge; hospital for the mentally ill","image_url":"/media/vocabs_media/img/7_asylum.jpg"},{"word":"atmosphere","meaning":"bầu không khí (nghĩa bóng)","image_url":"/media/vocabs_media/img/5_atmosphere.jpg"},{"word":"attitude","meaning":"thái độ, quan điểm","image_url":"/media/vocabs_media/img/5_attitude.jpg"},{"word":"attribute","meaning":"đức tính, đặc tính","image_url":"/media/vocabs_media/img/7_attribute2.jpg"},{"word":"authentic","meaning":"đích thực; xác thực","image_url":"/media/vocabs_media/img/7_authentic.jpg"},{"word":"automatic","meaning":"operating by itself; unintentional","image_url":"/media/vocabs_media/img/5_automatic.jpg"},{"word":"autonomy","meaning":"independence","image_url":"/media/vocabs_media/img/6_autonomy.jpg"}],"shuffle":true},{"question_id":8,"pairs":[{"word":"abet","meaning":"xúi giục","image_url":"/media/vocabs_media/img/7_abet.jpg"},{"word":"abhor","meaning":"ghê tởm; ghét cay ghét đắng","image_url":"/media/vocabs_media/img/6_abhor.jpg"},{"word":"abject","meaning":"khốn khổ và hết hy vọng","image_url":"/media/vocabs_media/img/7_abject.jpg"},{"word":"abridge","meaning":"rút ngắn lại, cắt bớt (sách, vở kịch,...)","image_url":"/media/vocabs_media/img/6_abridge.jpg"},{"word":"abrogate","meaning":"bãi bỏ (luật lệ, thỏa thuận,...)","image_url":"/media/vocabs_media/img/7_abrogate.jpg"},{"word":"abrupt","meaning":"bất ngờ, đột ngột (một cách khó chịu)","image_url":"/media/vocabs_media/img/7_abrupt.jpg"},{"word":"abstemious","meaning":"tiết chế, có điều độ","image_url":"/media/vocabs_media/img/6_abstemious.png"},{"word":"accede","meaning":"đồng ý, tán thành một ý kiến, đề nghị,...","image_url":"/media/vocabs_media/img/7_accede.jpg"}],"shuffle":true},{"question_id":9,"pairs":[{"word":"accentuate","meaning":"tô điểm, làm nổi bật","image_url":"/media/vocabs_media/img/7_accentuate.jpg"},{"word":"acclaim","meaning":"ca ngợi, tán dương","image_url":"/media/vocabs_media/img/6_acclaim.png"},{"word":"accolade","meaning":"sự vinh danh/phần thưởng cho thành tựu mà mọi người ngưỡng mộ","image_url":"/media/vocabs_media/img/6_accolade.jpg"},{"word":"accord","meaning":"hiệp định, hiệp ước","image_url":"/media/vocabs_media/img/7_accord.jpg"},{"word":"acrimonious","meaning":"chua cay, gay gắt","image_url":"/media/vocabs_media/img/6_acrimonious.jpg"},{"word":"acumen","meaning":"sự nhạy bén","image_url":"/media/vocabs_media/img/6_acumen.png"},{"word":"admonish","meaning":"khiển trách, la rầy","image_url":"/media/vocabs_media/img/6_admonish.jpg"},{"word":"advent","meaning":"sự ra đời, sự xuất hiện","image_url":"/media/vocabs_media/img/7_advent.jpg"}],"shuffle":true},{"question_id":10,"pairs":[{"word":"adversary","meaning":"đối thủ","image_url":"/media/vocabs_media/img/7_adversary.jpg"},{"word":"adversity","meaning":"nghịch cảnh","image_url":"/media/vocabs_media/img/7_adversity.jpg"},{"word":"affable","meaning":"hoà nhã, dễ gần","image_url":"/media/vocabs_media/img/6_affable.jpg"},{"word":"affluent","meaning":"giàu có","image_url":"/media/vocabs_media/img/7_affluent.jpg"},{"word":"aforementioned","meaning":"đã kể trước đây, đã nói ở trên","image_url":"/media/vocabs_media/img/7_aforementioned.jpg"},{"word":"aggravate","meaning":"làm trầm trọng thêm, làm nặng thêm","image_url":"/media/vocabs_media/img/5_aggravate.jpg"},{"word":"agitate","meaning":"tranh luận, vận động (cho một điều gì, đặc biệt là để thay đổi một điều luật hoặc một điều gì đó trong xã hội)","image_url":"/media/vocabs_media/img/7_agitate.jpg"},{"word":"alacrity","meaning":"sự sốt sắng","image_url":"/media/vocabs_media/img/6_alacrity.jpg"}],"shuffle":true}]',  -- exercise_data (JSON)
    30,  -- exercise_duration (ước tính: 3 phút/câu)
    60,  -- pass_score (60%)
    40,  -- max_score (4 điểm/câu, mỗi cặp = 1 điểm)
    FALSE,  -- is_free
    TRUE,  -- is_active
    0,  -- view_count
    NOW(),
    NOW()
);

-- Kiểm tra kết quả
SELECT 
    lesson_id,
    module_id,
    course_id,
    title,
    lesson_type,
    exercise_type,
    has_exercise,
    JSON_LENGTH(exercise_data) as total_questions,
    max_score,
    pass_score
FROM lessons 
WHERE lesson_id = 72;
