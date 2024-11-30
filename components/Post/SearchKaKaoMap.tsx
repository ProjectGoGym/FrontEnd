'use client';

import React, { useState } from 'react';
import {
  Map,
  MapMarker,
  useKakaoLoader,
  CustomOverlayMap,
} from 'react-kakao-maps-sdk';

export default function SearchKakaoMap({
  onClick,
}: {
  onClick: (
    latitude: number,
    longitude: number,
    gymKaKaoUrl: string,
    gymName: string
  ) => void;
}) {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_API_KEY!,
    libraries: ['services'],
  });

  const [keyword, setKeyword] = useState(''); // 검색 키워드
  const [places, setPlaces] = useState<any[]>([]); // 검색 결과를 저장할 상태
  const [mapCenter, setMapCenter] = useState({
    lat: 37.566535,
    lng: 126.9779692,
  }); // 지도 중심

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!window.kakao.maps.services) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data: any[], status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setTimeout(() => {
          setPlaces(data); // 검색 결과를 상태로 설정
          if (data.length > 0) {
            setMapCenter({
              lat: parseFloat(data[0].y),
              lng: parseFloat(data[0].x),
            }); // 첫 번째 검색 결과로 중심 이동
          }
        }, 0);
      }
    });
  };

  const handleClickList = (lat: number, lng: number) => {
    setMapCenter({
      lat,
      lng,
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) {
    console.error(error);
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col gap-4 justify-center items-center bg-slate-400 bg-opacity-30">
      {/* 검색 UI */}
      <form
        onSubmit={handleSearch}
        className="mb-4 flex gap-2 translate-y-[-128px]"
      >
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="px-4 py-2 w-72 rounded-lg focus:outline-blue-300"
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          검색
        </button>
      </form>

      {/* 지도 */}
      <div className=" flex justify-center w-[70%] h-[60%] translate-y-[-128px]">
        <Map
          center={mapCenter}
          style={{ width: '100%', height: '100%' }}
          level={3}
        >
          {/* 검색 결과에 따라 마커를 지도에 표시 */}
          {places.map((place, index) => (
            <MapMarker
              key={index}
              position={{ lat: parseFloat(place.y), lng: parseFloat(place.x) }}
              clickable={true}
            >
              <CustomOverlayMap
                position={{
                  lat: parseFloat(place.y),
                  lng: parseFloat(place.x),
                }}
              >
                <div className=" bg-white border p-2 border-blue-300 rounded text-gray-600 font-bold translate-y-[-64px]">
                  {place.place_name}
                </div>
              </CustomOverlayMap>
            </MapMarker>
          ))}
        </Map>

        {/* 검색 결과 목록 */}
        {places.length ? (
          <ul className=" bg-white w-[30%] max-w-md h-[100%] overflow-y-auto">
            {places.map((place, index) => (
              <li
                key={index}
                onClick={() =>
                  handleClickList(parseFloat(place.y), parseFloat(place.x))
                }
                className="mb-4 p-4 border-b cursor-pointer"
              >
                <strong className="block">{place.place_name}</strong>
                <p className="text-sm">
                  {place.road_address_name || place.address_name}
                </p>
                <a
                  href={`https://map.kakao.com/link/to/${place.place_name},${place.y},${place.x}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  길찾기
                </a>
                <button
                  className=" ml-4 mr-4 p-1 pl-2 pr-2 rounded-xl bg-blue-300 text-white font-bold text-sm hover:bg-blue-500 transition-all"
                  onClick={() =>
                    onClick(
                      parseFloat(place.y),
                      parseFloat(place.x),
                      `https://map.kakao.com/link/to/${place.place_name},${place.y},${place.x}`,
                      place.place_name
                    )
                  }
                >
                  선택
                </button>
              </li>
            ))}
          </ul>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
