import React, { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import ProgressBar3D from "@/components/ui/ProgressBar3D";
import { Button } from "@/components/ui/button";
import { predictBasic, predictAdvanced } from "@/lib/api";
import { getProfile } from "@/lib/store";
import { Microscope, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ---------------- FIELD DESCRIPTIONS ---------------- */

const fieldInfo: any = {
  "Age (yrs)": "Your age in years (example: 22)",
  "BMI": "Body Mass Index (auto calculated or enter manually)",
  "Cycle(R/I)": "Menstrual cycle pattern (Regular or Irregular)",
  "Weight gain(Y/N)": "Have you experienced sudden weight gain recently?",
  "hair growth(Y/N)": "Unwanted facial/body hair growth",
  "Pimples(Y/N)": "Frequent acne or pimples",
  "Fast food (Y/N)": "Do you frequently eat fast food?",
  "Reg.Exercise(Y/N)": "Do you exercise regularly?",

  "Weight (Kg)": "Your weight in kilograms",
  "Height(Cm)": "Your height in centimeters",
  "Marraige Status (Yrs)": "Years since marriage (0 if unmarried)",
  "Pulse rate(bpm)": "Heart rate per minute",

  "Hb(g/dl)": "Hemoglobin level (blood test)",
  "AMH(ng/mL)": "Anti-Mullerian Hormone level",
  "Vit D3 (ng/mL)": "Vitamin D3 blood level",

  "Cycle length(days)": "Average menstrual cycle length",
  "Hip(inch)": "Hip circumference",
  "Waist(inch)": "Waist circumference",

  "Follicle No. (L)": "Number of follicles in left ovary",
  "Follicle No. (R)": "Number of follicles in right ovary",

  "Avg. F size (L) (mm)": "Average follicle size in left ovary",
  "Avg. F size (R) (mm)": "Average follicle size in right ovary",

  "Endometrium (mm)": "Thickness of uterus lining"
};

/* ---------------- ADVANCED CATEGORIES ---------------- */

const featureCategories: any = {

  Demographics: [
    "Age (yrs)",
    "Weight (Kg)",
    "Height(Cm)",
    "BMI",
    "Marraige Status (Yrs)"
  ],

  "Vital Signs": [
    "Pulse rate(bpm)"
  ],

  "Blood Work": [
    "Hb(g/dl)",
    "AMH(ng/mL)",
    "Vit D3 (ng/mL)"
  ],

  "Reproductive Health": [
    "Cycle(R/I)",
    "Cycle length(days)",
    "Hip(inch)",
    "Waist(inch)",
    "Follicle No. (L)",
    "Follicle No. (R)",
    "Avg. F size (L) (mm)",
    "Avg. F size (R) (mm)",
    "Endometrium (mm)"
  ],

  "Symptoms & Lifestyle": [
    "Weight gain(Y/N)",
    "hair growth(Y/N)",
    "Skin darkening (Y/N)",
    "Hair loss(Y/N)",
    "Pimples(Y/N)",
    "Fast food (Y/N)",
    "Reg.Exercise(Y/N)"
  ]
};

/* ---------------- COMPONENT ---------------- */

const PCOSDetectionPage = () => {

  const profile = getProfile()!;
  const navigate = useNavigate();

  const [mode, setMode] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [form, setForm] = useState<any>({
    "Age (yrs)": 22,
    "Weight (Kg)": profile?.weight || 60,
    "Height(Cm)": profile?.height || 160,
    "BMI": 22,

    "Marraige Status (Yrs)": 0,
    "Pulse rate(bpm)": 72,

    "Hb(g/dl)": 12,
    "AMH(ng/mL)": 3,
    "Vit D3 (ng/mL)": 30,

    "Cycle(R/I)": "R",
    "Cycle length(days)": 28,

    "Hip(inch)": 36,
    "Waist(inch)": 30,

    "Follicle No. (L)": 5,
    "Follicle No. (R)": 5,

    "Avg. F size (L) (mm)": 10,
    "Avg. F size (R) (mm)": 10,

    "Endometrium (mm)": 8,

    "Weight gain(Y/N)": 0,
    "hair growth(Y/N)": 0,
    "Skin darkening (Y/N)": 0,
    "Hair loss(Y/N)": 0,
    "Pimples(Y/N)": 0,
    "Fast food (Y/N)": 0,
    "Reg.Exercise(Y/N)": 0
  });

  const updateValue = (key: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  /* ---------------- DETECTION ---------------- */

  const handleDetect = async () => {

    try {

      setLoading(true);

      let response;

      if (mode === "basic") {

        const basicPayload = {
          "Age (yrs)": form["Age (yrs)"],
          "BMI": form["BMI"],
          "Cycle(R/I)": form["Cycle(R/I)"] === "R" ? 0 : 1,
          "Weight gain(Y/N)": form["Weight gain(Y/N)"],
          "hair growth(Y/N)": form["hair growth(Y/N)"],
          "Pimples(Y/N)": form["Pimples(Y/N)"],
          "Fast food (Y/N)": form["Fast food (Y/N)"],
          "Reg.Exercise(Y/N)": form["Reg.Exercise(Y/N)"]
        };

        response = await predictBasic(basicPayload);

      } else {

        const advancedPayload = {
          ...form,
          "Cycle(R/I)": form["Cycle(R/I)"] === "R" ? 0 : 1
        };

        response = await predictAdvanced(advancedPayload);

      }

      const probability = Math.round(response.pcos_probability * 100);

      let risk = "low";
      if (probability > 70) risk = "high";
      else if (probability > 40) risk = "medium";

      const resultData = {
        risk,
        probability,
        recommendations: [
          "Maintain balanced diet",
          "Exercise regularly",
          "Track menstrual cycle",
          "Consult gynecologist if symptoms persist"
        ]
      };

      setResult(resultData);

      navigate("/health-dashboard", {
        state: { risk, probability, form }
      });

    } catch (err) {

      console.error("Prediction error", err);

    } finally {

      setLoading(false);

    }

  };

  const inputClass = "soft-input w-full px-3 py-2 text-sm border rounded";

  /* ---------------- UI ---------------- */

  return (

    <div className="space-y-6">

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl flex items-center gap-2">
          <Microscope/> PCOS Detection
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your health details below to check PCOS risk.
        </p>
      </motion.div>

      {/* MODE SWITCH */}

      <div className="flex gap-3">

        <Button
          variant={mode === "basic" ? "default" : "outline"}
          onClick={() => setMode("basic")}
        >
          Basic Screening
        </Button>

        <Button
          variant={mode === "advanced" ? "default" : "outline"}
          onClick={() => setMode("advanced")}
        >
          Advanced Screening
        </Button>

      </div>

      {/* BASIC MODE */}

      {mode === "basic" && (

        <GlassCard>

          <h3 className="text-lg mb-4">Early PCOS Screening</h3>

          <div className="grid grid-cols-2 gap-4">

            {["Age (yrs)", "BMI"].map((field)=>(

              <div key={field}>
                <label className="text-sm font-medium flex items-center gap-1">
                  {field}
                  <Info size={14}/>
                </label>

                <p className="text-xs text-muted-foreground mb-1">
                  {fieldInfo[field]}
                </p>

                <input
                  type="number"
                  className={inputClass}
                  value={form[field]}
                  onChange={(e)=>updateValue(field,Number(e.target.value))}
                />
              </div>

            ))}

            <div>

              <label className="text-sm font-medium">Cycle Type</label>

              <p className="text-xs text-muted-foreground mb-1">
                {fieldInfo["Cycle(R/I)"]}
              </p>

              <select
                className={inputClass}
                value={form["Cycle(R/I)"]}
                onChange={(e)=>updateValue("Cycle(R/I)",e.target.value)}
              >
                <option value="R">Regular</option>
                <option value="I">Irregular</option>
              </select>

            </div>

          </div>

          {/* BASIC SYMPTOMS */}

          <div className="grid grid-cols-2 gap-3 mt-6">

            {[
              "Weight gain(Y/N)",
              "hair growth(Y/N)",
              "Pimples(Y/N)",
              "Fast food (Y/N)",
              "Reg.Exercise(Y/N)"
            ].map((feature)=>{

              const active = form[feature] === 1;

              return(

                <div
                  key={feature}
                  onClick={()=>updateValue(feature, active ? 0 : 1)}
                  className={`cursor-pointer px-3 py-3 rounded border text-sm
                  ${active
                    ? "bg-pink-200 border-pink-300"
                    : "bg-cream border-muted"}`}
                >
                  {feature.replace("(Y/N)","")}
                </div>

              )

            })}

          </div>

        </GlassCard>

      )}

      {/* ADVANCED MODE stays SAME */}

      {mode === "advanced" &&
        Object.entries(featureCategories).map(([category, features]) => (

          <GlassCard key={category}>

            <h3 className="text-lg mb-4">{category}</h3>

            <div className="grid grid-cols-2 gap-4">

              {(features as string[]).map((feature)=>{

                const isBinary = feature.includes("(Y/N)");
                const isCycle = feature === "Cycle(R/I)";
                const isLifestyle = category === "Symptoms & Lifestyle";

                if(isBinary && isLifestyle){

                  const active = form[feature] === 1;

                  return(

                    <div
                      key={feature}
                      onClick={()=>updateValue(feature, active ? 0 : 1)}
                      className={`cursor-pointer px-3 py-3 rounded border text-sm
                      ${active
                        ? "bg-pink-200 border-pink-300"
                        : "bg-cream border-muted"}`}
                    >
                      {feature.replace("(Y/N)","")}
                    </div>

                  )

                }

                return(

                  <div key={feature}>

                    <label className="text-sm font-medium flex items-center gap-1">
                      {feature.replace("(Y/N)","")}
                      <Info size={14}/>
                    </label>

                    <p className="text-xs text-muted-foreground mb-1">
                      {fieldInfo[feature]}
                    </p>

                    {isCycle ? (

                      <select
                        className={inputClass}
                        value={form[feature]}
                        onChange={(e)=>updateValue(feature,e.target.value)}
                      >
                        <option value="R">Regular</option>
                        <option value="I">Irregular</option>
                      </select>

                    ) : (

                      <input
                        type="number"
                        className={inputClass}
                        value={form[feature]}
                        onChange={(e)=>updateValue(feature,Number(e.target.value))}
                      />

                    )}

                  </div>

                )

              })}

            </div>

          </GlassCard>

        ))
      }

      <Button className="w-full" onClick={handleDetect} disabled={loading}>
        {loading ? "Analyzing..." : "Run PCOS Analysis"}
      </Button>

      {result && (

        <GlassCard className="space-y-4">

          <div className="flex items-center gap-3">

            {result.risk === "low"
              ? <CheckCircle2/>
              : <AlertTriangle/>
            }

            <h3 className="text-xl">
              {result.risk.toUpperCase()} RISK
            </h3>

          </div>

          <ProgressBar3D
            value={result.probability}
            max={100}
            label={`${result.probability}% probability`}
          />

        </GlassCard>

      )}

    </div>

  );

};

export default PCOSDetectionPage;