from services.ai_service import generate_itinerary

prompt = """
Generate a 2-day itinerary for Rishikesh with a budget of ₹5000.
"""

result = generate_itinerary(prompt)

print(result)