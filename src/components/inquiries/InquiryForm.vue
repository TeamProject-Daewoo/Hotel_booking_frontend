<template>
  <div class="inquiry-form">
    <h2>1:1 문의 작성</h2>

    <form @submit.prevent="submitInquiry">
      <label for="category">문의 유형</label>
      <select id="category" v-model="form.category" required>
        <option disabled value="">문의 유형을 선택하세요</option>
        <option value="예약문의">예약문의</option>
        <option value="취소/변경문의">취소/변경문의</option>
        <option value="결제문의">결제문의</option>
        <option value="현장 서비스 문의">현장 서비스 문의</option>
        <option value="기타">기타</option>
      </select>

      <label for="title">제목</label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        placeholder="제목을 입력하세요"
        required
      />

      <label for="content">내용</label>
      <textarea
        id="content"
        v-model="form.content"
        placeholder="문의 내용을 작성해주세요"
        rows="6"
        required
      ></textarea>

      <!-- ✅ 파일 첨부 -->
      <label for="files">첨부파일 (선택, 여러 개 가능)</label>
      <input
        id="files"
        type="file"
        multiple
        @change="handleFileChange"
        accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.hwp,.doc,.docx"
      />
      <p v-if="uploading">파일 업로드 중...</p>

      <ul v-if="form.attachmentUrls.length" class="uploaded-file-list">
        <li
          v-for="(url, index) in form.attachmentUrls"
          :key="index"
          class="uploaded-file-link"
        >
          <a :href="url" target="_blank">{{ getFileName(url) }}</a>
          <button type="button" @click="removeFile(index)">삭제</button>
        </li>
      </ul>

      <button type="submit" :disabled="loading || uploading || lastUploadHadInvalidFiles.value">
        {{ loading ? "전송 중..." : "문의 등록" }}
      </button>
    </form>

    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import axios from "axios";
import { useAuthStore } from "@/api/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  category: "",
  title: "",
  content: "",
  attachmentUrls: [],
});

const loading = ref(false);
const uploading = ref(false);
const message = ref("");
const lastUploadHadInvalidFiles = ref(false);

// ✅ 허용된 확장자 목록
const allowedExtensions = [
  "jpg", "jpeg", "png", "gif", "bmp",
  "pdf", "hwp", "doc", "docx"
];

// ✅ 파일 업로드 핸들러
const handleFileChange = async (event) => {
  const files = Array.from(event.target.files);
  if (!files.length) return;

  // ✅ 확장자 필터링
  const invalidFiles = files.filter(file => {
    const ext = file.name.split('.').pop().toLowerCase();
    return !allowedExtensions.includes(ext);
  });

  if (invalidFiles.length) {
    lastUploadHadInvalidFiles.value = true;
    message.value = `허용되지 않는 파일 형식입니다: ${invalidFiles.map(f => f.name).join(", ")}`;
    return;
  }

  lastUploadHadInvalidFiles.value = false;
  uploading.value = true;
  message.value = "";

  try {
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    const response = await axios.post(
      "http://localhost:8888/api/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );

    for (const uploadedFile of response.data) {
      form.attachmentUrls.push(uploadedFile.url);
    }
  } catch (error) {
    message.value = "파일 업로드 중 오류가 발생했습니다.";
  } finally {
    uploading.value = false;
  }
};

// 파일 삭제
const removeFile = (index) => {
  form.attachmentUrls.splice(index, 1);
};

// 문의 등록
const submitInquiry = async () => {
  if (!form.category || !form.title || !form.content) {
    message.value = "필수 항목을 모두 입력해주세요.";
    return;
  }

  if (!authStore.accessToken) {
    message.value = "로그인이 필요합니다.";
    return;
  }

  if (lastUploadHadInvalidFiles.value) {
    message.value = "허용되지 않는 파일 형식이 포함되어 있습니다.";
    return;
  }

  loading.value = true;
  message.value = "";

  try {
    await axios.post(
      "http://localhost:8888/api/inquiries/with-files",
      {
        inquiry: {
          category: form.category,
          title: form.title,
          content: form.content,
          attachmentUrl: null,
        },
        fileUrls: form.attachmentUrls,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );

    message.value = "문의가 등록되었습니다.";
    setTimeout(() => {
      router.push("/inquiries");
    }, 2000);
  } catch (error) {
    message.value = error.response?.data || "문의 등록 중 오류가 발생했습니다.";
  } finally {
    loading.value = false;
  }
};

// 파일명 추출
const getFileName = (url) => {
  if (!url) return "";
  return url.substring(url.lastIndexOf("/") + 1);
};
</script>

<style scoped>
.inquiry-form {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fafafa;
  font-family: "Noto Sans KR", sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #2c3e50;
}

label {
  display: block;
  margin: 15px 0 6px 0;
  font-weight: 600;
  color: #34495e;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

button {
  margin-top: 25px;
  width: 100%;
  padding: 12px 0;
  background-color: #42b983;
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.25s ease;
}

button:disabled {
  background-color: #7ac29a;
  cursor: not-allowed;
}

.uploaded-file-list {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}

.uploaded-file-link {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
}

.uploaded-file-link a {
  color: #42b983;
  text-decoration: underline;
}

.uploaded-file-link button {
  background: #e74c3c;
  border: none;
  padding: 3px 8px;
  color: white;
  font-size: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}

.message {
  margin-top: 20px;
  text-align: center;
  font-weight: 600;
  color: #27ae60;
}
</style>
