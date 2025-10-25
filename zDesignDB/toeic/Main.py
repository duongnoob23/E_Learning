import os
import requests
from bs4 import BeautifulSoup
import re
import time
import os
import json
import sys

COOKIE_STRING =  ""

SAVE_AUDIO_AND_IMAGE = True


SAVE_PATH = "./Save"
PREFIX = "https://study4.com"

if not os.path.exists(SAVE_PATH):
    os.makedirs(SAVE_PATH)

if not os.path.exists("./temp/ielts"):
    os.makedirs("./temp/ielts")

if not os.path.exists("./temp/toeic"):
    os.makedirs("./temp/toeic")

def decode_cfemail(cf):
    if not cf:
        return ''
    key = int(cf[:2], 16)
    out = ''
    for i in range(2, len(cf), 2):
        byte = int(cf[i:i+2], 16)
        out += chr(byte ^ key)
    return out

def replace_cfemails(soup):
    for tag in soup.select('.__cf_email__'):
        cf = tag.get('data-cfemail') or tag.get('cfemail') or ''
        if cf:
            real = decode_cfemail(cf)
            if real:
                tag.replace_with(real)
        else:
            if tag.string:
                tag.string.replace_with(
                    tag.get_text().replace('\xa0', ' ').replace('\u00a0', ' ')
                )
    return soup

def progress_bar(progress, total, length=40):
    GREEN = "\033[92m"
    RESET = "\033[0m"

    percent = 100 * (progress / total)
    filled_length = int(length * progress / total)
    
    bar = f"{GREEN}{'█' * filled_length}{RESET}{'-' * (length - filled_length)}"
    
    sys.stdout.write(f'\r|{bar}| {percent:6.2f}%')
    sys.stdout.flush()

class Toeic:
    def __init__(self, prefix=PREFIX, cookie_string=COOKIE_STRING):
        self.url = prefix + "/tests/toeic/"
        self.cookies = {k.strip().split("=", 1)[0]: k.strip().split("=", 1)[1] for k in cookie_string.split(";")} if cookie_string else {}
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5,es;q=0.4",
            "Origin": "https://study4.com",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Dest": "document",
            "Upgrade-Insecure-Requests": "1",
        }

    def get_test(self):
        def find_next_pages(soup):
            next_pages = set()
            next_btns = soup.select("a.page-link")
            for next_btn in next_btns:
                href = next_btn.get('href')
                if "=1" in href:
                    continue
                next_pages.add(next_btn['href'])

            return next_pages

        def find_test(soup):
            tests = []
            for wrapper in soup.select(".testitem-wrapper"):
                href = wrapper.select_one("a")['href']
                test_id = get_test_id(href)
                test_title = wrapper.select_one('.testitem-title').get_text(strip=True)
                tests.append({'test_id': test_id, 'test_title': test_title, 'link': PREFIX + href})
            return tests
        
        def get_test_id(link):
            pattern = "/tests/(\\d+)/"
            match = re.search(pattern, link)
            return match.group(1) if match else None

        resp = requests.get(self.url)
        soup = BeautifulSoup(resp.text, 'html.parser')
        tests = find_test(soup)

        next_links = find_next_pages(soup)
        for next_link in next_links:
            resp = requests.get(self.url + next_link)
            soup = BeautifulSoup(resp.text, 'html.parser')
            tests.extend(find_test(soup))

        return tests
    
    def get_test_parts(self, test_url):
        def find_part_ids(soup):
            return [input_tag.get('value') for input_tag in soup.select("input[name='part']")]
        
        resp = requests.get(test_url)
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        part_ids = find_part_ids(soup)
        return part_ids
    
    def get_test_question(self, test_id, part_ids):
        
        def get_form_data():
            soup = None
            try:
                url = f'https://study4.com/tests/{test_id}/practice/?part=' + '&part='.join(map(str, part_ids))
                resp = requests.get(url, cookies=self.cookies, headers=self.headers)
                soup = BeautifulSoup(resp.text, 'html.parser')

                csrfmiddlewaretoken = soup.select_one("input[name='csrfmiddlewaretoken']").get('value')
                uid = soup.select_one("input[name='uid']").get('value')
                question_id = soup.select_one(".question-number")['data-qid']

                formData = {
                    "csrfmiddlewaretoken": csrfmiddlewaretoken,
                    "uid": uid,
                    "start_time": time.time() - 1200, 
                    "end_time": time.time(),
                    "time_limit": "0",
                    "timeleft_value": "NaN",
                    "extra_data": f"question-{question_id}",
                    f"question-{question_id}": "A",
                }
                return formData 
            except Exception as e:
                f = open("error.html", "w", encoding="utf-8")
                f.write(str(soup))
                f.close()
                return None

        formData = get_form_data()
        if not formData:
            print("Failed to get form data, skipping this test.")
            return None

        url = f"https://study4.com/tests/{test_id}/finish/?part=" + '&part='.join(map(str, part_ids))
        headers = self.headers.copy()
        headers["Referer"] = f"https://study4.com/tests/{test_id}/practice/?part=" + "&part=".join(map(str, part_ids))

        resp = requests.post(url, headers=headers, data=formData, cookies=self.cookies)
        soup = BeautifulSoup(resp.text, 'html.parser')

        question_data = []

        answers_lists = soup.select(".result-answers-list")
        for answers_list in answers_lists:
            answers_items = answers_list.select(".result-answers-item")
            for item in answers_items:
                question_number = item.select_one(".question-number").get_text(strip=True)
                link_answer_detail = item.select_one(".result-answer-detail")['data-href']
                correct_answer = item.select_one(".text-answerkey").get_text(strip=True)

                question_data.append({
                    'test_id': test_id,
                    'question_number': question_number,
                    'correct_answer': correct_answer,
                    'link_answer_detail': PREFIX + link_answer_detail,
                })

        return question_data

    def get_question_detail(self, question_data):
        test_id = question_data['test_id']
        correct_answer = question_data['correct_answer']
        resp = requests.get(question_data['link_answer_detail'], cookies=self.cookies, headers=self.headers)

        soup = BeautifulSoup(resp.text, 'html.parser')
        soup = replace_cfemails(soup)

        question_id = soup.select_one(".question-number")['data-qid']
        question_number = soup.select_one(".question-number").get_text(strip=True)
        question_text = None
        try:
            question_text = soup.select_one(".question-text").get_text(strip=True)
        except:
            pass

        answer_text = [ques.get_text(strip=True) for ques in soup.select(".question-answers .form-check")]
        answer_quantity = len(answer_text)

        reading_text = None
        reading_text_clean = None
        try:
            reading_text_ele = soup.select_one(".result-question-context .context-wrapper .context-content:not(.context-transcript, .context-audio, .context-image)")
            reading_text = reading_text_ele.decode_contents()
            reading_text_clean = reading_text_ele.get_text()
        except:
            pass

        transcript = None
        transcript_clean = None
        try:
            transcript_ele = soup.select_one(".context-transcript .collapse")
            transcript = transcript_ele.decode_contents()
            transcript_clean = transcript_ele.get_text()
        except:
            pass

        explanation = None
        explanation_clean = None
        try:
            explanation_ele = soup.select_one(".question-explanation-wrapper .collapse")
            explanation = explanation_ele.decode_contents()
            explanation_clean = explanation_ele.get_text()
        except:
            pass

        audio_url = None
        audio_dir_path = None
        try:
            audio_url = soup.select_one(".context-audio audio source")['src']
            audio_url = PREFIX + audio_url if audio_url and audio_url.startswith("/") else audio_url
        except:
            pass
        # download audio
        if audio_url and SAVE_AUDIO_AND_IMAGE:
            audio_filename = audio_url.split("/")[-1]
            audio_dir_path = f"{SAVE_PATH}/Audio/{test_id}/{audio_filename}"
            if not os.path.exists(audio_dir_path):
                test_audio_dir = f"{SAVE_PATH}/Audio/{test_id}/"
                if not os.path.exists(test_audio_dir):
                    os.makedirs(test_audio_dir)

                audio_resp = requests.get(audio_url)
                with open(audio_dir_path, 'wb') as f:
                    f.write(audio_resp.content)

        image_urls = []
        image_dir_paths = []
        try:
            image_urls = [img['src'] for img in soup.select(".result-question-context .context-content img")]
            image_urls = [PREFIX + img for img in image_urls if img and img.startswith("/")]
        except:
            pass
        
        # download image
        if image_urls and SAVE_AUDIO_AND_IMAGE:
            for image_url in image_urls:
                image_filename = image_url.split("/")[-1]
                image_dir_path = f"{SAVE_PATH}/Image/{test_id}/{image_filename}"
                image_dir_paths.append(image_dir_path)
                if not os.path.exists(image_dir_path):
                    test_image_dir = f"{SAVE_PATH}/Image/{test_id}/"
                    if not os.path.exists(test_image_dir):
                        os.makedirs(test_image_dir)

                    image_resp = requests.get(image_url)
                    with open(image_dir_path, 'wb') as f:
                        f.write(image_resp.content)

        return {
            'question_id': question_id,
            'question_number': question_number,
            'reading_text': reading_text,
            'reading_text_clean': reading_text_clean,
            'question_text': question_text,
            'answer_quantity': answer_quantity,
            'answer_text': answer_text,
            'correct_answer': correct_answer,
            'transcript': transcript,
            'transcript_clean': transcript_clean,
            'explanation': explanation,
            'explanation_clean': explanation_clean,
            'audio_url': audio_url,
            'audio_dir_path': audio_dir_path,
            'image_url': image_urls,
            'image_dir_path': image_dir_paths,
        }

    def run(self):
        results = {}
        tests = self.get_test()
        print(f"Total {len(tests)} tests found")

        id_done = set()
        for filename in os.listdir("./temp/toeic"):
            if filename.endswith(".json"):
                id_done.add(filename.replace(".json", ""))

        for test in tests:
            if test['test_id'] in id_done:
                print(f"\nSkipping test: {test['test_title']} (ID: {test['test_id']}) - already done")
                continue

            print(f"\nProcessing test: {test['test_title']} (ID: {test['test_id']})")
            test_id = test['test_id']
            part_ids = self.get_test_parts(test['link'])

            question_data = self.get_test_question(test_id, part_ids)
            if not question_data:
                print(f"Skipping test: {test['test_title']} (ID: {test['test_id']}) - failed to get questions")
                continue
            
            results[test_id] = []
            for i, question in enumerate(question_data):
                data = self.get_question_detail(question)
                results[test_id].append(data)
                progress_bar(i + 1, len(question_data))
            print("\n")

            f = open(f"./temp/toeic/{test_id}.json", "w", encoding="utf-8")
            f.write(json.dumps(results[test_id], ensure_ascii=False, indent=4))
            f.close()
            
        f = open("toeic_results.json", "w", encoding="utf-8")
        f.write(json.dumps(results, ensure_ascii=False, indent=4))
        f.close()
        print("\nAll done!")

class Ielts:
    def __init__(self, prefix=PREFIX, cookie_string=COOKIE_STRING):
        self.url = prefix + "/tests/ielts/"
        self.cookies = {k.strip().split("=", 1)[0]: k.strip().split("=", 1)[1] for k in cookie_string.split(";")} if cookie_string else {}
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5,es;q=0.4",
            "Origin": "https://study4.com",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Dest": "document",
            "Upgrade-Insecure-Requests": "1",
        }

    def get_test(self):
        def find_next_pages(soup):
            next_pages = set()
            next_btns = soup.select("a.page-link")
            for next_btn in next_btns:
                href = next_btn.get('href')
                if "=1" in href:
                    continue
                next_pages.add(next_btn['href'])

            return next_pages

        def find_test(soup):
            tests = []
            for wrapper in soup.select(".testitem-wrapper"):
                href = wrapper.select_one("a")['href']
                test_id = get_test_id(href)
                test_title = wrapper.select_one('.testitem-title').get_text(strip=True)
                tests.append({'test_id': test_id, 'test_title': test_title, 'link': PREFIX + href})
            return tests
        
        def get_test_id(link):
            pattern = "/tests/(\\d+)/"
            match = re.search(pattern, link)
            return match.group(1) if match else None

        resp = requests.get(self.url)
        soup = BeautifulSoup(resp.text, 'html.parser')
        tests = find_test(soup)

        next_links = find_next_pages(soup)
        for next_link in next_links:
            resp = requests.get(self.url + next_link)
            soup = BeautifulSoup(resp.text, 'html.parser')
            tests.extend(find_test(soup))

        return tests
    
    def get_test_parts(self, test_url):
        def find_part_ids(soup):
            return [input_tag.get('value') for input_tag in soup.select("input[name='part']")]
        
        resp = requests.get(test_url)
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        part_ids = find_part_ids(soup)
        return part_ids

    def get_test_question(self, test_id, part_ids):
        url = f'https://study4.com/tests/{test_id}/practice/?part=' + '&part='.join(map(str, part_ids))
        print(f"Fetching test questions from: {url}")
        resp = requests.get(url, cookies=self.cookies, headers=self.headers)

        soup = BeautifulSoup(resp.text, 'html.parser')
        soup = replace_cfemails(soup)

        f = open("test.html", "w", encoding="utf-8")
        f.write(str(soup))
        f.close()        

        test_data = []
        question_sets = soup.select(".tab-pane .test-questions-wrapper .question-set-wrapper")
        for question_set in question_sets:
            question_group_wrapper = question_set.select(".question-group-wrapper")

            question_group_data = []
            for question_group in question_group_wrapper:
                context_content = None
                context_content_clean = None
                try:
                    context_content_ele = question_group.select_one(".context-wrapper .context-content")
                    context_content = context_content_ele.decode_contents()
                    context_content_clean = context_content_ele.get_text()
                except Exception as e:
                    print(f"Error occurred while extracting context content: {e}")
                    pass

                question_wrappers = question_group.select(".question-wrapper")
                questions_data = []
                for question_wrapper in question_wrappers:
                    question_ele = question_wrapper.select_one(".question-number")
                    question_id = question_ele['data-qid']
                    question_number = question_ele.get_text(strip=True)

                    question_text = None
                    try:
                        question_text = question_wrapper.select_one(".question-text").get_text(strip=True)
                    except:
                        pass

                    answers = [ques.get_text(strip=True) for ques in question_wrapper.select(".question-answers div")]
                    answers_type = question_wrapper.find(attrs={"data-type": "question-answer"}).get('type')

                    questions_data.append({
                        'question_id': question_id,
                        'question_number': question_number,
                        'question_text': question_text,
                        'answers': answers,
                        'type': answers_type,                        
                    })

                question_group_data.append({
                    'context_content': context_content,
                    'context_content_clean': context_content_clean,
                    'questions': questions_data,
                })

            audio_url = None
            audio_dir_path = None
            try:
                audio_url = question_set.select_one(".context-audio audio source")['src']
                audio_url = PREFIX + audio_url if audio_url and audio_url.startswith("/") else audio_url
            except:
                pass
            # download audio
            if audio_url and SAVE_AUDIO_AND_IMAGE:
                audio_filename = audio_url.split("/")[-1]
                audio_dir_path = f"{SAVE_PATH}/Audio/{test_id}/{audio_filename}"
                if not os.path.exists(audio_dir_path):
                    test_audio_dir = f"{SAVE_PATH}/Audio/{test_id}/"
                    if not os.path.exists(test_audio_dir):
                        os.makedirs(test_audio_dir)

                    audio_resp = requests.get(audio_url)
                    with open(audio_dir_path, 'wb') as f:
                        f.write(audio_resp.content)

            image_urls = []
            image_dir_paths = []
            try:
                image_urls = [img['src'] for img in question_set.select(".context-content img")]
                image_urls = [PREFIX + img for img in image_urls if img and img.startswith("/")]
            except:
                pass
            
            # download image
            if image_urls and SAVE_AUDIO_AND_IMAGE:
                for image_url in image_urls:
                    image_filename = image_url.split("/")[-1]
                    image_dir_path = f"{SAVE_PATH}/Image/{test_id}/{image_filename}"
                    image_dir_paths.append(image_dir_path)
                    if not os.path.exists(image_dir_path):
                        test_image_dir = f"{SAVE_PATH}/Image/{test_id}/"
                        if not os.path.exists(test_image_dir):
                            os.makedirs(test_image_dir)
                        
                        image_resp = requests.get(image_url)
                        with open(image_dir_path, 'wb') as f:
                            f.write(image_resp.content)

            reading_text = None
            reading_text_clean = None
            try:
                reading_text_ele = question_set.select_one(".question-twocols-left .context-wrapper .context-content:not(.context-transcript, .context-audio, .context-image)")
                reading_text = reading_text_ele.decode_contents()
                reading_text_clean = reading_text_ele.get_text()
            except:
                pass

            test_data.append({
                'audio_url': audio_url,
                'audio_dir_path': audio_dir_path,
                'image_url': image_urls,
                'image_dir_path': image_dir_paths,
                'reading_text': reading_text,
                'reading_text_clean': reading_text_clean,
                'question_groups': question_group_data
            })

        csrfmiddlewaretoken = soup.select_one("input[name='csrfmiddlewaretoken']").get('value')
        uid = soup.select_one("input[name='uid']").get('value')
        question_id = soup.select_one(".question-number")['data-qid']
        formData = {
            "csrfmiddlewaretoken": csrfmiddlewaretoken,
            "uid": uid,
            "start_time": time.time() - 1200, 
            "end_time": time.time(),
            "time_limit": "0",
            "timeleft_value": "NaN",
            "extra_data": f"question-{question_id}",
            f"question-{question_id}": "A",
        }

        url = f"https://study4.com/tests/{test_id}/finish/?part=" + '&part='.join(map(str, part_ids))
        headers = self.headers.copy()
        headers["Referer"] = f"https://study4.com/tests/{test_id}/practice/?part=" + "&part=".join(map(str, part_ids))

        resp = requests.post(url, headers=headers, data=formData, cookies=self.cookies)
        soup = BeautifulSoup(resp.text, 'html.parser')

        question_data = []

        answers_lists = soup.select(".result-answers-list")
        for answers_list in answers_lists:
            answers_items = answers_list.select(".result-answers-item")
            for item in answers_items:
                question_number = item.select_one(".question-number").get_text(strip=True)
                link_answer_detail = item.select_one(".result-answer-detail")['data-href']
                correct_answer = item.select_one(".text-answerkey").get_text(strip=True)

                question_data.append({
                    'test_id': test_id,
                    'question_number': question_number,
                    'correct_answer': correct_answer,
                    'link_answer_detail': PREFIX + link_answer_detail,
                })

        return test_data, question_data

    def get_correct_answer(self, test_data, question_datas):
        for i, question_data in enumerate(question_datas):
            resp = requests.get(question_data['link_answer_detail'], cookies=self.cookies, headers=self.headers)

            soup = BeautifulSoup(resp.text, 'html.parser')
            soup = replace_cfemails(soup)

            question_id = soup.select_one(".question-number")['data-qid']
            correct_answer = question_data['correct_answer']

            transcript = None
            transcript_clean = None
            try:
                transcript_ele = soup.select_one(".context-transcript .collapse")
                transcript = transcript_ele.decode_contents()
                transcript_clean = transcript_ele.get_text()
            except:
                pass

            explanation = None
            explanation_clean = None
            try:
                explanation_ele = soup.select_one(".question-explanation-wrapper .collapse")
                explanation = explanation_ele.decode_contents()
                explanation_clean = explanation_ele.get_text()
            except:
                pass

            for parts in test_data:
                question_in_this_part = False
                for question_group in parts['question_groups']:
                    for question in question_group['questions']:
                        if question_id == question['question_id']:
                            question['correct_answer'] = correct_answer
                            question_in_this_part = True
                            break
                    if question_in_this_part and explanation and question.get('explanation') is None:
                        question['explanation'] = explanation
                        question['explanation_clean'] = explanation_clean
                
                if question_in_this_part and transcript and parts.get('transcript') is None:
                    parts['transcript'] = transcript
                    parts['transcript_clean'] = transcript_clean
            
            progress_bar(i + 1, len(question_datas))
        
        print("\n")
        return test_data
            
    def get_writing_question(self, test_id, part_ids):
        url = f'https://study4.com/tests/{test_id}/practice/?part=' + '&part='.join(map(str, part_ids))
        print(f"Fetching test questions from: {url}")
        resp = requests.get(url, cookies=self.cookies, headers=self.headers)

        soup = BeautifulSoup(resp.text, 'html.parser')
        soup = replace_cfemails(soup)

        f = open("test.html", "w", encoding="utf-8")
        f.write(str(soup))
        f.close()        

        test_data = []
        question_sets = soup.select(".tab-pane .test-questions-wrapper .question-item-wrapper")
        for question_set in question_sets:
            # image_urls = []
            # image_dir_paths = []
            # try:
            #     image_urls = [img['src'] for img in question_set.select("img")]
            # except:
            #     pass
            
            # download image
            # if image_urls and SAVE_AUDIO_AND_IMAGE:
            #     for image_url in image_urls:
            #         image_filename = image_url.split("/")[-1]
            #         image_dir_path = f"{SAVE_PATH}/Image/{test_id}/{image_filename}"
            #         image_dir_paths.append(image_dir_path)
            #         if not os.path.exists(image_dir_path):
            #             test_image_dir = f"{SAVE_PATH}/Image/{test_id}/"
            #             if not os.path.exists(test_image_dir):
            #                 os.makedirs(test_image_dir)
                        
            #             image_resp = requests.get(image_url)
            #             with open(image_dir_path, 'wb') as f:
            #                 f.write(image_resp.content)

            reading_text = None
            reading_text_clean = None
            try:
                reading_text_ele = question_set.select_one(".question-twocols-left .context-wrapper .context-content:not(.context-transcript, .context-audio, .context-image)")
                reading_text = reading_text_ele.decode_contents()
                reading_text_clean = reading_text_ele.get_text()
            except:
                pass

            test_data.append({
                # 'image_url': image_urls,
                # 'image_dir_path': image_dir_paths,
                'writing_text': reading_text,
                'writing_text_clean': reading_text_clean,
            })

        return test_data

    def run(self):
        results = {}
        tests = self.get_test()
        print(f"Total {len(tests)} tests found")

        id_done = set()
        for filename in os.listdir("./temp/ielts"):
            if filename.endswith(".json"):
                id_done.add(filename.replace(".json", ""))

        for test in tests:
            if test['test_id'] in id_done:
                print(f"\nSkipping test: {test['test_title']} (ID: {test['test_id']}) - already done")
                continue

            print(f"\nProcessing test: {test['test_title']} (ID: {test['test_id']})")

            test_id = test['test_id']
            part_ids = self.get_test_parts(test['link'])

            if "writing" in test['test_title'].lower():
                test_data = self.get_writing_question(test_id, part_ids)
                results[test_id] = test_data
            
            else:
                try:
                    test_data, question_data = self.get_test_question(test_id, part_ids)
                    data = self.get_correct_answer(test_data, question_data)
                    results[test_id] = data

                    f = open(f"./temp/ielts/{test_id}.json", "w", encoding="utf-8")
                    f.write(json.dumps(results[test_id], ensure_ascii=False, indent=4))
                    f.close()
                except Exception as e:
                    print(f"Error occurred while processing test ID {test_id}: {e}")
                    print("Waiting for 30 minutes before retrying...")
                    time.sleep(10*60)  # wait for 30 minutes before next
                    print("Retrying now...")
                    try:
                        test_data, question_data = self.get_test_question(test_id, part_ids)
                        data = self.get_correct_answer(test_data, question_data)
                        results[test_id] = data

                        f = open(f"./temp/ielts/{test_id}.json", "w", encoding="utf-8")
                        f.write(json.dumps(results[test_id], ensure_ascii=False, indent=4))
                        f.close()
                    except Exception as e:
                        print(f"Failed again for test ID {test_id}: {e}")

                    continue
            time.sleep(60)

        f = open("ielts_results.json", "w", encoding="utf-8")
        f.write(json.dumps(results, ensure_ascii=False, indent=4))
        f.close()
        print("\nAll done!")

if __name__ == "__main__":
    # toeic = Toeic()
    # toeic.run()

    ielts = Ielts()
    ielts.run()
    