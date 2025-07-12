<template>
  <div class="consumer-mypage-edit" v-if="userData">
    <h2>회원 정보 수정</h2>
    <div class="edit-container">
      <div class="title-container">
        <strong>기본정보</strong>
        <p><span>*</span> 필수 입력사항</p>
      </div>
      <div class="input-container">
        <div>
          <p><span>*</span>아이디</p>
          <div>
            <input type="text" v-model="userData.userId" disabled />
            <p>(영문 소문자 / 숫자, 4 ~ 16자)</p>
          </div>
        </div>
        <div>
          <p><span>*</span>이메일</p>
          <div>
            <input type="text" v-model="userData.userEmail" disabled />
          </div>
        </div>
        <div>
          <p><span>*</span>이름</p>
          <div>
            <input type="text" v-model="userData.userName" disabled />
          </div>
        </div>
        <div>
          <p><span>*</span>주소</p>
          <div>
            <div class="address-container">
              <button @click="openAddressPopup()">주소 검색하기</button>
              <input type="text" v-model="userData.userPostCode" disabled />
              <input type="text" v-model="userData.userAddress1" disabled />
              <input
                type="text"
                v-model="userData.userAddress2"
                placeholder="상세 주소를 입력하세요 (예: 아파트, 동/호수 등)"
              />
            </div>
          </div>
        </div>
        <div>
          <p><span>*</span>휴대전화</p>
          <div>
            <input
              type="text"
              v-model="userData.userPhone"
              @input="
                (e) =>
                  (userData.userPhone = e.target.value
                    .replace(/[^0-9]/g, '')
                    .slice(0, 11))
              "
            />
            <p>(숫자만, "-" 없이 10 ~ 11자)</p>
          </div>
        </div>
      </div>
    </div>
    <div class="edit-container">
      <div class="title-container">
        <strong>추가정보</strong>
        <p><span>*</span> 필수 입력사항</p>
      </div>
      <div class="input-container">
        <div>
          <p><span>*</span>성별</p>
          <div>
            <div class="radio-container">
              <div>
                <input
                  type="radio"
                  v-model="userData.userGender"
                  value="남"
                  disabled
                  id="male"
                />
                <label for="male">남자</label>
              </div>
              <div>
                <input
                  type="radio"
                  v-model="userData.userGender"
                  value="여"
                  disabled
                  id="female"
                />
                <label for="female">여자</label>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p><span>*</span>생년월일</p>
          <div>
            <div class="birthday-container">
              <input type="date" v-model="userData.userBirthday" disabled />
            </div>
          </div>
        </div>
        <div>
          <p><span>*</span>이용중인 통신사</p>
          <div>
            <div class="radio-container">
              <div>
                <input
                  type="radio"
                  v-model="userData.userCarrier"
                  value="SKT"
                  id="SKT"
                />
                <label for="SKT">SKT</label>
              </div>
              <div>
                <input
                  type="radio"
                  v-model="userData.userCarrier"
                  value="KT"
                  id="KT"
                />
                <label for="KT">KT</label>
              </div>
              <div>
                <input
                  type="radio"
                  v-model="userData.userCarrier"
                  value="LG U+"
                  id="LGU"
                />
                <label for="LGU">LG U+</label>
              </div>
              <div>
                <input
                  type="radio"
                  v-model="userData.userCarrier"
                  value="SKT 알뜰폰"
                  id="SKT2"
                />
                <label for="SKT2">SKT 알뜰폰</label>
              </div>
              <div>
                <input
                  type="radio"
                  v-model="userData.userCarrier"
                  value="KT 알뜰폰"
                  id="KT2"
                />
                <label for="KT2">KT 알뜰폰</label>
              </div>
              <div>
                <input
                  type="radio"
                  v-model="userData.userCarrier"
                  value="LG U+ 알뜰폰"
                  id="LGU2"
                />
                <label for="LGU2">LG U+ 알뜰폰</label>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p><span>*</span>환불계좌</p>
          <div>
            <div class="refund-container">
              <select v-model="userRefundAccount[0]">
                <option value="">선택</option>
                <option
                  v-for="(item, index) in bankNames"
                  :key="index"
                  :value="item"
                >
                  {{ item }}
                </option>
              </select>
              <input
                type="text"
                placeholder="계좌번호 입력"
                v-model="userRefundAccount[1]"
                @input="
                  (e) =>
                    (userRefundAccount[1] = e.target.value.replace(
                      /[^0-9]/g,
                      ''
                    ))
                "
              />
              <input
                type="text"
                placeholder="예금주명"
                v-model="userRefundAccount[2]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="button-container">
      <button class="outlined" @click="goBack">취소</button>
      <button class="primary" @click="updateUserData">변경내용 저장</button>
    </div>
  </div>
</template>

<script setup lang="js">
import { onMounted, ref, nextTick } from 'vue';
import { db, auth } from "@/lib/firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import router from '@/router';

const userData = ref(null);
const userBirthday = ref([]);
const userRefundAccount = ref([]);
const bankNames = [
  "경남은행",
  "광주은행",
  "단위농협(지역농축협)",
  "부산은행",
  "새마을금고",
  "산림조합",
  "신한은행",
  "신협",
  "씨티은행",
  "우리은행",
  "우체국예금보험",
  "저축은행중앙회",
  "전북은행",
  "제주은행",
  "카카오뱅크",
  "케이뱅크",
  "토스뱅크",
  "하나은행",
  "홍콩상하이은행",
  "IBK기업은행",
  "KB국민은행",
  "iM뱅크(대구)",
  "한국산업은행",
  "NH농협은행",
  "SC제일은행",
  "Sh수협은행",
  "교보증권",
  "대신증권",
  "메리츠증권",
  "미래에셋증권",
  "부국증권",
  "삼성증권",
  "신영증권",
  "신한금융투자",
  "유안타증권",
  "유진투자증권",
  "카카오페이증권",
  "키움증권",
  "토스머니",
  "토스증권",
  "펀드온라인코리아(한국포스증권)",
  "하나금융투자",
  "아이엠증권",
  "한국투자증권",
  "한화투자증권",
  "현대차증권",
  "DB금융투자",
  "KB증권",
  "KTB투자증권(다올투자증권)",
  "LIG투자증권",
  "NH투자증권",
  "SK증권"
];

async function updateUserData() {
  try {
    if (userData.value.userPhone === "") {
      alert("전화번호를 입력해주세요.");
      return;
    }
    if (userRefundAccount.value[0] === "" || userRefundAccount.value[1] === "" || userRefundAccount.value[2] === "") {
      alert("환불 계좌를 등록해주세요.");
      return;
    }
    const userRef = doc(db, "users", auth.currentUser.uid);
    userData.value.userRefundAccount = [
      userRefundAccount.value[0],                              // 은행명
      userRefundAccount.value[1].replace(/-/g, ''),            // 계좌번호에서 '-' 제거
      userRefundAccount.value[2]                               // 예금주명
    ].join('/');
    await updateDoc(userRef, userData.value);

    alert("변경내용이 저장되었습니다!");
    router.replace("/mypage");
  } catch (error) {
    console.error("Error updating user data: ", error);
  }
}

function goBack() {
  router.back();
}

async function openAddressPopup() {
  new window.daum.Postcode({
    oncomplete: function(data) {
      let fullAddress = data.address;     // 도로명 or 지번 주소
      let extraAddress = '';              // 건물명, 법정동 등
      let defaultDetail = '';             // address2에 넣을 기본값

      // 도로명 주소일 경우 부가정보 조합
      if (data.addressType === 'R') {
        if (data.bname) extraAddress += data.bname;
        if (data.buildingName) {
          extraAddress += (extraAddress ? ', ' : '') + data.buildingName;
        }
      }

      if (extraAddress) {
        defaultDetail = `(${extraAddress})`;     // 예: "역삼동, 삼성빌딩"
      }

      // Vue 데이터에 반영
      userData.value.userPostCode = data.zonecode;
      userData.value.userAddress1 = fullAddress;
      userData.value.userAddress2 = defaultDetail; // 여기에 자동 기본값 입력!

      // 상세 주소 input 포커싱
      nextTick(() => {
        document.getElementById("address2")?.focus();
      });
    }
  }).open();
}

async function fetchUserData() {
  try {
    const user = await getDoc(doc(db, 'users', auth.currentUser.uid));
    userData.value = user.data();
    userBirthday.value = userData.value.userBirthday.split('-');
    userRefundAccount.value = userData.value.userRefundAccount.split('/');
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
}

onMounted(async () => {
    try {
      await fetchUserData();
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
});
</script>

<style lang="scss" scoped>
.consumer-mypage-edit {
  padding: 16px 24px;

  > h2 {
    text-align: center;
  }

  > .edit-container {
    margin-top: 24px;
    > .title-container {
      display: flex;
      align-items: center;
      justify-content: space-between;

      > p {
        font-size: 14px;
        > span {
          font-weight: 700;
          color: #007bff;
          margin-right: 4px;
        }
      }
    }

    > .input-container {
      border-top: 2px solid black;
      margin-top: 16px;
      > div {
        display: flex;
        align-items: stretch;
        &:not(:first-child) {
          border-top: 1px solid #ccc;
        }
        > p {
          padding: 12px 16px;
          min-width: 92px;
          max-width: 92px;
          font-size: 14px;
          background: #efefef;
          display: flex;
          align-items: center;
          > span {
            font-weight: 700;
            color: #007bff;
            margin-right: 4px;
          }
        }

        > div {
          flex: 1;
          padding: 12px 16px;

          > input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #999;
            border-radius: 4px;
            box-sizing: border-box;
            outline: none;
            font-size: 14px;
          }

          > p {
            margin-top: 8px;
            font-size: 14px;
            color: #666;
          }

          > .radio-container {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
            > div {
              display: flex;
              align-items: center;
              gap: 4px;
              > input {
                width: 16px;
                height: 16px;
              }

              > label {
                font-size: 14px;
              }
            }
          }

          > .birthday-container {
            > div {
              display: flex;
              align-items: center;

              &:not(:first-child) {
                margin-top: 8px;
              }
            }

            input {
              width: 100%;
              padding: 8px 12px;
              border: 1px solid #999;
              border-radius: 4px;
              box-sizing: border-box;
              outline: none;
              font-size: 14px;
            }

            span {
              margin-left: 8px;
            }
          }

          > .refund-container {
            > input,
            select {
              width: 100%;
              padding: 8px 12px;
              border: 1px solid #999;
              border-radius: 4px;
              box-sizing: border-box;
              outline: none;
              font-size: 14px;

              &:not(:first-child) {
                margin-top: 8px;
              }
            }
          }

          > .address-container {
            width: 100%;
            > * {
              &:not(:first-child) {
                margin-top: 8px;
              }
            }

            > button {
              font-size: 14px;
              border: 1px solid #999;
              border-radius: 4px;
              cursor: pointer;
              height: 36px;
              padding: 8px 0;
              width: 100%;
              font-weight: 700;
              color: white;
              background: black;
            }

            > input {
              padding: 8px 12px;
              border: 1px solid #999;
              border-radius: 4px;
              box-sizing: border-box;
              outline: none;
              font-size: 14px;
              width: 100%;
            }
          }
        }
      }
    }
  }

  > .button-container {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 48px;

    > button {
      flex: 1;
      font-size: 16px;
      cursor: pointer;
      height: 48px;
      border-radius: 4px;

      &.outlined {
        background: none;
        border: 1px solid #999;
      }

      &.primary {
        background: black;
        color: white;
        font-weight: 700;
        border: none;
      }
    }
  }
}
</style>
