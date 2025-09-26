<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <div class="modal-header">
          <h2>이용약관</h2>
          <button class="close-button" @click="close">&times;</button>
        </div>
        <div class="modal-body">
          <h3>제 1장 총칙</h3>
          <h4>제 1조 (목적)</h4>
          <p>본 약관은 HotelHub(이하 "회사")가 제공하는 숙박 예약 관련 제반 서비스의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
          
          <h4>제 2조 (정의)</h4>
          <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
            <br>1. "서비스"라 함은 회사가 제공하는 모든 숙박 예약 및 관련 정보 제공 서비스를 의미합니다.
            <br>2. "회원"이라 함은 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.
          </p>
          
          <h3>제 2장 회원가입</h3>
          <h4>제 3조 (회원가입)</h4>
          <p>1. 회원가입은 서비스를 이용하고자 하는 자가 약관의 내용에 동의를 한 다음 회원가입신청을 하고 회사가 이러한 신청에 대하여 승낙함으로써 완료됩니다.
            <br>2. 회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다.
            <br> - 가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우
            <br> - 허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우
          </p>
        </div>
        <div class="modal-footer">
          <button class="confirm-button" @click="close">확인했습니다</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    }
  });
  
  const emit = defineEmits(['close']);
  
  const close = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
  .modal-content { background: white; padding: 25px; border-radius: 10px; width: 90%; max-width: 600px; max-height: 80vh; display: flex; flex-direction: column; }
  .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px; }
  .modal-header h2 { margin: 0; font-size: 20px; }
  .close-button { background: none; border: none; font-size: 24px; cursor: pointer; }
  .modal-body { overflow-y: auto; font-size: 14px; line-height: 1.6; }
  .modal-body h3 { margin-top: 20px; }
  .modal-body h4 { margin-top: 15px; font-size: 15px; }
  .modal-footer { border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px; text-align: right; }
  .confirm-button { padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
  </style>