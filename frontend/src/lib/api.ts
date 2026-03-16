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