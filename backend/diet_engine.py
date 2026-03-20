from dotenv import load_dotenv
import os
from groq import Groq
from pathlib import Path
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)



# =========================
# 🔥 LOGIC ENGINE (SMART)
# =========================
def generate_diet_plan(user):

    risk = user.probability

    # Calories logic (PCOS aware)
    if risk > 0.7:
        calories = 1500
    elif risk > 0.4:
        calories = 1700
    else:
        calories = 1900

    # Macros
    protein = round(calories * 0.30 / 4)
    carbs   = round(calories * 0.35 / 4)
    fats    = round(calories * 0.35 / 9)

    return {
        "calories": calories,
        "protein": protein,
        "carbs": carbs,
        "fats": fats,
        "has_pcos": risk > 0.5
    }


# =========================
# 🤖 LLM DIET GENERATOR
# =========================
def generate_ai_diet(user, nutrition):

    prompt = f"""
    Create a 7-day Indian diet plan.

    User:
    - PCOS Risk: {user.probability}
    - Calories: {nutrition['calories']}
    - Protein: {nutrition['protein']}g

    STRICT RULES:
    - Low glycemic index foods ONLY
    - No sugar, no processed food
    - High protein + high fiber
    - Indian meals only
    - Balance hormones (PCOS specific)
    - Include seeds (flax, chia), vegetables, healthy fats
    - Avoid dairy overload if PCOS high

    PERSONALIZATION:
    - If PCOS risk high → anti-inflammatory foods
    - If weight gain → calorie deficit meals
    - If irregular cycle → add iron + omega-3 foods

    OUTPUT JSON ONLY:
    {{
      "days": [
        {{
          "day": "Monday",
          "meals": {{
            "breakfast": "...",
            "lunch": "...",
            "dinner": "...",
            "snacks": "..."
          }}
        }}
      ]
    }}
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    return response.choices[0].message.content

