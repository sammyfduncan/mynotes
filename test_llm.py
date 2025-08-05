from app.gen_api import gen_notes
import os 

test_path = "Presentation1.pdf"


print("Starting llm test...")

if not os.path.exists(test_path):
    print(f"file not found at {test_path}")

print(f"Sending {test_path} to gemini..")

try:
    testnotes = gen_notes(file_path=test_path)
    if testnotes:
        print("Success, recieved:\n")
        print(testnotes)
    else:
        print("Failed, API called but empty response\n")

except Exception as e:
    print(f"failed: {e}")

