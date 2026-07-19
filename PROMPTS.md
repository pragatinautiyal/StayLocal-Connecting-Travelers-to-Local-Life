# StayLocal AI Travel Planner – Prompt Engineering Log

This document records the prompt engineering process followed while developing the AI Travel Planner feature for **StayLocal**.

The objective was to generate personalized travel itineraries by combining traveller preferences with listings available on the StayLocal platform.

---

# System Role

The AI is instructed to act as **StayLocal's official AI Travel Planner**.

Its responsibilities are to:

- Generate personalized travel itineraries.
- Prioritize StayLocal listings over external recommendations.
- Recommend nearby attractions only when platform listings are insufficient.
- Keep recommendations within the traveller's budget.
- Produce a clear, engaging, and day-wise itinerary.

---

# Prompt Variation 1

## Prompt

Generate a travel itinerary based on the traveller's destination, budget, duration, and travel type.

## Example Input

Destination: Rishikesh

Budget: ₹5000

Duration: 2 Days

Travel Type: Solo

## Example Output

- Visit Lakshman Jhula
- Explore Ram Jhula
- Try local street food
- Attend Ganga Aarti

## Observation

This prompt generated generic travel suggestions and did not utilize StayLocal listings stored in the database. The recommendations could not promote hosts available on the platform.

---

# Prompt Variation 2

## Prompt

Generate a personalized itinerary using the traveller's preferences and prioritize the StayLocal listings provided below. If there are not enough listings, recommend nearby attractions and local food.

## Example Input

Destination: Rishikesh

Budget: ₹7000

Duration: 3 Days

Travel Type: Friends

Available StayLocal Listings

- Himalayan Homestay
- Forest Retreat Cafe

## Example Output

Day 1

Morning
- Check in at Himalayan Homestay

Afternoon
- Lunch at Forest Retreat Cafe

Evening
- Explore Ram Jhula

Budget Summary

Approx. ₹6500

## Observation

This version successfully incorporated StayLocal listings into the itinerary. However, the output structure was inconsistent and sometimes omitted transport suggestions, activity costs, and reasons for recommendations.

---

# Prompt Variation 3 (Final Prompt)

## Prompt

You are StayLocal's official AI Travel Planner.

StayLocal is a platform that connects travellers with authentic local stays, cafes, workshops, wellness activities and experiences.

Your job is to create a personalized travel itinerary.

### Traveller Details

- Destination
- Budget
- Duration
- Travel Type

### Rules

- Prioritize the StayLocal listings provided.
- Mention listing titles naturally.
- Never invent a StayLocal listing.
- Recommend nearby attractions only if the available listings are insufficient.
- Explain why each StayLocal recommendation is suitable.
- Keep the itinerary within the traveller's budget.
- Organize the itinerary in a day-wise format.
- Include estimated activity costs.
- Include food recommendations.
- Include local transport suggestions.
- Include a budget summary at the end.
- Wrap every StayLocal listing name inside double brackets using the format `[[Listing Title]]`.
- Generate only the itinerary.

## Example Input

Destination: Rishikesh

Budget: ₹8000

Duration: 3 Days

Travel Type: Couple

Available StayLocal Listings

- Riverside Homestay
- Ganga View Cafe
- Pottery Workshop

## Example Output

### Day 1

**Morning**

Check in at [[Riverside Homestay]] and relax while enjoying the riverside surroundings.

**Afternoon**

Enjoy lunch at [[Ganga View Cafe]].

Estimated Cost: ₹600

**Evening**

Attend the [[Pottery Workshop]] to experience traditional local craftsmanship.

Estimated Cost: ₹900

Transport:
Walking and local auto-rickshaw.

---

### Budget Summary

Accommodation: ₹4000

Food: ₹1800

Activities: ₹1500

Transport: ₹500

Estimated Total: ₹7800

## Observation

This prompt produced the best results. The AI consistently prioritized StayLocal listings before suggesting external attractions, generated structured day-wise itineraries, respected the traveller's budget, and included food, transport, and budget summaries. Wrapping StayLocal listing names inside double brackets also made it easier for the frontend to identify and display platform recommendations.

---

# Best Prompt

**Prompt Variation 3** was selected for the final implementation.

This prompt combines traveller preferences with live StayLocal listings retrieved from MongoDB before sending the request to Google Gemini. The detailed rules ensure that Gemini promotes StayLocal hosts whenever possible, avoids inventing platform listings, and produces a consistent itinerary format. The structured output is easier to display in the frontend while also providing travellers with practical recommendations and transparent budget estimates.

---

# Final Prompt Strategy

The production implementation uses:

- Google Gemini API 
- Role-based prompting ("StayLocal AI Travel Planner")
- Traveller preferences (destination, budget, duration, travel type)
- Live StayLocal listings retrieved from MongoDB
- Prompt instructions that prioritize platform listings
- Budget-aware itinerary generation
- Day-wise itinerary formatting
- Estimated activity costs
- Food recommendations
- Local transport suggestions
- Budget summary
- Double-bracket notation (`[[Listing Name]]`) for identifying StayLocal listings in the frontend
