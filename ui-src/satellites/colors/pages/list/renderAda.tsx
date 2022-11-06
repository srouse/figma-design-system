import React from "react";
import {
  colorContrastAda,
  DTColor,
  getIcon,
  Icons,
} from "../../../../../shared";

export default function renderAda(color: DTColor, id: string) {
  const ada = colorContrastAda(color);
  if (!ada) return null;

  const results = [];

  if (ada.white.aaaSmallText) {
    results.push(getIcon(Icons.adaWhiteaaa));
  }else if (ada.white.aaSmallText) {
    results.push(getIcon(Icons.adaWhiteaa));
  }else if (ada.white.aaLargeText) {
    results.push(getIcon(Icons.adaWhiteAA));
  }

  if (ada.black.aaaSmallText) {
    results.push(getIcon(Icons.adaBlackaaa));
  }else if (ada.black.aaSmallText) {
    results.push(getIcon(Icons.adaBlackaa));
  }else if (ada.black.aaLargeText) {
    results.push(getIcon(Icons.adaBlackAA));
  }

  return (
    <div
      key={`ada_${id}`}
      style={{
        width: '32px',
        position: 'relative',
        zIndex: 2,// could cause problems...but need shadow to work
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)'
      }}
      dangerouslySetInnerHTML={{ __html: 
        results.join('')
      }}>
    </div>
  );
}