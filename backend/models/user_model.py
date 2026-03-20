from sqlalchemy import Column, Integer, Float, String, JSON
from database import Base

class PCOSRecord(Base):
    __tablename__ = "pcos_records"

    id = Column(Integer, primary_key=True, index=True)

    age = Column(Integer)
    bmi = Column(Float)
    cycle = Column(Integer)

    prediction = Column(Integer)
    probability = Column(Float)

    lifestyle_score = Column(Integer)
    stress_score = Column(Integer)

    top_factors = Column(JSON) 

    created_at = Column(String)