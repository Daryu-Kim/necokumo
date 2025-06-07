import {
  collection,
  doc,
  getDoc,
  getDocs,
  or,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import axios from "axios";
import Papa from "papaparse";
import JSZip from "jszip";
import { saveAs } from "file-saver";

async function downloadImage(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  const img = new Image();
  const imgUrl = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imgUrl;
  });
}

function resizeImage(image, width, height) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/png");
}

export async function matchProductByCode(file) {
  try {
    let csvData = [];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        Papa.parse(result, {
          complete: (parsedData) => {
            csvData = parsedData.data;
          },
          header: true,
          skipEmptyLines: true,
        });
      };
      reader.readAsText(file);

      const productSnapshot = await getDocs(collection(db, "product"));
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      for (let item of csvData) {
        const matchingProduct = productList.find(
          (product) => product.productName === item.상품명
        );

        const currentDateTime = Timestamp.fromDate(new Date());

        if (matchingProduct) {
          await updateDoc(doc(db, "product", matchingProduct.id), {
            productCodeCafe24: item.상품코드,
            updatedAt: currentDateTime,
            updatedAtCafe24: currentDateTime,
          });
        }
      }
      return true;
    } else {
      alert("상품 목록 CSV 파일을 업로드하세요!");
      return false;
    }
  } catch (error) {
    console.error(error);
    alert("상품 코드를 매치할 수 없습니다!");
    return false;
  }
}

export async function matchProductOptionsByCode(file) {
  try {
    let csvData = [];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        Papa.parse(result, {
          complete: (parsedData) => {
            csvData = parsedData.data;
          },
          header: true,
          skipEmptyLines: true,
        });
      };
      reader.readAsText(file);

      for (let item of csvData) {
        const productSnapshot = await getDoc(doc(db, "product", item.상품코드));
        const product = productSnapshot.data();

        const currentDateTime = Timestamp.fromDate(new Date());

        const updatedOptionList = product.optionList.map((option) => {
          if (option.optionName === item.품목명) {
            return {
              ...option,
              optionCodeCafe24: item.품목코드,
            };
          }
          return option;
        });

        await updateDoc(doc(db, "product", item.상품코드), {
          optionList: updatedOptionList,
          updatedAt: currentDateTime,
          updatedAtCafe24: currentDateTime,
        });
      }
    } else {
      alert("상퓸 옵션 CSV 파일을 업로드하세요!");
      return false;
    }
  } catch (error) {
    console.error(error);
    alert("상품 옵션 코드를 매치할 수 없습니다!");
    return false;
  }
}

export async function uploadProduct() {
  try {
    console.log("업로드 시작");
    const productSnapshot = await getDocs(
      query(
        collection(db, "product"),
        or(
          where("updatedAtCafe24", "==", "null"),
          where("updatedAtCafe24", "!=", "updatedAt")
        )
      )
    );
    const productList = productSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("업로드할 상품 수", productList.length);
    axios
      .get("/files/excelUploadProductDefault.csv")
      .then((response) => {
        Papa.parse(response.data, {
          complete: async (parsedData) => {
            const csvData = parsedData.data;
            const zip = new JSZip();
            const today = new Date();

            // 연도 (yyyy)
            const year = today.getFullYear();

            // 월 (MM) - 0부터 시작하므로 1을 더해야 함
            const month = (today.getMonth() + 1).toString().padStart(2, "0");

            // 일 (dd)
            const day = today.getDate().toString().padStart(2, "0");

            // yyyyMMdd 형식으로 합치기
            const formattedDate = `${year}${month}${day}`;
            productList.sort((a, b) => {
              return b.createdBy - a.createdBy;
            });
            for (let product of productList) {
              // zip 추가 파트
              const imageSizes = {
                big: { width: 500, height: 500 },
                medium: { width: 300, height: 300 },
                tiny: { width: 100, height: 100 },
                small: { width: 220, height: 220 },
              };

              const img = await downloadImage(
                product.productThumbnailUrl.originalUrl
              );

              for (const [key, size] of Object.entries(imageSizes)) {
                const resizedImage = resizeImage(img, size.width, size.height);
                const imageData = resizedImage.split(",")[1]; // base64 data
                zip.file(
                  `product/${key}/${formattedDate}/${product.productId}.png`,
                  imageData,
                  {
                    base64: true,
                  }
                );
              }

              // csvData 추가 파트
              let detailUrls = "<div>";
              for (let detail of product.productDetailUrl) {
                detailUrls += `<img style="width: 100%;" src="${detail.imageOriginUrl}">`;
              }
              detailUrls += "</div>";
              const newRow = [
                `${product.productCodeCafe24 ? product.productCodeCafe24 : ""}`, // 상품코드
                "", // 자체 상품코드
                `${product.isSellCafe24 ? "Y" : "N"}`, // 진열상태
                `${product.isSellCafe24 ? "Y" : "N"}`, // 판매상태
                `${product.productCategory.join("|")}`, // 상품분류 번호 00|00|00
                `${product.productCategory.map(() => "N").join("|")}`, // 상품분류 신상품영역
                `${product.productCategory.map(() => "N").join("|")}`, // 상품분류 추천상품영역
                `${product.productName}`, // 상품명
                "", // 영문상품명
                "", // 상품명 (관리용)
                "", // 공급사 상품명
                "", // 모델명
                `${product.productSummary}`, // 상품 요약설명
                `${product.productSummary}`, // 상품 간략설명
                detailUrls, // 상품 상세설명
                "M", // 모바일 상품 상세설명 설정
                detailUrls, // 모바일 상품 상세설명
                `${product.productSearchKeyword}`, // 검색어설정
                "A|10", // 과세구분
                "0.00", // 소비자가
                "0.00", // 공급가
                `${Math.ceil((product.productSellPrice / 11) * 10)}`, // 상품가
                `${product.productSellPrice}`, // 판매가
                "N", // 판매가 대체문구 사용
                "", // 판매가 대체문구
                "O", // 주문수량 제한 기준
                "1", // 최소 주문수량 (이상)
                "", // 최대 주문수량 (이하)
                "0.00", // 적립금
                "P", // 적립금 구분
                "Y", // 공통 이벤트 정보
                "N", // 성인인증
                "Y", // 옵션사용
                "T", // 품목 구성방식
                "S", // 옵션 표시방식
                "", // 옵션 세트명
                `옵션1{${product.option1List.join(
                  "|"
                )}}//옵션2{${product.option2List.join("|")}}`, // 옵션입력
                "", // 옵션 스타일
                "", // 버튼이미지 설정
                "", // 색상 설정
                "F|F", // 필수여부
                "", // 품절 표시 문구
                "F", // 추가 입력 옵션
                "", // 추가 입력 옵션 명칭
                "", // 추가 입력 옵션 선택 / 필수여부
                "", // 입력 글자 수 (자)
                `${formattedDate}/${product.productId}.png`, // 이미지등록 (상세)
                `${formattedDate}/${product.productId}.png`, // 이미지등록 (목록)
                `${formattedDate}/${product.productId}.png`, // 이미지등록 (작은목록)
                `${formattedDate}/${product.productId}.png`, // 이미지등록 (축소)
                "", // 이미지등록 (추가)
                "M0000000", // 제조사
                "S0000000", // 공급사
                "B0000000", // 브랜드
                "T0000000", // 트렌드
                "C000000A", // 자체분류 코드
                "", // 제조일자
                "", // 출시일자
                "F", // 유효기간 사용여부
                "", // 유효기간
                "1798", // 원산지
                "", // 상품부피 (cm)
                `고액결제의 경우 안전을 위해 카드사에서 확인전화를 드릴 수도 있습니다. 확인과정에서 도난 카드의 사용이나 타인 명의의 주문등 정상적인 주문이 아니라고 판단될 경우 임의로 주문을 보류 또는 취소할 수 있습니다.  

무통장 입금은 상품 구매 대금은 PC뱅킹, 인터넷뱅킹, 텔레뱅킹 혹은 가까운 은행에서 직접 입금하시면 됩니다.  
주문시 입력한 입금자명과 실제입금자의 성명이 반드시 일치하여야 하며, 7일 이내로 입금을 하셔야 하며 입금되지 않은 주문은 자동취소 됩니다.`, // 상품 결제안내
                `- 산간벽지나 도서지방은 별도의 추가금액을 지불하셔야 하는 경우가 있습니다.
고객님께서 주문하신 상품은 입금 확인후 배송해 드립니다. 다만, 상품종류에 따라서 상품의 배송이 다소 지연될 수 있습니다.`, // 상품 배송안내
                `교환 및 반품 주소
 - #supplier_return_address_info#
 
교환 및 반품이 가능한 경우
 - 계약내용에 관한 서면을 받은 날부터 7일. 단, 그 서면을 받은 때보다 재화등의 공급이 늦게 이루어진 경우에는 재화등을 공급받거나 재화등의 공급이 시작된 날부터 7일 이내
  - 공급받으신 상품 및 용역의 내용이 표시.광고 내용과 다르거나 계약내용과 다르게 이행된 때에는 당해 재화 등을 공급받은 날 부터 3월이내, 그사실을 알게 된 날 또는 알 수 있었던 날부터 30일이내
 
교환 및 반품이 불가능한 경우
 - 이용자에게 책임 있는 사유로 재화 등이 멸실 또는 훼손된 경우(다만, 재화 등의 내용을 확인하기 위하여 포장 등을 훼손한 경우에는 청약철회를 할 수 있습니다)
  - 이용자의 사용 또는 일부 소비에 의하여 재화 등의 가치가 현저히 감소한 경우
  - 시간의 경과에 의하여 재판매가 곤란할 정도로 재화등의 가치가 현저히 감소한 경우
  - 복제가 가능한 재화등의 포장을 훼손한 경우
  - 개별 주문 생산되는 재화 등 청약철회시 판매자에게 회복할 수 없는 피해가 예상되어 소비자의 사전 동의를 얻은 경우
  - 디지털 콘텐츠의 제공이 개시된 경우, (다만, 가분적 용역 또는 가분적 디지털콘텐츠로 구성된 계약의 경우 제공이 개시되지 아니한 부분은 청약철회를 할 수 있습니다.)
 
※ 고객님의 마음이 바뀌어 교환, 반품을 하실 경우 상품반송 비용은 고객님께서 부담하셔야 합니다.
 (색상 교환, 사이즈 교환 등 포함)`, // 교환 / 반품안내
                "", // 서비스 문의 / 안내
                "F", // 배송정보
                "", // 배송방법
                "", // 국내 / 해외배송
                "", // 배송지역
                "", // 배송비 선결제 설정
                "3|7", // 배송기간
                "", // 배송비 구분
                "", // 배송비입력
                "", // 스토어픽업 설정
                "", // 상품 전체 중량(kg)
                "", // HS코드
                "", // 상품구분 (해외통관)
                "", // 상품소재
                "", // 영문 상품소재 (해외통관)
                "", // 옷감 (해외통관)
                "Y", // SEO 노출설정
                `${product.productName} - 네코쿠모`, // SEO 제목
                "네코쿠모", // SEO 제작자
                `${product.productSummary}`, // SEO 설명
                `${product.productSearchKeyword}`, // SEO 키워드
                "", // SEO ALT
                "", // 개별 결제수단 설정
                "C", // 상품 배송유형 코드
                "", // 메모
              ];
              csvData.push(newRow);
            }

            const csvContent = Papa.unparse(csvData); // 수정된 데이터를 CSV로 변환
            zip.file("cafe24_upload.csv", csvContent);

            zip.generateAsync({ type: "blob" }).then(function (content) {
              saveAs(content, "cafe24_upload_files.zip"); // Zip 파일 다운로드
            });

            return true;
          },
          header: false,
          skipEmptyLines: true,
        });
      })
      .catch((error) => {
        console.error(error);
        alert("상품 등록에 실패했습니다!");
        return false;
      });
  } catch (error) {
    console.error(error);
    alert("상품 등록에 실패했습니다!");
    return false;
  }
}
