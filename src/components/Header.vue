<template>
  <header>
    <div class="navbar">
      <div class="logo">
        <span class="logo-text">Booking</span> <!-- 영어로 "Book"으로 변경 -->
      </div>

      <nav class="menu">
        <ul>
          <li><router-link to="/" class="menu-link">숙소</router-link></li>
          <li><router-link to="/activities" class="menu-link">즐길거리</router-link></li>
          <li><router-link to="/travel-guide" class="menu-link">여행 가이드</router-link></li>
        </ul>
      </nav>

      <div class="user-actions">
        <router-link to="/register-accommodation"><button class="register">숙소 등록</button></router-link>
        <router-link to="/login"><button class="login">로그인</button></router-link>
        <router-link to="/signup"><button class="signup">회원 가입</button></router-link>

        <!-- Font Awesome 장바구니 아이콘 -->
        <router-link to="/cart">
          <i class="fa-solid fa-cart-shopping cart-icon"></i> <!-- 장바구니 아이콘 -->
        </router-link>

        <!-- Font Awesome 메뉴 아이콘 (마이페이지) -->
        <router-link to="/my-page">
          <i class="fa-solid fa-bars my-page-icon"></i> <!-- 메뉴 아이콘 (마이페이지) -->
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
}

/* 로고 텍스트 스타일 */
.logo .logo-text {
  font-size: 32px; /* 글자 크기 */
  font-weight: bold; /* 글자 두께 */
  color: #007bff; /* 글자 색상 */
  letter-spacing: 2px; /* 글자 간격 */
  text-transform: uppercase; /* 대문자 변환 */
  font-family: 'Arial', sans-serif; /* 폰트 패밀리 */
}

.menu ul {
  display: flex;
  list-style-type: none;
  gap: 20px;
}

.menu li a {
  text-decoration: none;
  font-size: 18px; /* 메뉴 글자 크기 */
  color: #333;
  font-weight: bold; /* 메뉴 글자 두께 */
  transition: color 0.3s ease;
}

.menu li a:hover {
  color: #007bff; /* 호버 색상 변경 */
}

/* 버튼 공통 스타일 */
.user-actions button {
  padding: 10px 20px; /* 버튼 크기 */
  margin: 0 5px;
  cursor: pointer;
  font-size: 16px; /* 글자 크기 */
  transition: background-color 0.3s ease;
  border-radius: 25px !important; /* 타원형 보더 */
}

.user-actions button:hover {
  background-color: #f4f4f4 !important;
}

/* 숙소 등록과 회원 가입 버튼 */
.user-actions .register,
.user-actions .signup {
  border: 1px solid #007bff !important; /* 파란색 테두리 */
  color: #007bff !important; /* 파란색 폰트 */
  background-color: transparent !important;
}

.user-actions .register:hover,
.user-actions .signup:hover {
  background-color: #007bff !important;
  color: white !important; /* 호버 시 텍스트 색상 변경 */
}

/* 로그인 버튼 */
.user-actions .login {
  border: none !important; /* 보더 제거 */
  background-color: transparent !important;
  color: #333 !important;
}

.user-actions .login:hover {
  background-color: #f4f4f4 !important;
}

/* Font Awesome 장바구니 아이콘 */
.user-actions .cart-icon {
  font-size: 24px;
  color: #ffbc00 !important; /* 장바구니 아이콘 색상 */
  cursor: pointer;
}

.user-actions .cart-icon:hover {
  opacity: 0.8;
}

/* Font Awesome 메뉴 아이콘 (마이페이지) */
.user-actions .my-page-icon {
  font-size: 24px;
  color: #007bff !important; /* 메뉴 아이콘 색상 */
  cursor: pointer;
}

.user-actions .my-page-icon:hover {
  opacity: 0.8;
}

.user-actions button:focus {
  outline: none;
}
</style>