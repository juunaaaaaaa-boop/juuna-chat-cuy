
import { auth, db } from "./firebase-config.js";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const $ = (id) => document.getElementById(id);

window.juumao = {
  confirmation: null,
  unsubscribe: null,

  async setupCaptcha() {
    if (window.juumao.captcha) return;
    window.juumao.captcha = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "normal" }
    );
    await window.juumao.captcha.render();
  },

  async sendOTP(phone) {
    try {
      await this.setupCaptcha();
      this.confirmation = await signInWithPhoneNumber(
        auth, phone, this.captcha
      );
      alert("Kode OTP sudah diminta. Periksa SMS kamu.");
    } catch (error) {
      alert("Gagal meminta OTP: " + error.message);
    }
  },

  async verifyOTP(code) {
    try {
      if (!this.confirmation) throw new Error("Minta OTP terlebih dahulu.");
      await this.confirmation.confirm(code);
    } catch (error) {
      alert("Verifikasi gagal: " + error.message);
    }
  },

  async sendMessage(chatId, text) {
    const user = auth.currentUser;
    if (!user || !chatId || !text.trim()) return;

    try {
      await addDoc(
        collection(db, "chats", chatId, "messages"),
        {
          senderId: user.uid,
          text: text.trim(),
          createdAt: serverTimestamp()
        }
      );
    } catch (error) {
      alert("Pesan gagal dikirim: " + error.message);
    }
  },

  listenMessages(chatId, callback) {
    if (this.unsubscribe) this.unsubscribe();

    const messagesQuery = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    this.unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      callback(snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })));
    }, (error) => {
      console.error("Gagal memuat pesan:", error);
    });
  },

  async logout() {
    if (this.unsubscribe) this.unsubscribe();
    await signOut(auth);
  }
};

onAuthStateChanged(auth, (user) => {
  document.dispatchEvent(
    new CustomEvent("juumao-auth", { detail: { user } })
  );
});
                 
