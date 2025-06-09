import {
  collection,
  doc,
  getDocs,
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

async function parseCSVFromUrl(url) {
  const response = await axios.get(url);
  return new Promise((resolve, reject) => {
    Papa.parse(response.data, {
      header: false,
      skipEmptyLines: true,
      complete: (parsed) => resolve(parsed.data),
      error: (err) => reject(err),
    });
  });
}

async function downloadImage(url) {
  const response = await axios.get(url, { responseType: "blob" });
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(response.data);
  });
}

function resizeImage(base64, width, height) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // CORS 문제 방지
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      const resizedBase64 = canvas.toDataURL("image/png");
      resolve(resizedBase64);
    };
    img.onerror = reject;
    img.src = base64;
  });
}

function parseCSVFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      Papa.parse(reader.result, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: (err) => reject(err),
      });
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export async function matchProductByCode(file) {
  try {
    if (!file) {
      alert("상품 목록 CSV 파일을 업로드하세요!");
      return false;
    }

    // 👉 1. CSV 파싱을 기다림
    const csvData = await parseCSVFile(file);

    // 👉 2. 전체 상품을 미리 가져옴
    const productSnapshot = await getDocs(collection(db, "product"));
    const productList = productSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("✅ 상품 목록 불러옴");

    // 👉 3. 매칭 및 업데이트
    for (let item of csvData) {
      console.log("🔍 상품 매칭 시작:", item);

      const matchingProduct =
        productList.find(
          (product) => product.productCodeCafe24 === item.상품코드
        ) || productList.find((product) => product.productName === item.상품명);

      if (matchingProduct) {
        const currentDateTime = Timestamp.fromDate(new Date());

        await updateDoc(doc(db, "product", matchingProduct.id), {
          productCodeCafe24: item.상품코드,
          updatedAt: currentDateTime,
          updatedAtCafe24: currentDateTime,
        });

        console.log(`✔️ 상품 업데이트 완료: ${item.상품명} → ${item.상품코드}`);
      } else {
        console.warn(`❌ 매칭 실패: ${item.상품명}`);
      }
    }

    return true;
  } catch (error) {
    console.error("❌ 상품 코드 매칭 오류:", error);
    alert("상품 코드를 매치할 수 없습니다!");
    return false;
  }
}

export async function matchProductOptionsByCode(file) {
  try {
    if (!file) {
      alert("상품 옵션 CSV 파일을 업로드하세요!");
      return false;
    }

    // 👉 1. 파일 파싱을 Promise로 처리
    const csvData = await parseCSVFile(file);

    // 👉 2. 각 아이템에 대해 Firebase 업데이트
    for (let item of csvData) {
      console.log("상품 옵션 매칭 시작: ", item);

      const productSnapshot = await getDocs(
        query(
          collection(db, "product"),
          where("productCodeCafe24", "==", item.상품코드)
        )
      );

      const productDocs = productSnapshot.docs;
      if (productDocs.length === 0) {
        console.warn(
          `상품코드 ${item.상품코드}에 해당하는 문서를 찾을 수 없습니다.`
        );
        continue;
      }

      const product = productDocs[0];
      const productData = product.data();

      const currentDateTime = Timestamp.fromDate(new Date());

      const updatedOptionList = productData.optionList.map((option) => {
        if (option.optionName === item.품목명) {
          return {
            ...option,
            optionCodeCafe24: item.품목코드,
          };
        }
        return option;
      });

      await updateDoc(product.ref, {
        optionList: updatedOptionList,
        updatedAt: currentDateTime,
        updatedAtCafe24: currentDateTime,
      });

      console.log(`✔️ 상품 업데이트 완료: ${item.상품코드} / ${item.품목명}`);
    }

    return true;
  } catch (error) {
    console.error("❌ 상품 옵션 매칭 중 오류:", error);
    alert("상품 옵션 코드를 매치할 수 없습니다!");
    return false;
  }
}

export async function uploadProduct() {
  try {
    console.log("📦 업로드 시작");

    // 1. 상품 전체 로드 및 JS에서 조건 필터링
    const productSnapshot = await getDocs(
      query(
        collection(db, "product"),
        where("isActive", "==", true),
        where("isSellCafe24", "==", true)
      )
    );

    let productList = productSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (p) =>
          !p.updatedAtCafe24 ||
          p.updatedAtCafe24.toMillis?.() !== p.updatedAt?.toMillis?.()
      );

    console.log("✅ 업로드 대상 상품 수:", productList.length);

    if (productList.length === 0) {
      alert("업로드할 상품이 없습니다.");
      return false;
    }

    // 2. CSV 템플릿 불러오기
    const csvData = await parseCSVFromUrl(
      "/files/excelUploadProductDefault.csv"
    );

    // 3. 날짜 포맷 준비
    const today = new Date();
    const formattedDate = `${today.getFullYear()}${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}`;

    const zip = new JSZip();

    // 4. 병렬로 이미지 및 CSV 처리
    await Promise.all(
      productList
        .sort((a, b) => a.createdAt.toDate() - b.createdAt.toDate())
        .map(async (product) => {
          console.log("🚚 상품 처리 중:", product.productName);

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
            const resizedImage = await resizeImage(
              img,
              size.width,
              size.height
            ); // 구현 필요
            const imageData = resizedImage.split(",")[1];
            zip.file(
              `product/${key}/${formattedDate}/${product.productId}.png`,
              imageData,
              { base64: true }
            );
          }

          // 상세 이미지 HTML 생성
          let detailUrls = "<div>";
          for (let detail of product.productDetailUrl || []) {
            detailUrls += `<img style="width: 100%;" src="${detail.imageOriginUrl}">`;
          }
          detailUrls += "</div>";

          // CSV 행 구성
          const newRow = [
            `${product.productCodeCafe24 || ""}`,
            "",
            `${product.isSellCafe24 ? "Y" : "N"}`,
            `${product.isSellCafe24 ? "Y" : "N"}`,
            `${product.productCategory?.join("|") || ""}`,
            `${product.productCategory?.map(() => "N").join("|") || ""}`,
            `${product.productCategory?.map(() => "N").join("|") || ""}`,
            `${product.productName}`,
            "",
            "",
            "",
            "",
            "",
            "",
            detailUrls,
            "M",
            detailUrls,
            "",
            "A|10",
            "0.00",
            "0.00",
            `${Math.ceil((product.productSellPrice / 11) * 10)}`,
            `${product.productSellPrice}`,
            "N",
            "",
            "O",
            "1",
            "",
            "0.00",
            "P",
            "Y",
            "N",
            "Y",
            "T",
            "S",
            "",
            `옵션1{${product.option1List?.join("|") || ""}}//옵션2{${
              product.option2List?.join("|") || ""
            }}`,
            "",
            "",
            "",
            "F|F",
            "",
            "F",
            "",
            "",
            "",
            `${formattedDate}/${product.productId}.png`,
            `${formattedDate}/${product.productId}.png`,
            `${formattedDate}/${product.productId}.png`,
            `${formattedDate}/${product.productId}.png`,
            "",
            "M0000000",
            "S0000000",
            "B0000000",
            "T0000000",
            "C000000A",
            "",
            "",
            "F",
            "",
            "1798",
            "",
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
            "",
            "F",
            "",
            "",
            "",
            "",
            "3|7",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "Y",
            `${product.productName} - 네코쿠모`,
            "네코쿠모",
            `${product.productSummary}`,
            `${product.productSearchKeyword}`,
            "",
            "",
            "C",
            "",
          ];

          csvData.push(newRow);
        })
    );

    // 5. CSV 만들고 Zip으로 묶기
    const csvContent = Papa.unparse(csvData);
    zip.file("cafe24_upload.csv", csvContent);

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "cafe24_upload_files.zip");

    console.log("✅ ZIP 파일 생성 완료");
    return true;
  } catch (error) {
    console.error("❌ 상품 업로드 오류:", error);
    alert("상품 등록에 실패했습니다!");
    return false;
  }
}
