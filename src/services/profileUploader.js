const IMGBB_API = "https://api.imgbb.com/1/upload";
const API_KEY = import.meta.env.VITE_IMGBB_API_KEY; 


export async function uploadImageToImgBB(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${IMGBB_API}?key=${API_KEY}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error("Image upload failed");
  }

  return data.data.url; 
}
