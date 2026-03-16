import { useLocation, useNavigate } from "react-router-dom";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";

const HealthDashboardPage = () => {

const location = useLocation();
const navigate = useNavigate();

const data:any = location.state;

if(!data){
return <div>No Data</div>
}

const { risk, probability, form } = data;


// ---------- Lifestyle Score ----------
let lifestyleScore = 0;

if(form["Reg.Exercise(Y/N)"] === 1) lifestyleScore += 30;
if(form["Fast food (Y/N)"] === 0) lifestyleScore += 30;
if(form["BMI"] < 25) lifestyleScore += 20;
if(form["Weight gain(Y/N)"] === 0) lifestyleScore += 20;


// ---------- Stress Score ----------
let stressScore = 0;

if(form["Hair loss(Y/N)"] === 1) stressScore += 40;
if(form["Pimples(Y/N)"] === 1) stressScore += 30;
if(form["Cycle(R/I)"] === "I") stressScore += 30;


// ---------- Recommendation Logic ----------

let yoga = [];
let exercise = [];
let diet = [];

if(risk === "high"){

yoga = ["Baddha Konasana","Bhujangasana","Balasana"];
exercise = ["Walking","Light Cardio"];
diet = ["Low GI foods","High Fiber Diet","Avoid Sugar"];

}
else if(risk === "medium"){

yoga = ["Surya Namaskar","Setu Bandhasana"];
exercise = ["Jogging","Strength Training"];
diet = ["Balanced diet","Protein rich foods"];

}
else{

yoga = ["Morning Yoga","Stretching"];
exercise = ["Daily walk","Home workout"];
diet = ["Balanced healthy meals"];

}


return(

<div className="space-y-5">

<h1 className="text-2xl font-bold">
Women's Health Dashboard
</h1>


{/* PCOS Risk */}

<GlassCard>

<h2 className="text-lg font-semibold">PCOS Risk</h2>

<p className="text-xl">{risk.toUpperCase()}</p>

<p>{probability}% probability</p>

</GlassCard>


{/* Lifestyle */}

<GlassCard>

<h2 className="text-lg font-semibold">Lifestyle Score</h2>

<p className="text-xl">{lifestyleScore}/100</p>

</GlassCard>


{/* Stress */}

<GlassCard>

<h2 className="text-lg font-semibold">Stress Risk</h2>

<p className="text-xl">{stressScore}/100</p>

</GlassCard>



{/* Recommendations */}

<GlassCard>

<h2 className="text-lg font-semibold">Recommended Yoga</h2>

{yoga.map((y:any,i:number)=>(
<p key={i}>• {y}</p>
))}

<Button
className="mt-3"
onClick={()=>navigate("/yoga")}
>
View Yoga Plan
</Button>

</GlassCard>


<GlassCard>

<h2 className="text-lg font-semibold">Recommended Exercise</h2>

{exercise.map((e:any,i:number)=>(
<p key={i}>• {e}</p>
))}

<Button
className="mt-3"
onClick={()=>navigate("/exercise")}
>
View Exercise Plan
</Button>

</GlassCard>


<GlassCard>

<h2 className="text-lg font-semibold">Recommended Diet</h2>

{diet.map((d:any,i:number)=>(
<p key={i}>• {d}</p>
))}

<Button
className="mt-3"
onClick={()=>navigate("/diet")}
>
View Diet Plan
</Button>

</GlassCard>


</div>

)

}

export default HealthDashboardPage