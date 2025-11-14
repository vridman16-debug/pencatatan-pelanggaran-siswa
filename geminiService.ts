import { GoogleGenAI } from "@google/genai";
import { ViolationRecord } from "../types.ts";

export const analyzeViolations = async (records: ViolationRecord[]): Promise<string> => {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    const errorMessage = "Error: Kunci API Gemini tidak dikonfigurasi. Pastikan Anda telah mengatur variabel lingkungan 'API_KEY' di pengaturan proyek Vercel Anda.";
    console.error(errorMessage);
    return errorMessage;
  }
  
  if (records.length === 0) {
    return "Tidak ada data pelanggaran untuk dianalisis.";
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `
    Anda adalah asisten kepala sekolah yang ahli dalam menganalisis data kedisiplinan siswa.
    Berdasarkan data pelanggaran atribut upacara berikut, berikan analisis mendalam.

    Data Pelanggaran:
    ${JSON.stringify(records, null, 2)}

    Tugas Anda:
    1.  **Ringkasan Eksekutif:** Berikan ringkasan singkat tentang tren pelanggaran secara keseluruhan.
    2.  **Pelanggaran Paling Umum:** Identifikasi 3 jenis pelanggaran yang paling sering terjadi dan hitung jumlahnya.
    3.  **Tren Berdasarkan Kelas:** Apakah ada kelas atau tingkatan tertentu yang menunjukkan lebih banyak pelanggaran? Jika ya, sebutkan.
    4.  **Analisis Berdasarkan Jenis Kelamin:** Apakah ada tren pelanggaran yang spesifik berdasarkan jenis kelamin (misalnya, pelanggaran 'Rambut Panjang' hanya untuk putra)? Analisis data ini.
    5.  **Rekomendasi Tindakan:** Berikan 3 rekomendasi konkret dan praktis yang dapat dilakukan oleh pihak sekolah (guru piket, kesiswaan, atau wali kelas) untuk mengurangi jumlah pelanggaran ini di masa depan.
    
    Format output Anda dalam format Markdown yang jelas dan terstruktur.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && /API key not valid/i.test(error.message)) {
       return "Maaf, terjadi kesalahan: Kunci API tidak valid. Mohon periksa kembali nilai 'API_KEY' di pengaturan Vercel Anda.";
    }
    return "Maaf, terjadi kesalahan saat menganalisis data. Kemungkinan ada masalah dengan koneksi ke layanan AI. Silakan coba lagi nanti.";
  }
};