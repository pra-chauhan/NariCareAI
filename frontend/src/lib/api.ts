export const predictBasic = async (data:any) => {

const response = await fetch("http://127.0.0.1:8000/predict-basic",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body: JSON.stringify({data})
})

return await response.json()

}
export const predictAdvanced = async (data:any) => {

const response = await fetch("http://127.0.0.1:8000/predict-advanced",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body: JSON.stringify({data})
})

return await response.json()

}
export const generateDiet = async () => {
  try {
    const res = await fetch("http://localhost:8000/generate-diet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // or profile if needed
    });

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("API ERROR:", error);
    return { success: false, error: "API failed" };
  }
};