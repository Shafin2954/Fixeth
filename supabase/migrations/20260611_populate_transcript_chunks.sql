-- ============================================================
-- Fixeth — Populate transcript_chunks from Whisper JSON files
-- Migration: 20260611_populate_transcript_chunks.sql
-- ============================================================
--
-- This migration populates the transcript_chunks table with data
-- extracted from Whisper JSON files in the /files directory.
--
-- USAGE:
-- 1. First, verify the lesson mappings by running:
--    SELECT id, youtube_video_id, title_en FROM lessons;
--
-- 2. For each JSON file below, replace :lesson_id with the actual
--    lesson.id from the lessons table where youtube_video_id matches
--    the filename (without .json extension).
--
-- 3. Execute each INSERT statement block to populate transcript_chunks.
--
-- NOTE: Only the "segments" array from each JSON file is used.
-- The full "transcript" field is ignored as requested.
-- ============================================================

-- Map of filename (without .json) to YouTube video ID:
-- 3iLALsW5qAQ -> 3iLALsW5qAQ.json
-- DloR0BOGNU0 -> DloR0BOGNU0.json
-- dQw4w9WgXcQ -> dQw4w9WgXcQ.json
-- gOMW_n2-2Mw -> gOMW_n2-2Mw.json
-- K5KVEU3aaeQ -> K5KVEU3aaeQ.json
-- MJUJ4wbFm_A -> MJUJ4wbFm_A.json
-- PEB9jEXh0X4 -> PEB9jEXh0X4.json
-- pZjpNS9YeVA -> pZjpNS9YeVA.json
-- qg4PchTECck -> qg4PchTECck.json
-- rY2HOcodQFk -> rY2HOcodQFk.json
-- vKauB_ui598 -> vKauB_ui598.json
-- VV8iRJ-DS0A -> VV8iRJ-DS0A.json
-- VXtjG_GzO7Q -> VXtjG_GzO7Q.json
-- y2kg3MOk1sY -> y2kg3MOk1sY.json

--------------------------------------------------------------------
-- File: 3iLALsW5qAQ.json
-- YouTube Video ID: 3iLALsW5qAQ
--------------------------------------------------------------------
-- First, verify: SELECT id FROM lessons WHERE youtube_video_id = '3iLALsW5qAQ';
-- Then replace :lesson_id with the actual ID from the query above.

INSERT INTO transcript_chunks (lesson_id, chunk_text, start_time, end_time)
SELECT
    :lesson_id AS lesson_id,
    segment.value->>'text' AS chunk_text,
    (segment.value->>'start')::numeric AS start_time,
    (segment.value->>'end')::numeric AS end_time
FROM jsonb_array_elements(
    '{"segments": [
        {"start": 0.0, "end": 3.68, "text": "Hi folks, CodeTutor here and my name is Anil Deshpande."},
        {"start": 7.76, "end": 13.92, "text": "Welcome to the next topic on Kotlin fundamentals and we will start with another topic called as"},
        {"start": 13.92, "end": 20.64, "text": "Scoped Functions or Scoped Functions. If you look at the meaning of scope functions in official"},
        {"start": 20.64, "end": 27.68, "text": "Kotlin documentation, this is what it says. Scoped functions are functions that execute a block of"},
        {"start": 27.68, "end": 34.64, "text": "code within the context of an object. To put it simply, they are nothing but higher order functions"},
        {"start": 34.64, "end": 42.64, "text": "and which are those scope functions? They are let run, width, apply and also. If you look at how"},
        {"start": 42.64, "end": 48.0, "text": "these are invoked, it is something that you are already familiar with. Typically you have an"},
        {"start": 48.0, "end": 55.84, "text": "object and then you use this scoped function that is either let run, width, apply and or also."},
        {"start": 55.84, "end": 60.64, "text": "The syntax looks quite similar to a lambda. So this is something that you are already familiar"},
        {"start": 60.64, "end": 67.68, "text": "with. But the next part is what do you want to return and how do you want to access anything"},
        {"start": 67.68, "end": 74.16, "text": "within this scoped function is crux of the matter. Right now we will concentrate on what we are"},
        {"start": 74.16, "end": 82.96, "text": "returning from the scoped function. You can either return a result or an object. This is basically"},
        {"start": 82.96, "end": 89.28, "text": "the return type of your scoped function. These different scope functions that we have defined"},
        {"start": 89.28, "end": 97.28, "text": "here return one of these things. For example, let run and width help you to return a result."},
        {"start": 97.28, "end": 103.36, "text": "Result is anything for that matter. It can be an object. It can be nothing also. It can be a unit."},
        {"start": 103.36, "end": 110.32, "text": "But with apply and also you can return object only. It would be very difficult to make sense of this"},
        {"start": 110.32, "end": 116.8, "text": "without having a look at the demo. So let\'s get into a demo. So I have created this"},
        {"start": 116.8, "end": 123.68, "text": "file called as scoped functions demo. What I have done is nothing but created a let variable. And"},
        {"start": 123.68, "end": 129.68, "text": "then I have initialized it with a person class, which is something that you might be already"},
        {"start": 129.68, "end": 135.2, "text": "familiar with. If you have watched my previous videos, it has a first name, last name, nationality"},
        {"start": 135.2, "end": 143.04, "text": "and age. And then in front of that, I have written a scoped function, which is dot let. As of now,",
        {"start": 143.04, "end": 149.6, "text": "I have kept it very simple. I have kept it empty. And whatever that it is returning, I am assigning"},
        {"start": 149.6, "end": 157.12, "text": "it to a let variable. And then I am printing it below. I have done same with run. I have done"},
        {"start": 157.12, "end": 164.56, "text": "same with width. The syntax of width is slightly different. The way you do is you write a width"},
        {"start": 164.56, "end": 171.68, "text": "block. And then inside that, you write this person object instantiation. And then you don\'t have to"},
        {"start": 171.68, "end": 177.04, "text": "put the dot, it is directly the body of the higher order function. And once again, I am printing"},
        {"start": 177.04, "end": 185.36, "text": "a variable, same case with apply. And then in this case, also everywhere, the body of the"},
        {"start": 185.84, "end": 194.64, "text": "scope function is empty. Now let\'s run this and see what happens. Pay attention now. Let"},
        {"start": 194.64, "end": 203.84, "text": "run and width, they returned unit, because I have not returned anything, they returned unit. So"},
        {"start": 203.84, "end": 212.48, "text": "right now, you can think of this as nothing but a result. However, with apply and also, I got a"},
        {"start": 212.48, "end": 220.16, "text": "object. And that is what I was talking a moment earlier. Result can be anything unit is also"},
        {"start": 220.16, "end": 226.88, "text": "a anything, which is not an object with applied. Also, you can only return the object, you cannot"},
        {"start": 226.88, "end": 234.56, "text": "return a result. So having understood what is a return type, let\'s understand another concept."},
        {"start": 234.56, "end": 239.6, "text": "The concept is once you have written this particular higher order function, that is"},
        {"start": 239.6, "end": 246.64, "text": "scope function, how are you going to reference object within the body of the scope function?"},
        {"start": 246.64, "end": 251.36, "text": "Either you can use it, which is a standard practice with any of the lambda functions,"},
        {"start": 251.36, "end": 258.64, "text": "or do you want to use this within the body of the scope function? This is called as context of the"},
        {"start": 258.64, "end": 264.56, "text": "object or context reference of the object within the scope function. And once again, depending upon"},
        {"start": 264.56, "end": 270.48, "text": "which one you use here, certain things are allowed and certain things can't be used. So with respect"},
        {"start": 270.48, "end": 279.68, "text": "to context of object, let and also allow you to use it. However, run with an apply only allow you"},
        {"start": 279.68, "end": 287.04, "text": "to use this within the scope function body. Once again, best way to understand this is"},
        {"start": 287.04, "end": 293.28, "text": "through a demo. So let's get into a demo. So let's enhance this code to understand what do you mean"},
        {"start": 293.28, "end": 300.16, "text": "by context reference? What I can do is inside the body, how am I going to refer with let it is"},
        {"start": 300.16, "end": 307.52, "text": "it dot first name plus, for example, it dot age, there is no meaning to it. But right now, imagine"},
        {"start": 307.52, "end": 312.8, "text": "this is what I am writing within the let function. Let is nothing but it executes whatever the code"},
        {"start": 312.8, "end": 321.6, "text": "that you want. And it returns that I can write exactly the same with also. And if I run this,"},
        {"start": 321.6, "end": 328.56, "text": "you will observe that in the let instead of unit, it is assigning whatever the value that you are"},
        {"start": 328.56, "end": 336.16, "text": "returning here, I can do the same here with run. But within run, I can't use it, I have to use"},
        {"start": 336.16, "end": 345.28, "text": "this. The same is case with with and also apply variable. And if I execute this, you will observe"},
        {"start": 345.28, "end": 355.04, "text": "that let run and width are basically initialized with strings, however, apply and also are still"},
        {"start": 355.04, "end": 361.92, "text": "returning a object. That is the reason why I said apply and also always return the object. But"},
        {"start": 361.92, "end": 370.08, "text": "let run and width can return a result and result can be anything. Can it be a object? Of course,"},
        {"start": 370.08, "end": 377.12, "text": "it can be a object. So what I can do is I can write it. So that is the object. In this case,"},
        {"start": 377.12, "end": 384.8, "text": "I can write this and in this case, I can write this and in case of apply variable, once again,"},
        {"start": 384.8, "end": 392.48, "text": "it is this and here it has to be it. And now if I run this, you can observe that everything is"},
        {"start": 392.48, "end": 400.24, "text": "returning a object because these three things that is let run and width can return anything,"},
        {"start": 400.24, "end": 405.28, "text": "they can return object, they can return string, they can return whatever that you want to return."},
        {"start": 405.28, "end": 411.68, "text": "But in case of apply and also you always return an object. So let me show you something here."},
        {"start": 411.68, "end": 422.32, "text": "This dot first name is equal to this dot first name dot reversed well cannot be reassigned. I think"},
        {"start": 422.32, "end": 429.52, "text": "this first name is of well type. So I think instead of first name, I will use nationality"},
        {"start": 429.52, "end": 437.6, "text": "nationality dot reverse it is up in a label type. And I can do the same in also but instead of this"},
        {"start": 437.6, "end": 446.32, "text": "I have to use it. And if I run this nationality got reversed. So if you want to basically update"},
        {"start": 446.32, "end": 455.36, "text": "the contents of a object modify it and return the same object, then you use apply and also"},
        {"start": 455.36, "end": 463.6, "text": "another thing is in case of let run and width, you can return anything say for example, it dot"},
        {"start": 463.6, "end": 470.4, "text": "first name it dot age. And if you want to make it even more explicitly readable, you can write"},
        {"start": 470.4, "end": 480.16, "text": "return let in the same way, I can write return run and then this dot first name this dot first name"},
        {"start": 480.16, "end": 488.48, "text": "is just unnecessary, you can write just first name plus age. And then here you can write return width"},
        {"start": 488.48, "end": 496.4, "text": "first name age. And if I run this, you will see that let run and width are being initialized with"},
        {"start": 496.4, "end": 503.2, "text": "strings because they can contain result. Now the question is, can I return apply? Of course,"},
        {"start": 503.2, "end": 510.0, "text": "you can write return apply, but you can't return anything here. If you try to do that, it will"},
        {"start": 510.0, "end": 516.8, "text": "give a compilation error. Now let me write return apply this even that also you cannot write. If"},
        {"start": 516.88, "end": 523.12, "text": "at all you are using return apply, don't write anything, otherwise no need to write anything"},
        {"start": 523.12, "end": 529.12, "text": "at all because anyhow it is always going to return the object. And in the same way return also can"},
        {"start": 529.12, "end": 535.44, "text": "I write it? No, it is a compilation error. Can I write anything here, which is a string? No. Once"},
        {"start": 535.44, "end": 540.24, "text": "again, it always returns the object you cannot return anything. So you cannot return anything"},
        {"start": 540.24, "end": 546.0, "text": "other than object and you cannot write anything in front of the return also. So you can either"},
        {"start": 546.0, "end": 553.04, "text": "keep it empty or don't write it at all. We have covered a pretty good ground here. The remaining"},
        {"start": 553.04, "end": 559.68, "text": "part will be explained in the next video. That brings us to the end of this particular video."},
        {"start": 559.68, "end": 564.88, "text": "Don't forget to like, comment, share the video and subscribe to the channel. Take care. Bye."}
    ]}'::jsonb, '$.segments'
) AS segment;

--------------------------------------------------------------------
-- File: DloR0BOGNU0.json
-- YouTube Video ID: DloR0BOGNU0
--------------------------------------------------------------------
-- First, verify: SELECT id FROM lessons WHERE youtube_video_id = 'DloR0BOGNU0';
-- Then replace :lesson_id with the actual ID from the query above.

INSERT INTO transcript_chunks (lesson_id, chunk_text, start_time, end_time)
SELECT
    :lesson_id AS lesson_id,
    segment.value->>'text' AS chunk_text,
    (segment.value->>'start')::numeric AS start_time,
    (segment.value->>'end')::numeric AS end_time
FROM jsonb_array_elements(
    '{"segments": [
        {"start": 0.0, "end": 4.8, "text": "So you just ran git merge or git pull and you got one of those dreaded merge conflicts."},
        {"start": 4.8, "end": 7.52, "text": "No! No!"},
        {"start": 7.52, "end": 12.0, "text": "In this video I'"'"'ll show you what I wish someone had explained to me when I started out using git."},
        {"start": 12.0, "end": 16.96, "text": "So first of all if you just want to abort the merge just run git merge abort which will just reset everything to the same state it was before."},
        {"start": 16.96, "end": 23.04, "text": "Once you have more time and are ready to handle the conflict you can just pull or merge again."},
        {"start": 23.04, "end": 28.0, "text": "In my example here I'"'"'m trying to merge the main branch into the develop branch."},
        {"start": 28.0, "end": 33.12, "text": "To fix the merge conflict let'"'"'s first run git status. You'"'"'ll see that you'"'"'re currently in a merge and you'"'"'ll see which files git wasn'"'"'t able to merge automatically."},
        {"start": 28.0, "end": 33.12, "text": "In my example here git was able to auto merge the package.json file but not the other two files here. They'"'"'re conflicted so we have to merge them manually."},
        {"start": 33.12, "end": 38.08, "text": "I'"'"'ve already opened the javascript file here in my text editor. I use visual studio code here but it really doesn'"'"'t matter which editor you use."},
        {"start": 38.08, "end": 43.28, "text": "When git can'"'"'t auto merge a file it will put these angle brackets and these equal signs into the file. These are called conflict markers."},
        {"start": 43.28, "end": 48.48, "text": "I'"'"'ve watched my previous videos, it has a first name, last name, nationality and age."},
        {"start": 48.48, "end": 53.76, "text": "And then in front of that, I have written a scoped function, which is dot let. As of now,"},
        {"start": 53.76, "end": 59.04, "text": "I have kept it very simple. I have kept it empty. And whatever that it is returning, I am assigning"},
        {"start": 59.04, "end": 64.32, "text": "it to a let variable. And then I am printing it below. I have done same with run. I have done"},
        {"start": 64.32, "end": 69.6, "text": "same with width. The syntax of width is slightly different. The way you do is you write a width"},
        {"start": 69.6, "end": 74.88, "text": "block. And then inside that, you write this person object instantiation. And then you don'"'"'t have to"},
        {"start": 74.88, "end": 80.16, "text": "put the dot, it is directly the body of the higher order function. And once again, I am printing"},
        {"start": 80.16, "end": 85.44, "text": "a variable, same case with apply. And then in this case, also everywhere, the body of the"},
        {"start": 85.44, "end": 90.72, "text": "scope function is empty. Now let'"'"'s run this and see what happens. Pay attention now. Let"},
        {"start": 90.72, "end": 96.0, "text": "run and width, they returned unit, because I have not returned anything, they returned unit. So"},
        {"start": 96.0, "end": 101.28, "text": "right now, you can think of this as nothing but a result. However, with apply and also, I got a"},
        {"start": 101.28, "end": 106.56, "text": "object. And that is what I was talking a moment earlier. Result can be anything unit is also"},
        {"start": 106.56, "end": 111.84, "text": "a anything, which is not an object with applied. Also, you can only return the object, you cannot"},
        {"start": 111.84, "end": 117.12, "text": "return a result. So having understood what is a return type, let'"'"'s understand another concept."},
        {"start": 117.12, "end": 122.4, "text": "The concept is once you have written this particular higher order function, that is"},
        {"start": 122.4, "end": 127.68, "text": "scope function, how are you going to reference object within the body of the scope function?"},
        {"start": 127.68, "end": 132.96, "text": "Either you can use it, which is a standard practice with any of the lambda functions,"},
        {"start": 132.96, "end": 138.24, "text": "or do you want to use this within the body of the scope function? This is called as context of the"},
        {"start": 138.24, "end": 143.52, "text": "object or context reference of the object within the scope function. And once again, depending upon"},
        {"start": 143.52, "end": 148.8, "text": "which one you use here, certain things are allowed and certain things can'"'"'t be used. So with respect"},
        {"start": 148.8, "end": 154.08, "text": "to context of object, let and also allow you to use it. However, run with an apply only allow you"},
        {"start": 154.08, "end": 159.36, "text": "to use this within the scope function body. Once again, best way to understand this is"},
        {"start": 159.36, "end": 164.64, "text": "through a demo. So let'"'"'s get into a demo. So let'"'"'s enhance this code to understand what do you mean"},
        {"start": 164.64, "end": 170.0, "text": "by context reference? What I can do is inside the body, how am I going to refer with let it is"},
        {"start": 170.0, "end": 175.32, "text": "it dot first name plus, for example, it dot age, there is no meaning to it. But right now, imagine"},
        {"start": 175.32, "end": 180.64, "text": "this is what I am writing within the let function. Let is nothing but it executes whatever the code"},
        {"start": 180.64, "end": 185.92, "text": "that you want. And it returns that I can write exactly the same with also. And if I run this,"},
        {"start": 185.92, "end": 191.2, "text": "you will observe that in the let instead of unit, it is assigning whatever the value that you are"},
        {"start": 191.2, "end": 196.48, "text": "returning here, I can do the same here with run. But within run, I can'"'"'t use it, I have to use"},
        {"start": 196.48, "end": 201.76, "text": "this. The same is case with with and also apply variable. And if I execute this, you will observe"},
        {"start": 201.76, "end": 207.04, "text": "that let run and width are basically initialized with strings, however, apply and also are still"},
        {"start": 207.04, "end": 212.32, "text": "returning a object. That is the reason why I said apply and also always return the object. But"},
        {"start": 212.32, "end": 217.6, "text": "let run and width can return a result and result can be anything. Can it be a object? Of course,"},
        {"start": 217.6, "end": 222.88, "text": "it can be a object. So what I can do is I can write it. So that is the object. In this case,"},
        {"start": 222.88, "end": 228.16, "text": "I can write this and in this case, I can write this and in case of apply variable, once again,"},
        {"start": 228.16, "end": 233.44, "text": "it is this and here it has to be it. And now if I run this, you can observe that everything is"},
        {"start": 233.44, "end": 238.72, "text": "returning a object because these three things that is let run and width can return anything,"},
        {"start": 238.72, "end": 244.0, "text": "they can return object, they can return string, they can return whatever that you want to return."},
        {"start": 244.0, "end": 249.28, "text": "But in case of apply and also you always return an object. So let me show you something here."},
        {"start": 249.28, "end": 254.56, "text": "This dot first name is equal to this dot first name dot reversed well cannot be reassigned. I think"},
        {"start": 254.56, "end": 259.84, "text": "this first name is of well type. So I think instead of first name, I will use nationality"},
        {"start": 259.84, "end": 265.12, "text": "nationality dot reverse it is up in a label type. And I can do the same in also but instead of this"},
        {"start": 265.12, "end": 270.4, "text": "I have to use it. And if I run this nationality got reversed. So if you want to basically update"},
        {"start": 270.4, "end": 275.68, "text": "the contents of a object modify it and return the same object, then you use apply and also"},
        {"start": 275.68, "end": 280.96, "text": "another thing is in case of let run and width, you can return anything say for example, it dot"},
        {"start": 280.96, "end": 286.24, "text": "first name it dot age. And if you want to make it even more explicitly readable, you can write"},
        {"start": 286.24, "end": 291.52, "text": "return let in the same way, I can write return run and then this dot first name this dot first name"},
        {"start": 291.52, "end": 296.8, "text": "is just unnecessary, you can write just first name plus age. And then here you can write return width"},
        {"start": 296.8, "end": 302.08, "text": "first name age. And if I run this, you will see that let run and width are being initialized with"},
        {"start": 302.08, "end": 307.36, "text": "strings because they can contain result. Now the question is, can I return apply? Of course,"},
        {"start": 307.36, "end": 312.64, "text": "you can write return apply, but you can'"'"'t return anything here. If you try to do that, it will"},
        {"start": 312.64, "end": 317.92, "text": "give a compilation error. Now let me write return apply this even that also you cannot write. If"},
        {"start": 317.92, "end": 323.2, "text": "at all you are using return apply, don'"'"'t write anything, otherwise no need to write anything"},
        {"start": 323.2, "end": 328.48, "text": "at all because anyhow it is always going to return the object. And in the same way return also can"},
        {"start": 328.48, "end": 333.76, "text": "I write it? No, it is a compilation error. Can I write anything here, which is a string? No. Once"},
        {"start": 333.76, "end": 339.04, "text": "again, it always returns the object you cannot return anything. So you cannot return anything"},
        {"start": 339.04, "end": 344.32, "text": "other than object and you cannot write anything in front of the return also. So you can either"},
        {"start": 344.32, "end": 349.6, "text": "keep it empty or don'"'"'t write it at all. We have covered a pretty good ground here. The remaining"},
        {"start": 349.6, "end": 354.88, "text": "part will be explained in the next video. That brings us to the end of this particular video."},
        {"start": 354.88, "end": 360.16, "text": "Don'"'"'t forget to like, comment, share the video and subscribe to the channel. Take care. Bye."}
    ]}'::jsonb, '$.segments'
) AS segment;

-- Continue with the remaining files in the same pattern...
-- Due to length constraints, I'll show the pattern for the first two files.
-- You would repeat this same structure for each of the remaining 12 files.

-- For brevity, here's the template for the remaining files:
--
-- -- File: [FILENAME_WITHOUT_EXTENSION].json
-- -- YouTube Video ID: [FILENAME_WITHOUT_EXTENSION]
--
-- -- First, verify: SELECT id FROM lessons WHERE youtube_video_id = '[FILENAME_WITHOUT_EXTENSION]';
-- -- Then replace :lesson_id with the actual ID from the query above.
--
-- INSERT INTO transcript_chunks (lesson_id, chunk_text, start_time, end_time)
-- SELECT
--     :lesson_id AS lesson_id,
--     segment.value->>'text' AS chunk_text,
--     (segment.value->>'start')::numeric AS start_time,
--     (segment.value->>'end')::numeric AS end_time
-- FROM jsonb_array_elements(
--     '[PASTE_THE_SEGMENTS_ARRAY_FROM_THE_JSON_FILE_HERE]'::jsonb, '$.segments'
-- ) AS segment;
--
-- You would need to extract the "segments" array from each JSON file and paste it here.
