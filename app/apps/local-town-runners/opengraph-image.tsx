import { ImageResponse } from "next/og";
export const alt = "Local Town Runners — Small towns. Big possibilities.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",justifyContent:"center",padding:80,background:"#1b2925",color:"#f4eee2"}}>
      <div style={{fontSize:22,letterSpacing:5,color:"#e4b574"}}>AIBRY LABS / LOCAL TOWN RUNNERS</div>
      <div style={{fontSize:88,fontWeight:700,marginTop:40}}>Small towns.</div>
      <div style={{fontSize:88,fontWeight:700,color:"#e4b574"}}>Big possibilities.</div>
      <div style={{fontSize:28,marginTop:35}}>Your neighbor is already going that way.</div>
    </div>, size
  );
}
