export const predictPCOS = async (data: any) => {
  const response = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: data
    }),
  });

  const result = await response.json();
  return result;
};