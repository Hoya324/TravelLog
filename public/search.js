// 마커를 담을 배열
let markers = [];

// 임시 place 객체
let temporaryPlace;

// 지도를 표시할 div와 지도의 옵션 설정
const mapContainer = document.getElementById("map");
const mapOption = {
  center: new kakao.maps.LatLng(37.566826, 126.9786567),
  level: 3,
};

// 지도 생성
const map = new kakao.maps.Map(mapContainer, mapOption);

// 장소 검색 객체 생성
const ps = new kakao.maps.services.Places();

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우 생성
const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

// 키워드로 장소를 검색
searchPlaces();

// 키워드 검색을 요청하는 함수
function searchPlaces() {
  const keyword = document.getElementById("keyword").value.trim();

  if (!keyword) {
    alert("키워드를 입력해주세요!");
    return;
  }

  // 장소검색 객체를 통해 키워드로 장소검색을 요청
  ps.keywordSearch(keyword, placesSearchCB);
}

// 장소검색이 완료됐을 때 호출되는 콜백 함수
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    displayPlaces(data);
    displayPagination(pagination);
  } else {
    const errorMessage = status === kakao.maps.services.Status.ZERO_RESULT
      ? "검색 결과가 존재하지 않습니다."
      : "검색 결과 중 오류가 발생했습니다.";
    alert(errorMessage);
  }
}

// 검색 결과 목록과 마커를 표출하는 함수
function displayPlaces(places) {
  const listEl = document.getElementById("placesList");
  const menuEl = document.getElementById("menu_wrap");
  const fragment = document.createDocumentFragment();
  const bounds = new kakao.maps.LatLngBounds();

  removeAllChildNodes(listEl);
  removeMarkers();

  places.forEach((place, index) => {
    const placePosition = new kakao.maps.LatLng(place.y, place.x);
    const marker = addMarker(placePosition, index);
    const itemEl = createListItem(index, place);

    itemEl.addEventListener("click", () => onItemClick(place));

    bounds.extend(placePosition);

    (function (marker, title) {
      kakao.maps.event.addListener(marker, "mouseover", () => displayInfowindow(marker, title));
      kakao.maps.event.addListener(marker, "mouseout", () => infowindow.close());
      itemEl.onmouseover = () => displayInfowindow(marker, title);
      itemEl.onmouseout = () => infowindow.close();
    })(marker, place.place_name);

    fragment.appendChild(itemEl);
  });

  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;
  map.setBounds(bounds);
}

// 검색 결과 항목을 생성하는 함수
function createListItem(index, place) {
  const el = document.createElement("li");
  const address = place.road_address_name || place.address_name;

  el.innerHTML = `
    <span class="markerbg marker_${index + 1}"></span>
    <div class="info">
      <h5>${place.place_name}</h5>
      <span>${address}</span>
      <span class="tel">${place.phone}</span>
    </div>
  `;
  el.className = "item";

  return el;
}

// 검색 결과 클릭 시 여행지 이름과 주소를 표시하는 함수
function onItemClick(place) {
  temporaryPlace = place;
  document.getElementById("result_text").innerText = `${place.place_name}, ${place.road_address_name}`;
}

// 여행지 정보를 post 요청으로 보내는 함수
function sendPlaceInfo() {
  const { place_name: name, road_address_name: address, phone } = temporaryPlace;

  axios.post("/user/list", { name, address, phone })
    .then(() => {
      location.href = "/search";
    })
    .catch(console.error);
}

// 마커를 생성하고 지도 위에 표시하는 함수
function addMarker(position, idx) {
  const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";
  const imageSize = new kakao.maps.Size(36, 37);
  const imgOptions = {
    spriteSize: new kakao.maps.Size(36, 691),
    spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10),
    offset: new kakao.maps.Point(13, 37),
  };
  const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
  const marker = new kakao.maps.Marker({ position, image: markerImage });

  marker.setMap(map);
  markers.push(marker);

  return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거하는 함수
function removeMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}

// 검색결과 목록 하단에 페이지 번호를 표시하는 함수
function displayPagination(pagination) {
  const paginationEl = document.getElementById("pagination");
  const fragment = document.createDocumentFragment();

  removeAllChildNodes(paginationEl);

  for (let i = 1; i <= pagination.last; i++) {
    const el = document.createElement("a");
    el.href = "#";
    el.innerText = i;

    if (i === pagination.current) {
      el.className = "on";
    } else {
      el.onclick = () => pagination.gotoPage(i);
    }

    fragment.appendChild(el);
  }
  paginationEl.appendChild(fragment);
}

// 검색결과 목록의 자식 Element를 제거하는 함수
function removeAllChildNodes(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}

// 검색결과 목록이나 마커를 클릭했을 때 인포윈도우에 장소명을 표시하는 함수
function displayInfowindow(marker, title) {
  infowindow.setContent(`<div style="padding:5px;z-index:1;">${title}</div>`);
  infowindow.open(map, marker);
}
