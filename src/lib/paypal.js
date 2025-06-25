export async function fetchExchangeRate() {
  try {
    const res = await fetch(
      "https://m.search.naver.com/p/csearch/content/qapirender.nhn?key=calculator&pkid=141&q=%ED%99%98%EC%9C%A8&where=m&u1=keb&u6=standardUnit&u7=0&u3=USD&u4=KRW&u8=down&u2=1"
    );
    const data = await res.json();
    if (data && data.country) {
      return parseFloat(data.country[1].value.replaceAll(",", ""));
    } else {
      return 0;
    }
  } catch (e) {
    console.error("환율 조회 실패", e);
  }
}
