


interface YoutubeRendererProps {
  src: string;
  type: "shorts" | "long";
}
export function YoutubeRenderer({src, type = "long"}: YoutubeRendererProps) {

  return(
    <div style={{display: 'flex', justifyContent: "center", width: '100%'}}>
      <iframe src={src} 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{aspectRatio: type === "shorts" ? "9/16" : "16/9", maxWidth: (type === 'shorts' ? '400px': undefined), width: '100%'}} />
    </div>
  )
}