import os
from dotenv import load_dotenv
from google import genai
from database import listings_collection

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_itinerary(prompt: str):
    response = client.models.generate_content(
        model="gemini-flash-latest",   # or gemini-2.5-flash
        contents=prompt,
    )

    return response.text

def get_listings_by_city(city: str):
    """
    Fetch StayLocal listings for the requested city.
    """

    listings = list(
        listings_collection.find(
            {
                "city": {
                    "$regex": city,
                    "$options": "i"
                }
            },
            {
                "_id": 0
            }
        )
    )

    return listings

def build_prompt(request, listings):
    """
    Build the prompt for Gemini using StayLocal listings.
    """

    listing_text = ""

    if listings:
        for listing in listings:
            listing_text += f"""
Title: {listing.get("title")}
Category: {listing.get("category")}
Type: {listing.get("listingType")}
City: {listing.get("city")}
Address: {listing.get("address")}
Price: ₹{listing.get("price")} {listing.get("priceUnit")}

Description:
{listing.get("description")}

--------------------------------------------------
"""
    else:
        listing_text = "No StayLocal listings available."

    prompt = f"""
You are StayLocal's official AI Travel Planner.

StayLocal is a platform that connects travellers with authentic local stays,
cafes, workshops, wellness activities and experiences.

Your job is to create a personalized travel itinerary.

==================================================
AVAILABLE STAYLOCAL LISTINGS
==================================================

{listing_text}

==================================================
TRAVELLER DETAILS
==================================================

Destination: {request.destination}
Budget: ₹{request.budget}
Duration: {request.days} days
Travel Type: {request.travel_type}

==================================================
IMPORTANT RULES
==================================================

1. Prioritize the StayLocal listings provided above.

2. Mention the listing titles naturally.
   Example:
   "Visit Forest Retreat Cafe for a relaxing dinner."

3. NEVER say:
   - Listing 1
   - Listing 2
   - StayLocal Listing

4. Never invent a StayLocal listing.

5. If the provided listings are not enough to fill the itinerary,
   recommend famous attractions, cafes or activities nearby.

6. Explain WHY each StayLocal recommendation is suitable.

7. Keep the itinerary within the traveller's budget.

8. Organize the itinerary as:

Day 1
- Morning
- Afternoon
- Evening

Day 2
- Morning
- Afternoon
- Evening

9. Include:
- Estimated cost for each activity
- Estimated food expenses
- Local transport suggestions
- Budget summary at the end

10. Write in a friendly and engaging tone suitable for travellers.

When recommending options from our platform, you MUST include the reference name 
wrapped exactly in double brackets like this: [[Listing Title Goes Here]]. 
Do not alter the name spelling.

Generate only the itinerary.
"""

    return prompt