import React, { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import ProgressBar3D from "@/components/ui/ProgressBar3D";
import { Button } from "@/components/ui/button";
import { predictBasic, predictAdvanced } from "@/lib/api";
import { getProfile } from "@/lib/store";
import { Microscope, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    "BMI": profile?.weight && profile?.height
      ? profile.weight / ((profile.height / 100) ** 2)
      : 22,

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
          "Maintain a balanced diet",
          "Exercise regularly",
          "Consult a gynecologist",
          "Track menstrual cycles"
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

  const riskColors: any = {
    low: "bg-sage",
    medium: "bg-accent",
    high: "bg-destructive"
  };

  return (

    <div className="space-y-6">

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl flex items-center gap-2">
          <Microscope /> PCOS Detection
        </h1>
      </motion.div>

      <div className="flex gap-3 mb-4">

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

      {/* BASIC SCREENING */}

      {mode === "basic" && (

        <GlassCard>

          <h3 className="text-lg mb-3">Early PCOS Screening</h3>

          <div className="grid grid-cols-2 gap-3">

            <input
              type="number"
              className={inputClass}
              value={form["Age (yrs)"]}
              onChange={(e)=>updateValue("Age (yrs)", Number(e.target.value))}
              placeholder="Age"
            />

            <input
              type="number"
              className={inputClass}
              value={form["BMI"]}
              onChange={(e)=>updateValue("BMI", Number(e.target.value))}
              placeholder="BMI"
            />

            <select
              className={inputClass}
              value={form["Cycle(R/I)"]}
              onChange={(e)=>updateValue("Cycle(R/I)", e.target.value)}
            >
              <option value="R">Regular</option>
              <option value="I">Irregular</option>
            </select>

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
                  className={`cursor-pointer px-3 py-2 rounded border text-sm
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

      {/* ADVANCED SCREENING */}

      {mode === "advanced" &&

        Object.entries(featureCategories).map(([category, features]) => (

          <GlassCard key={category}>

            <h3 className="text-lg mb-3">{category}</h3>

            <div className="grid grid-cols-2 gap-3">

              {(features as string[]).map((feature)=>{

                const isBinary = feature.includes("(Y/N)");
                const isCycle = feature === "Cycle(R/I)";

                if (isBinary){

                  const active = form[feature] === 1;

                  return(

                    <div
                      key={feature}
                      onClick={()=>updateValue(feature, active ? 0 : 1)}
                      className={`cursor-pointer px-3 py-2 rounded border
                      ${active ? "bg-pink-200 border-pink-300" : "bg-cream border-muted"}`}
                    >
                      {feature.replace("(Y/N)","")}
                    </div>

                  )

                }

                if (isCycle){

                  return(

                    <select
                      key={feature}
                      className={inputClass}
                      value={form[feature]}
                      onChange={(e)=>updateValue(feature,e.target.value)}
                    >
                      <option value="R">Regular</option>
                      <option value="I">Irregular</option>
                    </select>

                  )

                }

                return(

                  <input
                    key={feature}
                    type="number"
                    className={inputClass}
                    value={form[feature] || 0}
                    onChange={(e)=>updateValue(feature,Number(e.target.value))}
                    placeholder={feature}
                  />

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
            color={riskColors[result.risk]}
            label={`${result.probability}% probability`}
          />

          <div>

            <h4 className="flex items-center gap-1">
              <Info size={14}/> Recommendations
            </h4>

            {result.recommendations.map((r:string,i:number)=>(
              <p key={i}>• {r}</p>
            ))}

          </div>

        </GlassCard>

      )}

    </div>

  );

};

export default PCOSDetectionPage;