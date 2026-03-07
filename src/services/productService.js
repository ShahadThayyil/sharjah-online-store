import {
  collection, addDoc, getDocs, getDoc,
  doc, deleteDoc, updateDoc,
  serverTimestamp, query, orderBy, increment,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const COL = "products";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// ─── Upload a single image to Cloudinary → returns secure URL ────────────────
async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "products");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();

  if (data.error) {
    throw new Error(`Cloudinary upload failed: ${data.error.message}`);
  }

  return data.secure_url; // permanent https:// CDN URL
}

// ─── Upload multiple images → returns array of URLs ──────────────────────────
export async function uploadImages(files) {
  const urls = await Promise.all(files.map(uploadImageToCloudinary));
  return urls;
}

// ─── Add new product ──────────────────────────────────────────────────────────
export async function addProduct(data, imageFiles) {
  // 1. Upload images to Cloudinary
  let imageUrls = [];
  if (imageFiles && imageFiles.length > 0) {
    imageUrls = await uploadImages(imageFiles);
  }

  // 2. Save product + Cloudinary URLs to Firestore
  const docRef = await addDoc(collection(db, COL), {
    ...data,
    images: imageUrls,
    clicks: 0,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

// ─── Get all products (newest first) ─────────────────────────────────────────
export async function getProducts() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ productId: d.id, ...d.data() }));
}

// ─── Get one product by ID ────────────────────────────────────────────────────
export async function getProductById(productId) {
  const snap = await getDoc(doc(db, COL, productId));
  if (!snap.exists()) return null;
  return { productId: snap.id, ...snap.data() };
}

// ─── Increment click count ────────────────────────────────────────────────────
export async function incrementProductClicks(productId) {
  try {
    await updateDoc(doc(db, COL, productId), { clicks: increment(1) });
  } catch (_) {
    // Silent fail — non-critical
  }
}

// ─── Delete product ───────────────────────────────────────────────────────────
// Cloudinary image deletion requires API Secret (unsafe on frontend).
// Product is removed from Firestore; image stays on Cloudinary CDN.
export async function deleteProduct(productId) {
  await deleteDoc(doc(db, COL, productId));
}

// ─── Update product ───────────────────────────────────────────────────────────
export async function updateProduct(productId, updatedData, newImageFiles = []) {
  let imageUrls = updatedData.images || [];

  if (newImageFiles && newImageFiles.length > 0) {
    const newUrls = await uploadImages(newImageFiles);
    imageUrls = [...imageUrls, ...newUrls];
  }

  await updateDoc(doc(db, COL, productId), {
    ...updatedData,
    images: imageUrls,
  });
}