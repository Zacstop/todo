import React from "react";
import optionIcon from '../assets/images/icons/option.png';

// 유저별 저장
// todo style완료
// 순서 변경
// 컬렉션 여러개 띄우기

export default function Header() {
  return (
    <div style={{width: "100%", height: 50, display: "flex", alignItems: "center", justifyContent: "space-around"}}>
      <div style={{fontSize: 20, fontWeight: 900}}>how todo list</div>
      <button>
        <img src={optionIcon} alt="modi" style={{width: "auto", height: 20}}/>
      </button>
    </div>
  );
}
