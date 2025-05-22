<template>
  <div class="admin-product-add">
    <h2>상품 등록하기</h2>
    <div class="add-box">
      <h3>기본 정보</h3>
      <div>
        <h4>상품명</h4>
        <input
          type="text"
          v-model="productName"
          placeholder="예시) 긱베이프 피크 입호흡 전자담배 기기"
        />
      </div>
      <div>
        <h4>상품 요약설명</h4>
        <input
          type="text"
          v-model="productName"
          placeholder="예시) 발라리안을 잡으려고 긱베이프가 작정했다!"
        />
      </div>
      <div>
        <h4>상품 상세설명</h4>
        <textarea
          type="text"
          v-model="productName"
          rows="10"
          placeholder="예시) <img src='https://picsum.photos/600' style='width: 100%;' />"
        ></textarea>
      </div>
    </div>
    <div class="add-box">
      <h3>판매 정보</h3>
      <div>
        <h4>판매가</h4>
        <input type="number" v-model="productName" placeholder="예시) 19,800" />
        <span>원</span>
      </div>
      <div>
        <h4>매입가</h4>
        <input type="number" v-model="productName" placeholder="예시) 9,900" />
        <span>원</span>
      </div>
      <div>
        <h4>매입 운송비</h4>
        <input type="number" v-model="productName" placeholder="예시) 3,000" />
        <span>원</span>
      </div>
    </div>
    <div class="category-box">
      <h3>카테고리 설정</h3>
      <div>
        <div>
          <h4>대분류</h4>
          <input
            type="number"
            v-model="productName"
            placeholder="예시) 19,800"
          />
          <span>원</span>
        </div>
        <div>
          <h4>중분류</h4>
          <input
            type="number"
            v-model="productName"
            placeholder="예시) 9,900"
          />
          <span>원</span>
        </div>
        <div>
          <h4>소분류</h4>
          <input
            type="number"
            v-model="productName"
            placeholder="예시) 3,000"
          />
          <span>원</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.admin-product-add {
  margin-top: 36px;

  > .add-box {
    margin-top: 24px;
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding: 24px;

    > div {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;

      > h4 {
        width: 160px;
        border-right: 1px solid rgba(0, 0, 0, 0.25);
      }

      > input,
      textarea {
        flex: 1;
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        margin-left: 8px;
        background-color: #efefef;
        font-size: 14px;
        ::placeholder {
          color: rgba(0, 0, 0, 0.6);
        }
        &:focus {
          outline: 2px solid #007bff;
        }
      }

      > span {
        font-size: 14px;
      }
    }
  }

  > .category-box {
    margin-top: 24px;
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding: 24px;
    > div {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      margin-top: 16px;
    }
  }
}
</style>
